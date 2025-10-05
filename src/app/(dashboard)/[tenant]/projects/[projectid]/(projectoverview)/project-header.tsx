import { Box } from "lucide-react";
import { Badge } from "@src/components/ui/badge";
import { ProjectResponse } from "@src/lib/response-types";

type ProjectHeaderProps = {
	project: ProjectResponse;
};

const statusConfig = {
	ACTIVE: { label: "Active", variant: "default" as const },
	PAUSED: { label: "Paused", variant: "secondary" as const },
	COMPLETED: { label: "Completed", variant: "default" as const },
	ABANDONED: { label: "Abandoned", variant: "destructive" as const },
	ARCHIVED: { label: "Archived", variant: "destructive" as const },
	BACKLOG: { label: "Backlog", variant: "secondary" as const },
	IN_PROGRESS: { label: "In Progress", variant: "default" as const },
	CANCELLED: { label: "Cancelled", variant: "destructive" as const },
	//
	ON_TRACK: { label: "On track", variant: "default" as const },
	AT_RISK: { label: "At risk", variant: "secondary" as const },
	OFF_TRACK: { label: "Off track", variant: "destructive" as const },
};

const priorityConfig = {
	LOW: { label: "Low", variant: "secondary" as const },
	MEDIUM: { label: "Medium", variant: "default" as const },
	HIGH: { label: "High", variant: "default" as const },
	NO_PRIORITY: { label: "No Priority", variant: "secondary" as const },
	URGENT: { label: "Urgent", variant: "destructive" as const },
};

export function ProjectHeader({ project }: ProjectHeaderProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-start gap-4">
				<div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted">
					<Box className="h-6 w-6 text-muted-foreground" />
				</div>
				<div className="flex-1 space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight">
						{project.name}
					</h1>
					{project.description && (
						<p className="text-sm text-muted-foreground">
							{project.description}
						</p>
					)}
				</div>
			</div>

			{(project.status || project.priority) && (
				<div className="flex items-center gap-2">
					{project.status && (
						<Badge variant={statusConfig[project.status].variant}>
							{statusConfig[project.status].label}
						</Badge>
					)}
					{project.priority && (
						<Badge variant={priorityConfig[project.priority].variant}>
							{priorityConfig[project.priority].label}
						</Badge>
					)}
				</div>
			)}
		</div>
	);
}
