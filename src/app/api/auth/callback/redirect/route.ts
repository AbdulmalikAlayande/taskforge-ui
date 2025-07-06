import { NextRequest, NextResponse } from "next/server";
import { auth } from "@src/lib/auth";

export async function GET(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user) {
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}
		// Check if user has existing organizations
		// try {
		// 	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/organizations`, {
		// 		headers: {
		// 			'Authorization': `Bearer ${session.accessToken}`,
		// 			'Content-Type': 'application/json',
		// 		},
		// 	});

		// 	if (response.ok) {
		// 		const organizations = await response.json();

		// 		if (organizations && organizations.length > 0) {
		// 			// User has organizations, redirect to the first one (or last used)
		// 			const primaryOrg = organizations[0]; // You might want to implement "last used" logic
		// 			return NextResponse.redirect(
		// 				new URL(`/${primaryOrg.slug}/projects`, request.url)
		// 			);
		// 		}
		// 	}
		// } catch (error) {
		// 	console.error("Error fetching user organizations:", error);
		// }

		// No organizations found or error occurred, redirect to onboarding
		return NextResponse.redirect(
			new URL("/onboarding/organization", request.url)
		);
	} catch (error) {
		console.error("Auth callback error:", error);
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}
}
