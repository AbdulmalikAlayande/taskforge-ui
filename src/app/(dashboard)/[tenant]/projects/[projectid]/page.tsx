"use client";

import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { AppSidebar } from "../../components/sidebar/app-sidebar";
import { useOrganization } from "@src/components/tenant-provider";
import { AppNavbar } from "../../components/navbar/app-navbar";
import { ProjectResponse } from "@src/lib/response-types";
import { useApiClient } from "@src/app/hooks/useApiClient";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@src/components/ui/tabs";
import ProjectBoardView from "./project-board-view";
import ProjectDashboard from "./project-dashboard";
import ProjectListView from "./project-list-view";
import ProjectOverview from "./project-overview";
import ProjectTimelineView from "./project-timeline-view";
import ProjectCalendar from "./project-calendar";
import { Spinner } from "@src/components/ui/spinner";

const ProjectPage = () => {
	const params = useParams<{ tenant: string; projectid: string }>();
	const { organization, isLoading, error, hasOrganization } = useOrganization();
	const [project, setProject] = React.useState<ProjectResponse>();
	const [navbarPathProps, setNavbarPathProps] =
		React.useState<{ pathname: string; pathurl: string }[]>();
	const { apiClient } = useApiClient();

	useEffect(() => {
		const navbarPaths = sessionStorage.getItem("navbarPathProps");
		if (navbarPaths) {
			setNavbarPathProps(JSON.parse(navbarPaths));
		}
	}, []);

	useEffect(() => {
		if (hasOrganization && params.projectid) {
			const foundProject = organization?.projects.find(
				(project) => project.publicId === params.projectid
			);

			console.log(foundProject);

			if (foundProject?.publicId) {
				setProject(foundProject);
			} else {
				apiClient
					.get<ProjectResponse>(`/project/${params.projectid}`)
					.then((response) => {
						if (response.publicId) setProject(response);
					})
					.catch((error) => {
						console.error("Failed to fetch project:", error);
					});
			}
		}
		console.log(project);
	}, [hasOrganization, organization, params.projectid, apiClient]);

	if (isLoading || project === undefined || project === null) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Spinner variant="pinwheel" className="text-primary" size={65} />
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
			<AppSidebar
				props={{ variant: "inset" }}
				organization={organization!}
				navbarPathProps={navbarPathProps}
			/>
			<SidebarInset>
				<AppNavbar section={"Projects"} pathProps={navbarPathProps} />
				<div className="w-full">
					<Tabs className="" defaultValue="overview">
						<TabsList className="w-full rounded-none border-b">
							<TabsTrigger value={"overview"}>Overview</TabsTrigger>
							<TabsTrigger value={"list"}>List</TabsTrigger>
							<TabsTrigger value={"board"}>Board</TabsTrigger>
							<TabsTrigger value={"timeline"}>Timeline</TabsTrigger>
							<TabsTrigger value={"dashboard"}>Dashboard</TabsTrigger>
							<TabsTrigger value={"calendar"}>Calendar</TabsTrigger>
						</TabsList>
						<TabsContent value={"overview"}>
							Overview
							<ProjectOverview project={project!} />
						</TabsContent>
						<TabsContent value={"list"}>
							List
							<ProjectListView project={project!} />
						</TabsContent>
						<TabsContent value={"board"}>
							Board
							<ProjectBoardView project={project!} />
						</TabsContent>
						<TabsContent value={"timeline"}>
							Timeline
							<ProjectTimelineView project={project!} />
						</TabsContent>
						<TabsContent value={"dashboard"}>
							Dashboard
							<ProjectDashboard project={project!} />
						</TabsContent>
						<TabsContent value={"calendar"}>
							Calendar
							<ProjectCalendar project={project!} />
						</TabsContent>
					</Tabs>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default ProjectPage;
