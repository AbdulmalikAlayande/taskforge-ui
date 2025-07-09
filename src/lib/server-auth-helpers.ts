import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginResponse } from "@/lib/response-types";
import { login } from "@/lib/utils";

export async function serverSideLogin(email: string, password: string) {
	try {
		// Call your login function to get tokens
		const response = await login({ email, password });

		// Get the current session
		const session = await auth();

		if (session) {
			// Update session with tokens from login response
			// Note: This is a simplified example - in practice, you'd need to
			// update the JWT and session in the database or via a dedicated API route
			session.accessToken = response.accessToken;
			session.refreshToken = response.refreshToken;

			// Update user info
			if (session.user && response.user) {
				session.user = {
					...session.user,
					...response.user,
				};
			}

			return response;
		}

		return null;
	} catch (error) {
		console.error("Server-side login error:", error);
		throw error;
	}
}
