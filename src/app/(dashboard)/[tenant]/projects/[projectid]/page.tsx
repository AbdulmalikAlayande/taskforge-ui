"use client";

import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { useParams } from "next/navigation";
import React from "react";
import { AppSidebar } from "../../components/sidebar/app-sidebar";
import { useOrganization } from "@src/components/tenant-provider";

const ProjectPage = () => {
	const params = useParams<{ tenant: string; projectid: string }>();
	const { organization, isLoading, error, hasOrganization } = useOrganization();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div>Loading project...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div>Error loading organization: {error}</div>
			</div>
		);
	}

	if (!hasOrganization) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div>Organization not found</div>
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
			<AppSidebar props={{ variant: "inset" }} organization={organization!} />
			<SidebarInset>
				<div>Hi</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default ProjectPage;
