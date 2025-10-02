import React, { useEffect, useState } from "react";
import { ProjectResponse, UserResponse } from "@src/lib/response-types";
import { TypographyH2, TypographyP } from "@src/components/ui/typography";
import { Box, Calendar, Activity } from "lucide-react";
import { useFetch } from "@src/app/hooks/useFetch";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import { Badge } from "@src/components/ui/badge";
import { Separator } from "@src/components/ui/separator";

type ProjectOverviewProps = {
	project: ProjectResponse;
};

const ProjectOverview = ({ project }: ProjectOverviewProps) => {
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

	return (
		<div className="w-full max-w-7xl mx-auto p-6 space-y-6">
			<ProjectHeader project={project} />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<ProjectDescription description={project.description} />
					<ProjectProperties project={project} />
				</div>

				<div className="space-y-6">
					<ProjectMetadata
						project={project}
						members={projectMembers}
						isLoading={projectMemberQueryResult.isLoading}
						isError={projectMemberQueryResult.isError}
					/>
					<ProjectActivity project={project} />
				</div>
			</div>
		</div>
	);
};

const ProjectHeader = ({ project }: { project: ProjectResponse }) => {
	return (
		<div className="flex items-start gap-4">
			<div className="p-3 rounded-lg border bg-card">
				<Box className="h-6 w-6" />
			</div>
			<div className="flex-1">
				<TypographyH2 className="mb-1">{project.name}</TypographyH2>
				{project.description && (
					<TypographyP className="text-muted-foreground line-clamp-2">
						{project.description}
					</TypographyP>
				)}
			</div>
		</div>
	);
};

const ProjectDescription = ({ description }: { description?: string }) => {
	if (!description) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Description</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-sm leading-relaxed whitespace-pre-wrap">
					{description}
				</p>
			</CardContent>
		</Card>
	);
};

const ProjectProperties = ({ project }: { project: ProjectResponse }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Project Details</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<PropertyRow
					icon={<Calendar className="h-4 w-4" />}
					label="Created"
					value={new Date(project.createdAt).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				/>
				<Separator />
				<PropertyRow
					icon={<Activity className="h-4 w-4" />}
					label="Last Updated"
					value={new Date(project.lastModifiedAt).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				/>
			</CardContent>
		</Card>
	);
};

const PropertyRow = ({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) => {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				{icon}
				<span>{label}</span>
			</div>
			<span className="text-sm font-medium">{value}</span>
		</div>
	);
};

const ProjectMetadata = ({
	project,
	members,
	isLoading,
	isError,
}: {
	project: ProjectResponse;
	members: UserResponse[];
	isLoading: boolean;
	isError: boolean;
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Overview</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<MetadataItem label="Status">
					<Badge variant="secondary" className="capitalize">
						{project.status || "Active"}
					</Badge>
				</MetadataItem>

				<Separator />

				<MetadataItem label="Team Members">
					{isLoading ? (
						<div className="text-sm text-muted-foreground">Loading...</div>
					) : isError ? (
						<div className="text-sm text-destructive">
							Failed to load members
						</div>
					) : members.length > 0 ? (
						<MemberAvatars members={members} />
					) : (
						<div className="text-sm text-muted-foreground">No members yet</div>
					)}
				</MetadataItem>

				<Separator />

				<MetadataItem label="Project ID">
					<code className="text-xs font-mono bg-muted px-2 py-1 rounded">
						{project.publicId}
					</code>
				</MetadataItem>
			</CardContent>
		</Card>
	);
};

const MetadataItem = ({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) => {
	return (
		<div className="space-y-2">
			<div className="text-sm font-medium text-muted-foreground">{label}</div>
			<div>{children}</div>
		</div>
	);
};

const MemberAvatars = ({ members }: { members: UserResponse[] }) => {
	const displayMembers = members.slice(0, 5);
	const remainingCount = members.length - 5;

	return (
		<div className="flex items-center gap-2">
			<div className="flex -space-x-2">
				{displayMembers.map((member) => (
					<Avatar
						key={member.publicId}
						className="h-8 w-8 border-2 border-background"
					>
						<AvatarImage src={member.image || undefined} />
						<AvatarFallback className="text-xs">
							{member.firstName?.[0]}
							{member.lastName?.[0]}
						</AvatarFallback>
					</Avatar>
				))}
			</div>
			{remainingCount > 0 && (
				<span className="text-xs text-muted-foreground">
					+{remainingCount} more
				</span>
			)}
		</div>
	);
};

const ProjectActivity = ({ project }: { project: ProjectResponse }) => {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg">Recent Activity</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<ActivityItem
					type="created"
					message="Project created"
					timestamp={new Date(project.createdAt).toLocaleDateString()}
				/>
				{project.lastModifiedAt !== project.createdAt && (
					<ActivityItem
						type="updated"
						message="Project updated"
						timestamp={new Date(project.lastModifiedAt).toLocaleDateString()}
					/>
				)}
			</CardContent>
		</Card>
	);
};

const ActivityItem = ({
	type,
	message,
	timestamp,
}: {
	type: string;
	message: string;
	timestamp: string;
}) => {
	return (
		<div className="flex gap-3">
			<div className="p-1.5 h-fit rounded-md border bg-card">
				{type}
				<Activity className="h-3 w-3" />
			</div>
			<div className="flex-1 space-y-1">
				<p className="text-sm">{message}</p>
				<p className="text-xs text-muted-foreground">
					{new Date(timestamp).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						hour: "numeric",
						minute: "2-digit",
					})}
				</p>
			</div>
		</div>
	);
};

export default ProjectOverview;
