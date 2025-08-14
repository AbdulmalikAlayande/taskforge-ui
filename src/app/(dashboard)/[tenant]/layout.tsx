"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { TenantProvider } from "@src/components/tenant-provider";
import { useUserStorage } from "@src/app/hooks/useUserStorage";
import Logger from "@src/lib/logger";

interface TenantLayoutProps {
	children: React.ReactNode;
}

export default function TenantLayout({ children }: TenantLayoutProps) {
	const router = useRouter();
	const { data: session, status } = useSession();
	const { getUserData, getCurrentTenantId } = useUserStorage();
	const params = useParams<{ tenant: string }>();

	useEffect(() => {
		const validateTenantAccess = async () => {
			if (status === "loading") return;

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
				localStorage.getItem("user_public_id");

			const currentTenantId = getCurrentTenantId();
			const userData = getUserData();
			const isCustomLoginAuthenticated =
				hasAccessToken && hasRefreshToken && storedUserId;
			const isOAuthAuthenticated = session?.user;

			Logger.info("Tenant layout - Authentication check", {
				tenant: params.tenant,
				currentTenantId,
				nextAuthStatus: status,
				nextAuthSession: !!session?.user,
				customLoginTokens: {
					hasAccessToken: !!hasAccessToken,
					hasRefreshToken: !!hasRefreshToken,
					hasUserId: !!storedUserId,
				},
				userData: !!userData,
				isAuthenticated: isCustomLoginAuthenticated || isOAuthAuthenticated,
			});

			// Check if user is authenticated via either method
			if (!isCustomLoginAuthenticated && !isOAuthAuthenticated) {
				Logger.warning("No authentication found, redirecting to login", {
					customAuth: isCustomLoginAuthenticated,
					oauthAuth: isOAuthAuthenticated,
					status,
				});
				router.push("/login");
				return;
			}

			// Validate tenant access - check if URL tenant matches stored tenant
			if (currentTenantId && params.tenant !== currentTenantId) {
				Logger.warning("Tenant mismatch detected", {
					urlTenant: params.tenant,
					storedTenant: currentTenantId,
				});
				// Redirect to the correct tenant
				router.push(`/${currentTenantId}/projects?uid=${storedUserId}`);
				return;
			}

			// User is authenticated - proceed with tenant access
			Logger.info("User authenticated, allowing tenant access", {
				authMethod: isCustomLoginAuthenticated ? "custom" : "oauth",
				tenant: params.tenant,
				tenantMatch: currentTenantId === params.tenant,
			});
		};

		validateTenantAccess();
	}, [session, status, params.tenant, router, getUserData, getCurrentTenantId]);

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading organization...</p>
				</div>
			</div>
		);
	}

	// Provide tenant context to all child components
	return (
		<TenantProvider>
			<div data-tenant={params.tenant}>{children}</div>
		</TenantProvider>
	);
}
