"use client";

import React from "react";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import { AppNavbar } from "../components/navbar/app-navbar";
import { useTenant } from "@src/components/tenant-provider";

const Inbox = () => {
	const { tenantData, isLoading } = useTenant();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading inbox...</p>
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
				<AppNavbar section={"Inbox"} />
				<div className="p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">Inbox</h1>
						{tenantData && (
							<p className="text-muted-foreground">
								Notifications and messages for {tenantData.name}
							</p>
						)}
					</div>

					{/* Your inbox content will go here */}
					<div className="grid gap-4">
						<div className="border rounded-lg p-6">
							<h3 className="text-lg font-medium mb-2">No messages</h3>
							<p className="text-muted-foreground">
								You&apos;re all caught up! No new messages or notifications.
							</p>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default Inbox;
