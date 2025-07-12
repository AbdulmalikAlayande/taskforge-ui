"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logger from "@src/lib/logger";
import { useUserStorage } from "@src/app/hooks/useUserStorage";
import useIndexedDB from "@src/lib/useIndexedDB";

export default function AuthSuccessPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { getUserData } = useUserStorage();
	const { getOrganization } = useIndexedDB();

	const userData = getUserData();

	useEffect(() => {
		if (status === "loading") return;

		if (!session?.user && !userData) {
			Logger.warning("No authenticated user found, redirecting to login");
			router.push("/login");
			return;
		}

		const handlePostAuth = async () => {
			try {
				const authIntent = sessionStorage.getItem("auth_intent");
				const authProvider = sessionStorage.getItem("auth_provider");

				sessionStorage.removeItem("auth_intent");
				sessionStorage.removeItem("auth_provider");

				/** If the auth intent is a sign up, I want to route them to organization creation page
				 * If the signup is an oauth signup, their Id(userId) will be gotten from the session object
				 * If the sign up is a normal sign up, their Id will be gotten from the user context with useUserStorage hook
				 */

				/**
				 * If the auth intent is a login, I want to route them to their dashboard page, maybe home or projects page
				 * If the signup is an oauth signup, their Id(userId) will be gotten from the session object
				 * If the sign up is a normal sign up, their Id will be gotten from the user context with useUserStorage hook
				 */
				Logger.info("OAuth success", {
					intent: authIntent,
					provider: authProvider,
					userId: session?.user?.id || userData?.publicId,
				});

				if (authIntent === "signup") {
					toast.success("Account created successfully!", {
						description:
							"Welcome to TaskForge! Let's set up your organization.",
					});

					const userId = session?.user?.id || userData?.publicId;
					router.push(`/onboarding/organization?uid=${userId}`);
				} else if (authIntent === "login" || !authIntent) {
					toast.success("Login successful!", {
						description: "Welcome back to TaskForge!",
					});

					const userId =
						session?.user?.id ||
						userData?.publicId ||
						localStorage.getItem("user_id") ||
						sessionStorage.getItem("user_id");

					const organization = await getOrganization("");
					const tenantId = organization?.publicId;
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

		handlePostAuth();
	}, [session, status, router, userData]);

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
