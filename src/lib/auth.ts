import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Meta from "next-auth/providers/facebook";
import { UserResponse } from "./response-types";
import { OAuthRequest } from "./request-types";
import { apiClient } from "./apiClient";
import Logger from "./logger";
declare module "next-auth" {
	interface Session {
		accessToken?: string;
		backendToken?: string;
		provider?: string;
		user: {
			id: string;
			email?: string | null;
			name?: string | null;
			image?: string | null;
		} & UserResponse;
	}

	interface User {
		id: string;
		email?: string | null;
		name?: string | null;
		image?: string | null;
		backendId?: string;
		backendData?: UserResponse;
	}

	interface JWT {
		backendId?: string;
		backendData?: UserResponse;
		provider?: string;
		accessToken?: string;
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
		}),
		Apple({
			clientId: process.env.APPLE_CLIENT_ID!,
			clientSecret: process.env.APPLE_CLIENT_SECRET!,
		}),
		Meta({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
		}),
	],

	callbacks: {
		async signIn({ user, account }) {
			try {
				Logger.info(`OAuth signIn attempt with ${account?.provider}`, {
					email: user.email,
					provider: account?.provider,
					hasEmail: !!user?.email,
					hasName: !!user?.name,
				});

				if (!user?.email) {
					Logger.error("Missing email from OAuth provider", { user, account });
					return false;
				}

				// Allow sign in even without name - we'll generate it
				let lastname: string = "";
				let firstname: string = "";
				let lastnameParts: string[] = [];

				if (user.name) {
					[firstname, ...lastnameParts] = user.name.split(" ");
					lastname = lastnameParts.join(" ") || "";
				} else {
					// Generate name from email if not provided
					firstname = user.email.split("@")[0];
					lastname = "";
				}

				const oauthData: OAuthRequest = {
					email: user.email,
					firstname,
					lastname,
					image: user.image || "",
					provider: account?.provider || "",
					providerId: account?.providerAccountId || "",
				};

				Logger.info("Sending OAuth data to backend", {
					email: oauthData.email,
					provider: oauthData.provider,
					apiUrl: process.env.NEXT_PUBLIC_API_URL,
				});

				// Check if API URL is configured
				if (!process.env.NEXT_PUBLIC_API_URL) {
					Logger.error("NEXT_PUBLIC_API_URL not configured");
					// For development, allow sign-in without backend sync
					if (process.env.NODE_ENV === "development") {
						Logger.warning("Development mode: proceeding without backend sync");
						user.id = user.email; // Use email as fallback ID
						user.backendId = user.email;
						user.backendData = {
							publicId: user.email,
							email: user.email,
							firstname,
							lastname,
							image: user.image || "",
						} as UserResponse;
						return true;
					}
					return false;
				}

				const response = await apiClient.post<UserResponse, OAuthRequest>(
					`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth`,
					oauthData
				);

				if (!response) {
					Logger.error("Backend sync failed: No response from server");
					// For development, allow sign-in without backend sync
					if (process.env.NODE_ENV === "development") {
						Logger.warning("Development mode: proceeding without backend sync");
						user.id = user.email;
						user.backendId = user.email;
						user.backendData = {
							publicId: user.email,
							email: user.email,
							firstname,
							lastname,
							image: user.image || "",
						} as UserResponse;
						return true;
					}
					return false;
				}

				// Store backend data in the user object
				user.id = response.publicId;
				user.backendId = response.publicId;
				user.backendData = response;

				Logger.info(
					`User ${user.email} successfully authenticated and synced`,
					{
						backendId: response.publicId,
					}
				);
				return true;
			} catch (error) {
				Logger.error(`OAuth signIn failed:`, {
					error: error instanceof Error ? error.message : error,
					provider: account?.provider,
					email: user?.email,
				});

				// For development, be more lenient
				if (process.env.NODE_ENV === "development") {
					Logger.warning(
						"Development mode: allowing sign-in despite backend error"
					);
					user.id = user.email || "dev-user";
					user.backendId = user.email || "dev-user";
					user.backendData = {
						publicId: user.email || "dev-user",
						email: user.email || "",
						firstname: user.name?.split(" ")[0] || "Dev",
						lastname: user.name?.split(" ").slice(1).join(" ") || "User",
						image: user.image || "",
					} as UserResponse;
					return true;
				}

				return false;
			}
		},

		async jwt({ token, user, account }) {
			if (user?.backendId) {
				token.backendId = user.backendId;
			}

			if (user?.backendData) {
				token.backendData = user.backendData;
			}

			if (account) {
				token.provider = account.provider;
				token.accessToken = account.access_token;
			}

			return token;
		},

		async session({ session, token }) {
			if (token.backendId && session.user) {
				session.user.id = token.backendId as string;
			}

			if (token.backendData && session.user) {
				session.user = {
					...session.user,
					...token.backendData,
					id: token.backendId as string,
				};
			}

			if (token.provider) {
				session.provider = token.provider as string;
			}

			if (token.accessToken) {
				session.accessToken = token.accessToken as string;
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
