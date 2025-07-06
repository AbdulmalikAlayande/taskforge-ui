"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface TenantContextType {
	tenantId: string;
	tenantData: TenantData | null;
	isLoading: boolean;
	refreshTenant: () => void;
}

interface TenantData {
	id: string;
	name: string;
	slug: string;
	description?: string;
	industry?: string;
	country?: string;
	email?: string;
	phone?: string;
	timeZone?: string;
	websiteUrl?: string;
	logoUrl?: string;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
	const params = useParams();
	const tenantId = params.tenant as string;
	const [tenantData, setTenantData] = useState<TenantData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchTenantData = async () => {
		if (!tenantId) return;

		try {
			setIsLoading(true);
			const response = await fetch(`/api/tenant/${tenantId}`, {
				credentials: "include",
			});

			if (response.ok) {
				const data = await response.json();
				setTenantData(data);
			}
		} catch (error) {
			console.error("Error fetching tenant data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTenantData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tenantId]);

	const refreshTenant = () => {
		fetchTenantData();
	};

	return (
		<TenantContext.Provider
			value={{
				tenantId,
				tenantData,
				isLoading,
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
