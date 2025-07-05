import NextAuth, { type DefaultSession } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Meta from "next-auth/providers/facebook";
import { apiClient } from "./apiClient";
import { UserResponse } from "./response-types";
import Logger from "./logger";

declare module "next-auth" {
	interface Session {
		accessToken?: string;
		backendToken?: string;
		user: {
			id: string;
		} & DefaultSession["user"];
	}

	interface JWT {
		accessToken?: string;
		backendToken?: string;
		backendUserId?: string;
	}
}

interface OAuthRequest {
	email: string;
	firstname: string;
	lastname: string;
	image: string;
	provider: string;
	providerId: string;
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

	debug: true, // Enable debug mode for better error reporting
	
	pages: {
		signIn: '/login', // Custom sign in page
		error: '/auth/error', // Custom error page  
	},

	callbacks: {
		async signIn({ user, account }) {
			try {
				if (
					!user?.email ||
					!user?.name ||
					!account?.provider ||
					!account?.providerAccountId
				) {
					Logger.error("Missing required OAuth data");
					return false;
				}

				const [firstname, ...lastnameParts] = user.name.split(" ");
				const lastname = lastnameParts.join(" ") || firstname;

				const response = await apiClient.post<UserResponse, OAuthRequest>(
					`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth`,
					{
						email: user.email,
						firstname,
						lastname,
						image: user.image || "",
						provider: account.provider,
						providerId: account.providerAccountId,
					}
				);

				if (!response) {
					Logger.error("Backend user creation failed");
					return false;
				}

				user.id = response.publicId;

				Logger.info(
					`User ${user.email} successfully authenticated via ${account.provider}`
				);
				return true;
			} catch (error) {
				if (
					typeof error === "object" &&
					error !== null &&
					"response" in error &&
					typeof (error as { response?: { status?: number } }).response !==
						"undefined" &&
					(error as { response?: { status?: number } }).response?.status === 409
				) {
					Logger.info(`User ${user?.email} already exists in backend`);
					return true;
				}
				Logger.error(`Backend user creation failed: ${error}`);
				return false;
			}
		},

		async jwt({ token, account, user }) {
			if (account?.access_token) {
				token.accessToken = account.access_token;
			}

			if (user?.id) {
				token.backendUserId = user.id;
			}

			return token;
		},

		async session({ session, token }) {
			if (token.backendUserId && session.user) {
				session.user.id = token.backendUserId as string;
			}

			if (token.accessToken) {
				session.accessToken = token.accessToken as string;
			}

			if (token.backendToken) {
				session.backendToken = token.backendToken as string;
			}

			return session;
		},
	},
});
