import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { UserResponse } from "./response-types";

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
		async jwt({ token, user, account }) {
			console.log("JWT callback:", { token, user, account });

			if (user?.backendId) {
				token.backendId = user.backendId;
			}

			if (user?.backendData) {
				token.backendData = user.backendData;
			}

			if (account) {
				token.provider = account.provider;
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
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

			if (token.refreshToken) {
				session.refreshToken = token.refreshToken as string;
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
