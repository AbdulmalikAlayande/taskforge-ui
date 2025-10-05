"use client";
import { ProjectHeader } from "./project-header";
import { ProjectProperties } from "./project-properties";
import { KeyResources } from "./key-resources";
import { Milestones } from "./milestones";
import { ActivityFeed } from "./activity-feed";
import { Separator } from "@src/components/ui/separator";
import { useFetch } from "@src/app/hooks/useFetch";
import { ProjectResponse, UserResponse } from "@src/lib/response-types";
import { useEffect, useState } from "react";

type ProjectOverviewProps = {
	project: ProjectResponse;
};

export function ProjectOverview({ project }: ProjectOverviewProps) {
	const [projectMembers, setProjectMembers] = useState<UserResponse[]>([]);

	const projectMemberQueryResult = useFetch<UserResponse[]>({
		url: `/project/${project.publicId}/members`,
		queryKey: ["projectMembers", project.publicId],
	});

	useEffect(() => {
		if (projectMemberQueryResult.data) {
			setProjectMembers(projectMemberQueryResult.data);
		}
	}, [projectMemberQueryResult.data]);

	const mockMilestones = [
		{
			id: "1",
			title: "Project kickoff",
			dueDate: "Jan 15",
			status: "completed" as const,
		},
		{
			id: "2",
			title: "Design phase completion",
			dueDate: "Feb 1",
			status: "in-progress" as const,
		},
	];

	const mockActivities = [
		{
			id: "1",
			type: "member-joined" as const,
			message: "My workspace team joined",
			timestamp: new Date(Date.now() - 86400000), // 1 day ago
		},
		{
			id: "2",
			type: "created" as const,
			user: {
				name: "Project Owner",
				image: "/placeholder-user.jpg",
			},
			message: "Project created",
			timestamp: new Date(Date.now() - 172800000), // 2 days ago
		},
	];

	return (
		<div className="container mx-auto max-w-7xl space-y-8 p-6">
			{/* Header Section */}
			<ProjectHeader project={project} />

			<Separator />
			{/* Main Content Grid */}
			<div className="grid gap-8 lg:grid-cols-3">
				{/* Left Column - Main Content */}
				<div className="space-y-6 lg:col-span-2">
					<ProjectProperties
						members={projectMembers}
						isLoadingMembers={projectMemberQueryResult.isLoading}
						hasErrorMembers={projectMemberQueryResult.isError}
						startDate={project.startDate}
						endDate={project.endDate}
						tags={["Design", "UI/UX"]}
						team={`${project.name} Team`}
					/>

					<KeyResources
						onCreateBrief={() => console.log("Create brief")}
						onAddLinks={() => console.log("Add links")}
					/>

					<Milestones
						milestones={mockMilestones}
						onAddMilestone={() => console.log("Add milestone")}
					/>
				</div>

				{/* Right Column - Activity Feed */}
				<div className="lg:col-span-1">
					<ActivityFeed activities={mockActivities} />
				</div>
			</div>
		</div>
	);
}
