"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Logger from "@src/lib/logger";
import { useApiClient } from "@src/app/hooks/useApiClient";
import { OrganizationResponse } from "@src/lib/response-types";
import useIndexedDB from "@src/lib/useIndexedDB";

interface TenantContextType {
	tenantId: string;
	organization: OrganizationResponse | null;
	isLoading: boolean;
	error: string | null;
	refreshOrganization: () => Promise<void>;
	// Legacy support - will be deprecated
	tenantData: OrganizationResponse | null;
	refreshTenant: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
	const params = useParams<{ tenant: string }>();
	const { apiClient } = useApiClient();
	const { getOrganization, saveOrganization } = useIndexedDB();
	const tenantId = params.tenant;
	const [organization, setOrganization] = useState<OrganizationResponse | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchOrganizationData = async () => {
		Logger.debug("Fetching organization data for tenant:", { tenantId });
		if (!tenantId) {
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			// Try to get from IndexedDB first for faster loading
			const cachedOrg = await getOrganization(tenantId);
			if (cachedOrg) {
				setOrganization(cachedOrg);
			}

			// Fetch fresh data from API
			const response = await apiClient.get<OrganizationResponse>(
				`/organization/${tenantId}`
			);

			if (response) {
				setOrganization(response);
				// Cache the updated data
				await saveOrganization(tenantId, response);
			}
		} catch (error) {
			console.error("Error fetching organization data:", error);
			setError(
				error instanceof Error ? error.message : "Failed to load organization"
			);

			// If API fails but we have cached data, continue with cached data
			if (!organization) {
				const cachedOrg = await getOrganization(tenantId);
				if (cachedOrg) {
					setOrganization(cachedOrg);
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	const refreshOrganization = async () => {
		await fetchOrganizationData();
	};

	// Legacy support
	const refreshTenant = () => {
		fetchOrganizationData();
	};

	useEffect(() => {
		fetchOrganizationData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tenantId]);

	return (
		<TenantContext.Provider
			value={{
				tenantId,
				organization,
				isLoading,
				error,
				refreshOrganization,
				// Legacy support
				tenantData: organization,
				refreshTenant,
			}}
		>
			{children}
		</TenantContext.Provider>
	);
}

export function useTenant() {
	const context = useContext(TenantContext);
	if (context === undefined) {
		throw new Error("useTenant must be used within a TenantProvider");
	}
	return context;
}

// Enhanced hook with organization-specific utilities
export function useOrganization() {
	const context = useTenant();

	return {
		// Core organization data
		tenantId: context.tenantId,
		organization: context.organization,
		isLoading: context.isLoading,
		error: context.error,

		// Organization utilities
		refreshOrganization: context.refreshOrganization,

		// Computed properties
		organizationName: context.organization?.name || "",
		organizationSlug: context.organization?.slug || "",
		projects: context.organization?.projects || [],

		// Checks
		hasOrganization: !!context.organization,
		hasProjects: (context.organization?.projects?.length || 0) > 0,

		// Project utilities
		getProject: (projectId: string) =>
			context.organization?.projects?.find((p) => p.id === projectId),

		getProjectsByStatus: (status: string) =>
			context.organization?.projects?.filter((p) => p.status === status) || [],

		// Legacy support
		tenantData: context.tenantData,
		refreshTenant: context.refreshTenant,
	};
}
