import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { UserResponse } from "./response-types";
import { getApiUrl } from "./config";
import { apiClient } from "./apiClient";

declare module "next-auth" {
	interface Session {
		backendToken?: string;
		refreshToken?: string;
		provider?: string;
		user: {
			id: string;
			email?: string | null;
			name?: string | null;
			image?: string | null;
		} & Partial<UserResponse>;
	}

	interface User {
		id: string;
		email?: string | null;
		name?: string | null;
		image?: string | null;
		backendToken?: string;
		refreshToken?: string;
	}
}

export const { auth, handlers, signIn, signOut } = NextAuth({
	providers: [
		Github({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],

	cookies: {
		sessionToken: {
			name: "next-auth.session-token",
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: process.env.NODE_ENV === "production",
			},
		},
	},

	callbacks: {
		/**
		 * CRITICAL FIX: This callback now properly:
		 * 1. Sends OAuth token to YOUR backend
		 * 2. Receives YOUR JWT tokens back
		 * 3. Stores YOUR tokens for API calls
		 */
		async signIn({ user, account, profile }) {
			if (!user || !account) {
				return false;
			}

			try {
				console.log("Processing OAuth sign in for provider:", account.provider);

				const response = await apiClient.post<{
					userId: string;
					email: string;
					accessToken: string;
					refreshToken: string;
					tenantId?: string;
					organizationId?: string;
				}>(getApiUrl("/api/auth/oauth"), {
					provider: account.provider,
					accessToken: account.access_token,
					email: user.email,
					name: user.name || profile?.name,
					imageUrl: user.image,
					providerId: account.providerAccountId,
				});

				console.log("Backend OAuth response received");

				user.backendToken = response.accessToken;
				user.refreshToken = response.refreshToken;
				user.id = response.userId;

				if (response.tenantId) {
					sessionStorage.setItem("current_tenant_id", response.tenantId);
				}

				return true;
			} catch (error) {
				console.error("Backend OAuth integration failed:", error);
				return false;
			}
		},

		async jwt({ token, user, account, trigger }) {
			// Initial sign in
			if (user) {
				token.backendToken = user.backendToken;
				token.refreshToken = user.refreshToken;
				token.userId = user.id;
				token.provider = account?.provider;
			}

			// Handle token refresh if needed
			if (trigger === "update" && token.refreshToken) {
				try {
					// Call your backend refresh endpoint
					const response = await apiClient.post<{
						accessToken: string;
						refreshToken: string;
					}>(
						getApiUrl("/api/auth/refresh"),
						{},
						{
							headers: {
								"X-Refresh-Token": token.refreshToken as string,
							},
						}
					);

					token.backendToken = response.accessToken;
					token.refreshToken = response.refreshToken;
				} catch (error) {
					console.error("Token refresh failed:", error);
					// Token refresh failed, user needs to re-login
					return null;
				}
			}

			return token;
		},

		/**
		 * Session callback - Make YOUR backend token available to the frontend
		 */
		async session({ session, token }) {
			if (token) {
				session.backendToken = token.backendToken as string;
				session.refreshToken = token.refreshToken as string;
				session.provider = token.provider as string;
				session.user.id = token.userId as string;
			}
			return session;
		},
	},

	pages: {
		signIn: "/login",
		error: "/auth/error",
	},

	debug: process.env.NODE_ENV === "development",
});
