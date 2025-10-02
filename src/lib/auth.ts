import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { UserResponse } from "./response-types";
import { getApiUrl } from "./config";
import { apiClient } from "./apiClient";

declare module "next-auth" {
	interface Session {
		accessToken?: string;
		backendToken?: string;
		refreshToken?: string;
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

	// Chrome-specific cookie configuration
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
		async signIn({ user, account, profile }) {
			if (!user && !account) {
				return false;
			}
			try {
				const response = await apiClient.post(getApiUrl("/api/auth/oauth"), {
					provider: account?.provider,
					accessToken: account?.access_token,
					email: user.email,
					name: user.name || profile?.name,
					imageUrl: user.image,
					providerId: account?.providerAccountId,
				});
				console.log("OAuth backend response:", response);

				return true;
			} catch (error) {
				console.error("Backend OAuth integration failed:", error);
				return false;
			}
		},

		async jwt({ token, user, account }) {
			return { ...token, ...user, ...account };
		},
	},

	pages: {
		signIn: "/login",
		error: "/auth/error",
	},

	debug: process.env.NODE_ENV === "development",
});
