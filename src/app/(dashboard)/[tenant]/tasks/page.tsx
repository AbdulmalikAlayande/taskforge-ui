"use client";

import React from "react";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import { AppNavbar } from "../components/navbar/app-navbar";
import { useTenant } from "@src/components/tenant-provider";

const Tasks = () => {
	const { tenantData, isLoading } = useTenant();

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
						{tenantData && (
							<p className="text-muted-foreground">
								Managing tasks for {tenantData.name}
							</p>
						)}
					</div>

					{/* Your task content will go here */}
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
