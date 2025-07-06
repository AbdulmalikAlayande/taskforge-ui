import { useRouter } from "next/navigation";
import { useTenant } from "@src/components/tenant-provider";

/**
 * Hook for tenant-aware navigation
 */
export function useTenantNavigation() {
	const router = useRouter();
	const { tenantId } = useTenant();

	const navigateToTenantRoute = (route: string) => {
		if (!tenantId) {
			console.error("No tenant ID available for navigation");
			return;
		}

		const cleanRoute = route.startsWith("/") ? route.slice(1) : route;
		router.push(`/${tenantId}/${cleanRoute}`);
	};

	const navigateToProjects = () => navigateToTenantRoute("projects");
	const navigateToTasks = () => navigateToTenantRoute("tasks");
	const navigateToInbox = () => navigateToTenantRoute("inbox");
	const navigateToInsights = () => navigateToTenantRoute("insights");

	return {
		navigateToTenantRoute,
		navigateToProjects,
		navigateToTasks,
		navigateToInbox,
		navigateToInsights,
		tenantId,
	};
}

/**
 * Utility function to build tenant-aware URLs
 */
export function buildTenantUrl(tenantId: string, route: string): string {
	const cleanRoute = route.startsWith("/") ? route.slice(1) : route;
	return `/${tenantId}/${cleanRoute}`;
}

/**
 * Utility function to extract tenant ID from pathname
 */
export function extractTenantFromPath(pathname: string): string | null {
	const pathSegments = pathname.split("/").filter(Boolean);
	return pathSegments[0] || null;
}
