"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import Link from "next/link";

export default function AuthError() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	const getErrorMessage = (errorType: string | null) => {
		switch (errorType) {
			case "Configuration":
				return "There is a problem with the server configuration. Please contact support.";
			case "AccessDenied":
				return "Access was denied. This could be due to missing permissions or an issue with your backend API.";
			case "Verification":
				return "The verification token has expired or has already been used.";
			case "Default":
			default:
				return "An unexpected error occurred during authentication. Please try again.";
		}
	};

	const getDebugInfo = (errorType: string | null) => {
		const debugInfo = [];

		if (errorType === "AccessDenied") {
			debugInfo.push(
				"• Check if your backend API is running on http://localhost:8080"
			);
			debugInfo.push(
				"• Verify your OAuth app redirect URL is set to http://localhost:3001/api/auth/callback/github"
			);
			debugInfo.push("• Check browser console for detailed error messages");
		}

		if (errorType === "Configuration") {
			debugInfo.push(
				"• Verify NEXTAUTH_SECRET is set in your environment variables"
			);
			debugInfo.push("• Check NEXTAUTH_URL matches your current domain");
			debugInfo.push(
				"• Ensure OAuth client credentials are correctly configured"
			);
		}

		return debugInfo;
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-red-600">Authentication Error</CardTitle>
					<CardDescription>{error && `Error: ${error}`}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-gray-600">{getErrorMessage(error)}</p>

					{getDebugInfo(error).length > 0 && (
						<div className="bg-gray-100 p-3 rounded text-xs">
							<p className="font-semibold mb-2">Debug Information:</p>
							<ul className="space-y-1">
								{getDebugInfo(error).map((info, index) => (
									<li key={index}>{info}</li>
								))}
							</ul>
						</div>
					)}

					<div className="flex space-x-2">
						<Button asChild variant="outline" className="flex-1">
							<Link href="/login">Try Again</Link>
						</Button>
						<Button asChild className="flex-1">
							<Link href="/">Go Home</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
