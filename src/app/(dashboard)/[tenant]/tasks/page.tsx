"use client";

import React, { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import { AppNavbar } from "../components/navbar/app-navbar";
import { useTenant } from "@src/components/tenant-provider";
import useIndexedDB from "@src/lib/useIndexedDB";
import { OrganizationResponse } from "@src/lib/response-types";
import { useFetch } from "@src/app/hooks/useFetch";

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

const Tasks = () => {
	const { getOrganization } = useIndexedDB();
	const { isLoading, tenantId } = useTenant();
	const { data } = useFetch<OrganizationResponse>({
		url: `${process.env.NEXT_PUBLIC_API_URL!}/organization/${tenantId}`,
		queryKey: [
			`organization-${tenantId}`,
			new Date().getMilliseconds().toLocaleString(),
		],
	});

	const [organization, setOrganization] = useState<OrganizationResponse>(
		defaultOrganizationData
	);

	useEffect(() => {
		const loadOrganizations = async () => {
			const org = await getOrganization(tenantId);
			if (org) setOrganization(org);
			else {
				fetchOrgData();
			}
		};

		const fetchOrgData = async () => {
			if (data) {
				setOrganization(data);
			}
		};

		loadOrganizations();
	}, [data, getOrganization, tenantId]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading tasks...</p>
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
				<AppNavbar section={"Tasks"} />
				<div className="p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">Tasks</h1>
						{organization && (
							<p className="text-muted-foreground">
								Managing tasks for {organization.name}
							</p>
						)}
					</div>

					<div className="grid gap-4">
						<div className="border rounded-lg p-6">
							<h3 className="text-lg font-medium mb-2">No tasks yet</h3>
							<p className="text-muted-foreground mb-4">
								Create your first task to get started.
							</p>
							<button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
								Create Task
							</button>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default Tasks;
