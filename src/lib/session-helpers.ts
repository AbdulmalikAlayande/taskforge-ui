import { Session } from "next-auth";
import { LoginRequest } from "./request-types";
import { apiClient } from "./apiClient";
import { LoginResponse } from "./response-types";

/**
 * Performs email/password login and updates the NextAuth session with tokens
 * @param request Login credentials
 * @param updateSession Function to update the session (from useSession)
 * @returns The login response data
 */
export async function loginAndUpdateSession(
	request: LoginRequest,
	updateSession: (data?: Session | null) => Promise<Session | null>
) {
	const response = await apiClient.post<LoginResponse, LoginRequest>(
		`/api/auth/login`,
		request
	);

	// Update the NextAuth session with the tokens
	await updateSession({
		...(await updateSession()),
		accessToken: response.accessToken,
		refreshToken: response.refreshToken,
		user: {
			...((await updateSession())?.user || {}),
			...response,
		},
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
	} as Session);

	return response;
}
