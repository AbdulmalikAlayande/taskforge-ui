"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logger from "@src/lib/logger";

export default function AuthSuccessPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") return;

		if (!session) {
			router.push("/login");
			return;
		}

		const handlePostAuth = async () => {
			try {
				const authIntent = sessionStorage.getItem("auth_intent");
				const authProvider = sessionStorage.getItem("auth_provider");

				// Clean up session storage
				sessionStorage.removeItem("auth_intent");
				sessionStorage.removeItem("auth_provider");

				Logger.info("OAuth success", {
					intent: authIntent,
					provider: authProvider,
					userId: session.user.id,
				});

				if (authIntent === "signup") {
					// New user signup - go to onboarding
					toast.success("Account created successfully!", {
						description:
							"Welcome to TaskForge! Let's set up your organization.",
					});

					router.push(`/onboarding/organization?userId=${session.user.id}`);
				} else {
					// Existing user login - check for organizations
					try {
						const response = await fetch("/api/user/organizations");

						if (response.ok) {
							const organizations = await response.json();

							if (organizations.length > 0) {
								toast.success("Welcome back!");
								router.push(`/${organizations[0].slug}/projects`);
							} else {
								toast.success("Welcome back!", {
									description: "Let's set up your organization.",
								});
								router.push(
									`/onboarding/organization?userId=${session.user.id}`
								);
							}
						} else {
							// Fallback to onboarding
							router.push(`/onboarding/organization?userId=${session.user.id}`);
						}
					} catch (error) {
						Logger.error("Failed to fetch organizations:", { error });
						// Fallback to onboarding
						router.push(`/onboarding/organization?userId=${session.user.id}`);
					}
				}
			} catch (error) {
				Logger.error("Post-auth handling failed:", { error });
				toast.error("Something went wrong", {
					description: "Please try again or contact support.",
				});
				router.push("/login");
			}
		};

		handlePostAuth();
	}, [session, status, router]);

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Completing authentication...</p>
				</div>
			</div>
		);
	}

	return null;
}
