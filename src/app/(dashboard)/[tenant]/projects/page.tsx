"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import { AppNavbar } from "../components/navbar/app-navbar";
import { useTenant } from "@src/components/tenant-provider";
import { useSearchParams } from "next/navigation";
import Logger from "@src/lib/logger";
import { useFetch } from "@src/app/hooks/useFetch";
import { OrganizationResponse } from "@src/lib/response-types";
import useIndexedDB from "@src/lib/useIndexedDB";

const defaultOrganizationData = {
	publicId: "",
	name: "string",
	email: "",
	slug: "",
	description: "",
	industry: "",
	country: "",
	phone: "",
	timeZone: "",
	websiteUrl: "",
	logoUrl: "",
};

const Project = () => {
	const { isLoading, tenantId } = useTenant();
	const searchParams = useSearchParams();
	const userId = searchParams.get("uid");
	const { getOrganization } = useIndexedDB();
	const [organization, setOrganization] = useState<OrganizationResponse>(
		defaultOrganizationData
	);

	const fetchConfig = useMemo(
		() => ({
			enabled: !!tenantId,
			url: `${process.env.NEXT_PUBLIC_API_URL!}/organization/${tenantId}`,
			queryKey: [`organization-${tenantId}`],
			retry: 3,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000,
		}),
		[tenantId]
	);

	const { data } = useFetch<OrganizationResponse>(fetchConfig);

	const loadOrganization = useCallback(async () => {
		try {
			const org = await getOrganization(tenantId);
			if (org) {
				setOrganization(org);
				return;
			}

			if (data) {
				setOrganization(data);
			}
		} catch (error) {
			Logger.error("Failed to load organization data", {
				error: String(error),
			});
		}
	}, [data, getOrganization, tenantId]);

	useEffect(() => {
		if (tenantId) {
			Logger.debug("Loading organization data for tenant:", {
				tenantId,
				userId,
			});
			loadOrganization();
		}
	}, [tenantId, userId, loadOrganization]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading projects...</p>
				</div>
			</div>
		);
	}

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant={"inset"} />
			<SidebarInset>
				<AppNavbar section={"Projects"} />
				<div className="p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">Projects</h1>
						{organization && (
							<p className="text-muted-foreground">
								Managing projects for {organization.name}
							</p>
						)}
					</div>

					{/* Your project content will go here */}
					<div className="grid gap-4">
						<div className="border rounded-lg p-6">
							<h3 className="text-lg font-medium mb-2">No projects yet</h3>
							<p className="text-muted-foreground mb-4">
								Get started by creating your first project.
							</p>
							<button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
								Create Project
							</button>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default Project;
