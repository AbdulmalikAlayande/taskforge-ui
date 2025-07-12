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
							{/* 📁 Project A Project is a high-level container for a larger body
							of work that drives toward a specific objective or outcome.
							Projects are often goal-oriented (e.g. "Launch v2.0", "Revamp
							onboarding") and consist of multiple tasks or issues that need to
							be completed. Projects are typically time-bound and may span
							across multiple teams or departments. ✅ Example: "Website
							Redesign", "Customer Feedback Integration", "Q3 Marketing
							Campaign" ✅ Task A Task is a specific, actionable unit of work
							that contributes to a larger objective (usually a project or
							goal). Tasks should have clear ownership, a due date, and a
							defined scope. Tasks can be assigned to individuals and tracked
							from creation to completion. ✅ Example: "Write landing page
							copy", "Fix login bug", "Send press release to media" 🐞 Issue An
							Issue is a type of task, often technical, that represents a bug,
							problem, or enhancement request. Issues typically follow a
							lifecycle (e.g., Backlog → In Progress → Done) and may include
							context such as logs, reproduction steps, and priority. ✅
							Example: "Image carousel not loading on mobile", "Optimize SQL
							query on dashboard" 🧩 Subtask A Subtask breaks a larger task into
							smaller, more manageable steps. Subtasks help clarify scope and
							improve clarity in execution. They are dependent on their parent
							task. ✅ Example: For the task "Design blog layout": Create
							wireframe Choose color palette Export mobile and desktop variants
							🎯 Milestone A Milestone represents a key checkpoint or
							deliverable within one or more projects. It’s often time-based and
							signals progress toward a major goal. ✅ Example: "Beta release",
							"Stakeholder review", "Phase 1 completed" 🗃️ Epic An Epic is a
							collection of related tasks or issues that span multiple sprints
							or weeks and contribute toward a larger feature or initiative.
							Often used in Agile teams. ✅ Example: "Build commenting system",
							"Implement user permissions" 📄 Document A Document is a piece of
							reference or planning material attached to a project or task. It
							may include specs, meeting notes, research, or design files. ✅
							Example: "Sprint planning notes", "Feature spec for Dark Mode" 👥
							Assignee The Assignee is the person responsible for completing a
							task or issue. Every task should ideally have one clearly defined
							assignee for accountability. 🏷️ Label / Tag Labels or Tags are
							used to categorize tasks and projects for filtering, search, and
							workflow automation. They can represent status, type, priority,
							etc. ✅ Example: "Bug", "High Priority", "Frontend", "Marketing"
							🧭 Suggested Core Hierarchy (for your app) */}
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default Tasks;
