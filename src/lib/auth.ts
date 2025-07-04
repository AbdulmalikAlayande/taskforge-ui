import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Meta from "next-auth/providers/facebook";

export const { auth, handlers, signIn, signOut } = NextAuth({
	providers: [
		Github({
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		Apple({
			clientId: process.env.APPLE_CLIENT_ID as string,
			clientSecret: process.env.APPLE_CLIENT_SECRET as string,
		}),
		Meta({
			clientId: process.env.FACEBOOK_CLIENT_ID as string,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
		}),
	],
});
