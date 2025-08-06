import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LoginRequest } from "./request-types";
import { apiClient } from "./apiClient";
import { LoginResponse } from "./response-types";
import { Session } from "next-auth";
import Logger from "./logger";
import { Cuboid, Club } from "lucide-react";
import { getApiUrl } from "./config";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function login(
	request: LoginRequest,
	updateSession: (data?: Session | null) => Promise<Session | null>
): Promise<LoginResponse> {
	try {
		Logger.debug(`Login function called with email: ${request.email}`);

		const response = await apiClient.post<LoginResponse, LoginRequest>(
			getApiUrl("/auth/login"),
			request
		);
		if (!response) {
			throw new Error("Login failed: Empty response from server");
		}

		Logger.debug(
			"Login API response received: " +
				JSON.stringify({
					hasAccessToken: !!response.accessToken,
					hasRefreshToken: !!response.refreshToken,
					userId: response.userId,
				})
		);

		if (!response.accessToken || !response.refreshToken) {
			throw new Error("Login failed: Missing tokens in response");
		}

		try {
			const currentSession = await updateSession();
			Logger.debug(
				"Current session before update: " +
					JSON.stringify({
						hasAccessToken: !!currentSession?.accessToken,
						userId: currentSession?.user?.id,
					})
			);

			const sessionUpdateData = {
				accessToken: response.accessToken,
				refreshToken: response.refreshToken,
				backendToken: response.refreshToken,
				user: {
					...(currentSession?.user || {}),
					id: response.userId || currentSession?.user?.id || "",
					email: currentSession?.user.email,
					publicId: currentSession?.user.publicId,
					firstName: currentSession?.user.name,
					lastName: currentSession?.user.name,
					image: currentSession?.user.image,
				},
				expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
			} as Session;

			Logger.debug(
				"Session update data prepared: " +
					JSON.stringify({
						accessToken: sessionUpdateData.accessToken ? "present" : "missing",
						refreshToken: sessionUpdateData.refreshToken
							? "present"
							: "missing",
						userId: sessionUpdateData.user?.id,
					})
			);

			const updatedSession = await updateSession(sessionUpdateData);

			Logger.debug(
				"Session update result: " +
					JSON.stringify({
						successful: !!updatedSession,
						hasAccessToken: !!updatedSession?.accessToken,
						userId: updatedSession?.user?.id,
					})
			);

			const manualUpdateResult = manuallyUpdateAuthSession(response);
			Logger.info("Manual session update result:", { manualUpdateResult });
		} catch (sessionError: unknown) {
			Logger.error("Error updating session:", { sessionError });
		}

		return response;
	} catch (error: unknown) {
		Logger.error("Login function error:", { error });
		throw error;
	}
}

const manuallyUpdateAuthSession = (loginResponse: LoginResponse) => {
	try {
		Logger.debug("Attempting to manually update auth session storage");
		const existingSessionStr =
			localStorage.getItem("next-auth.session-token") ||
			sessionStorage.getItem("next-auth.session-token");

		if (!existingSessionStr) {
			Logger.warning("No existing session found in storage");
		}

		if (loginResponse.accessToken) {
			sessionStorage.setItem(
				"next-auth.access-token",
				loginResponse.accessToken
			);
			Logger.debug("Access token stored in session storage");
		}

		if (loginResponse.refreshToken) {
			sessionStorage.setItem(
				"next-auth.refresh-token",
				loginResponse.refreshToken
			);
			Logger.debug("Refresh token stored in session storage");
		}

		return true;
	} catch (error) {
		Logger.error("Error manually updating auth session:", { error });
		return false;
	}
};

export const defaultIdustries = [
	"Technology",
	"Healthcare",
	"Finance",
	"Education",
	"Manufacturing",
	"Retail",
	"Consulting",
	"Marketing",
	"Real Estate",
	"Non-profit",
	"Other",
];

// Common countries for dropdown
export const defaultCountries = [
	"United States",
	"Canada",
	"United Kingdom",
	"Germany",
	"France",
	"Australia",
	"Japan",
	"Singapore",
	"India",
	"Brazil",
	"Other",
];

// Common time zones
export const defaultTimeZones = [
	"UTC-12:00 (Baker Island)",
	"UTC-11:00 (American Samoa)",
	"UTC-10:00 (Hawaii)",
	"UTC-09:00 (Alaska)",
	"UTC-08:00 (Pacific Time)",
	"UTC-07:00 (Mountain Time)",
	"UTC-06:00 (Central Time)",
	"UTC-05:00 (Eastern Time)",
	"UTC-04:00 (Atlantic Time)",
	"UTC-03:00 (Argentina)",
	"UTC-02:00 (Mid-Atlantic)",
	"UTC-01:00 (Azores)",
	"UTC+00:00 (GMT/London)",
	"UTC+01:00 (Central Europe)",
	"UTC+02:00 (Eastern Europe)",
	"UTC+03:00 (Moscow)",
	"UTC+04:00 (Dubai)",
	"UTC+05:00 (Pakistan)",
	"UTC+05:30 (India)",
	"UTC+06:00 (Bangladesh)",
	"UTC+07:00 (Bangkok)",
	"UTC+08:00 (Singapore/China)",
	"UTC+09:00 (Japan/Korea)",
	"UTC+10:00 (Australia East)",
	"UTC+11:00 (Australia Central)",
	"UTC+12:00 (New Zealand)",
];

export function formatGMTOffset(gmtOffset: number, zoneName: string) {
	const hours = Math.floor(Math.abs(gmtOffset) / 3600);
	const minutes = Math.floor((Math.abs(gmtOffset) % 3600) / 60);
	const sign = gmtOffset >= 0 ? "+" : "-";

	const paddedHours = String(hours).padStart(2, "0");
	const paddedMinutes = String(minutes).padStart(2, "0");

	const friendlyName = (zoneName.split("/").pop() ?? "").replace("_", " ");

	return `UTC${sign}${paddedHours}:${paddedMinutes} (${friendlyName})`;
}

export const defaultTeams = [
	{
		name: "Apex",
		logo: Cuboid,
		plan: "Free",
	},
	{
		name: "Bloggy",
		logo: Club,
		plan: "Premium",
	},
];
