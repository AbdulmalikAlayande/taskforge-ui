import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LoginRequest } from "./request-types";
import { apiClient } from "./apiClient";
import { LoginResponse } from "./response-types";
import { Session } from "next-auth";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function login(
	request: LoginRequest,
	updateSession: (data?: Session | null) => Promise<Session | null>
): Promise<LoginResponse> {
	const response = await apiClient.post<LoginResponse, LoginRequest>(
		`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
		request
	);

	await updateSession({
		...(await updateSession()),
		accessToken: response.accessToken,
		refreshToken: response.refreshToken,
		backendToken: response.refreshToken,
		user: {
			...((await updateSession())?.user || {}),
			...response,
		},
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
	} as Session);

	console.log("Sike:: ", response);
	return response;
}

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
