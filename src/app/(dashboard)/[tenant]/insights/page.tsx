"use client";

import React from "react";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import { AppNavbar } from "../components/navbar/app-navbar";
import { useOrganization } from "@src/components/tenant-provider";

const Insights = () => {
	const {
		organization,
		isLoading,
		error,
		organizationName,
		hasOrganization,
		refreshOrganization,
	} = useOrganization();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading insights...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-lg font-semibold text-destructive mb-2">
						Failed to load organization
					</h2>
					<p className="text-muted-foreground mb-4">{error}</p>
					<button
						onClick={refreshOrganization}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	if (!hasOrganization) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-lg font-semibold mb-2">Organization not found</h2>
					<p className="text-muted-foreground">
						The requested organization could not be found.
					</p>
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
			<AppSidebar props={{ variant: "inset" }} organization={organization!} />
			<SidebarInset>
				<AppNavbar section={"Insights"} />
				<div className="p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">Insights</h1>
						<p className="text-muted-foreground">
							Analytics and insights for {organizationName}
						</p>
					</div>

					{/* Your insights content will go here */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div className="border rounded-lg p-6">
							<h3 className="text-lg font-medium mb-2">Project Progress</h3>
							<p className="text-muted-foreground mb-4">
								Track your project completion rates
							</p>
							<div className="text-2xl font-bold">0%</div>
						</div>

						<div className="border rounded-lg p-6">
							<h3 className="text-lg font-medium mb-2">Active Tasks</h3>
							<p className="text-muted-foreground mb-4">
								Currently in progress
							</p>
							<div className="text-2xl font-bold">0</div>
						</div>

						<div className="border rounded-lg p-6">
							<h3 className="text-lg font-medium mb-2">Team Members</h3>
							<p className="text-muted-foreground mb-4">Active team members</p>
							<div className="text-2xl font-bold">1</div>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default Insights;
