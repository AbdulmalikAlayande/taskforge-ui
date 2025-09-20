"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logger from "@src/lib/logger";
import { useUserStorage } from "@src/app/hooks/useUserStorage";

export default function AuthSuccessPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { getUserData, getCurrentTenantId } = useUserStorage();

	useEffect(() => {
		if (status === "loading") return;

		const userData = getUserData();

		const checkAuthenticationState = async () => {
			const isChromium = /Chrome|Chromium|Edg|Brave/.test(navigator.userAgent);
			const isFirefox = /Firefox/.test(navigator.userAgent);

			// Check for custom login tokens (from your login form)
			const hasAccessToken =
				sessionStorage.getItem("next-auth.access-token") ||
				localStorage.getItem("next-auth.access-token");
			const hasRefreshToken =
				sessionStorage.getItem("next-auth.refresh-token") ||
				localStorage.getItem("next-auth.refresh-token");
			const storedUserId =
				sessionStorage.getItem("user_id") ||
				localStorage.getItem("user_id") ||
				sessionStorage.getItem("user_public_id") ||
				localStorage.getItem("user_public_id") ||
				(userData && typeof userData === "object" && "publicId" in userData
					? (userData as { publicId: string }).publicId
					: null);

			Logger.info("Auth success page - Authentication state check", {
				userAgent: navigator.userAgent,
				browser: isChromium
					? "Chromium-based"
					: isFirefox
						? "Firefox"
						: "Other",
				nextAuthStatus: status,
				nextAuthSession: !!session?.user,
				customLoginTokens: {
					hasAccessToken: !!hasAccessToken,
					hasRefreshToken: !!hasRefreshToken,
					hasUserId: !!storedUserId,
				},
				userData,
			});

			// For custom login (form-based), tokens are already stored
			if (hasAccessToken && storedUserId) {
				Logger.info("Custom login detected - proceeding with stored tokens", {
					userId: storedUserId,
					hasTokens: true,
				});

				// Proceed with custom login flow
				await handleAuthenticationSuccess(storedUserId, userData, "custom");
				return;
			}

			// For OAuth logins, wait for NextAuth session
			if (isChromium) {
				let attempts = 0;
				const maxAttempts = 15;
				const pollInterval = 1000;

				const pollForSession = async (): Promise<boolean> => {
					attempts++;
					Logger.info(`OAuth session poll attempt ${attempts}/${maxAttempts}`, {
						hasSession: !!session?.user,
						sessionStatus: status,
						sessionData: session,
					});

					if (session?.user) {
						Logger.info("OAuth session found via polling!", { session });
						return true;
					}

					if (attempts >= maxAttempts) {
						Logger.error("OAuth session polling timeout reached", {
							attempts,
							finalStatus: status,
							finalSession: session,
						});
						return false;
					}

					await new Promise((resolve) => setTimeout(resolve, pollInterval));
					return pollForSession();
				};

				const hasValidSession = await pollForSession();
				if (!hasValidSession) {
					Logger.warning("No OAuth session found after polling", {
						session,
						attempts,
					});
					router.push("/login");
					return;
				}

				await handleAuthenticationSuccess(
					session!.user.id || sessionStorage.getItem("user_id")!,
					userData,
					"oauth"
				);
			} else {
				// Firefox - simple wait for OAuth
				await new Promise((resolve) => setTimeout(resolve, 2000));
				if (!session?.user) {
					Logger.warning("No OAuth session found after waiting (Firefox)", {
						session,
					});
					router.push("/login");
					return;
				}

				await handleAuthenticationSuccess(
					session!.user.id || sessionStorage.getItem("user_id")!,
					userData,
					"oauth"
				);
			}
		};

		const handleAuthenticationSuccess = async (
			userId: string,
			userData: unknown,
			authType: "custom" | "oauth"
		) => {
			try {
				const authIntent = sessionStorage.getItem("auth_intent");
				const authProvider = sessionStorage.getItem("auth_provider");

				sessionStorage.removeItem("auth_intent");
				sessionStorage.removeItem("auth_provider");

				Logger.info("Authentication success handling", {
					authType,
					intent: authIntent,
					provider: authProvider,
					userId,
				});

				if (authIntent === "signup") {
					toast.success("Account created successfully!", {
						description:
							"Welcome to TaskForge! Let's set up your organization.",
					});

					router.push(`/onboarding/organization?uid=${userId}`);
				} else if (authIntent === "login" || !authIntent) {
					toast.success("Login successful!", {
						description: "Welcome back to TaskForge!",
					});

					const tenantId = getCurrentTenantId();
					if (!tenantId) {
						Logger.error("No tenant ID found after login", {
							storedTenantId: tenantId,
							userId: userId,
						});
						router.push("/login");
						return;
					}

					router.push(`/${tenantId}/projects?uid=${userId}`);
				} else {
					Logger.warning("Unknown auth intent", { authIntent });
					router.push("/");
				}
			} catch (error) {
				Logger.error("Post-auth handling failed:", { error });
				toast.error("Something went wrong", {
					description: "Please try again or contact support.",
				});
				router.push("/login");
			}
		};

		checkAuthenticationState();
	}, [session, status, router, getUserData, getCurrentTenantId]);

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
