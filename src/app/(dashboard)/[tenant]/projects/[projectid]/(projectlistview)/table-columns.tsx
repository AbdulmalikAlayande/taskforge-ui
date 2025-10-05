import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@src/components/ui/checkbox";
import { Badge } from "@src/components/ui/badge";
import { Avatar, AvatarFallback } from "@src/components/ui/avatar";
import {
	AlertTriangle,
	MoreHorizontal,
	SignalHigh,
	SignalLow,
	SignalMedium,
	Circle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { isBlank } from "@src/lib/utils";
import type { TaskResponse, MemberResponse } from "@src/lib/response-types";
import { TaskPriority } from "@src/lib/enumeration";
import { Button } from "@src/components/ui/button";

export const tableColumns: ColumnDef<TaskResponse>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label={`Select task ${row.getValue("title")}`}
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
		size: 40,
	},
	{
		accessorKey: "title",
		header: "Task name",
		cell: ({ row }) => {
			const title = row.getValue<string>("title");
			return (
				<div className="flex items-center gap-2">
					<Circle className="h-4 w-4 text-muted-foreground" />
					<span className="font-medium text-sm">
						{title || "Untitled task"}
					</span>
				</div>
			);
		},
		size: 300,
	},
	{
		accessorKey: "assignee",
		header: "Assignee",
		cell: ({ row }) => {
			const assignee = row.getValue<MemberResponse>("assignee");
			const assigneeId = row.getValue<string>("assigneeId");

			if (!assignee && !assigneeId) {
				return (
					<Button
						variant="ghost"
						size="sm"
						className="h-8 text-muted-foreground hover:text-foreground"
					>
						<Circle className="h-5 w-5" />
					</Button>
				);
			}

			try {
				if (assignee?.firstName) {
					const initials =
						`${assignee.firstName[0]}${assignee.lastName?.[0] || ""}`.toUpperCase();
					const fullName =
						`${assignee.firstName} ${assignee.lastName || ""}`.trim();

					return (
						<div className="flex items-center gap-2">
							<Avatar className="h-6 w-6">
								<AvatarFallback className="text-xs bg-primary/10 text-primary">
									{initials}
								</AvatarFallback>
							</Avatar>
							<span className="text-sm">{fullName}</span>
						</div>
					);
				}
			} catch {
				return <span className="text-sm text-muted-foreground">-</span>;
			}
		},
		size: 200,
	},
	{
		accessorKey: "startDate",
		header: "Start Date",
		cell: ({ row }) => {
			const dateValue = row.getValue("startDate");
			if (!dateValue || typeof dateValue !== "string") {
				return <span className="text-sm text-muted-foreground">-</span>;
			}
			try {
				const parsedDate = parseISO(dateValue);
				return (
					<span className="text-sm">{format(parsedDate, "MMM d, yyyy")}</span>
				);
			} catch {
				return <span className="text-sm text-muted-foreground">-</span>;
			}
		},
		size: 120,
	},
	{
		accessorKey: "dueDate",
		header: "Due Date",
		cell: ({ row }) => {
			const dateValue = row.getValue("dueDate");
			if (!dateValue || typeof dateValue !== "string") {
				return <span className="text-sm text-muted-foreground">-</span>;
			}
			try {
				const parsedDate = parseISO(dateValue);
				const isOverdue = parsedDate < new Date();
				return (
					<span
						className={`text-sm ${isOverdue ? "text-destructive font-medium" : ""}`}
					>
						{format(parsedDate, "MMM d, yyyy")}
					</span>
				);
			} catch {
				return <span className="text-sm text-muted-foreground">-</span>;
			}
		},
		size: 120,
	},
	{
		accessorKey: "priority",
		header: "Priority",
		cell: ({ row }) => {
			const priority = row.getValue<TaskPriority>("priority");
			if (isBlank(priority)) {
				return (
					<Badge variant="outline" className="gap-1.5">
						<MoreHorizontal className="h-3 w-3" />
						<span>None</span>
					</Badge>
				);
			}

			const priorityConfig = {
				[TaskPriority.CRITICAL]: {
					icon: AlertTriangle,
					label: "Critical",
					variant: "destructive" as const,
				},
				[TaskPriority.HIGH]: {
					icon: SignalHigh,
					label: "High",
					variant: "default" as const,
				},
				[TaskPriority.MEDIUM]: {
					icon: SignalMedium,
					label: "Medium",
					variant: "secondary" as const,
				},
				[TaskPriority.LOW]: {
					icon: SignalLow,
					label: "Low",
					variant: "outline" as const,
				},
			};

			const config = priorityConfig[priority];
			if (!config) {
				return (
					<Badge variant="outline" className="gap-1.5">
						<MoreHorizontal className="h-3 w-3" />
						<span>None</span>
					</Badge>
				);
			}

			const Icon = config.icon;
			return (
				<Badge variant={config.variant} className="gap-1.5">
					<Icon className="h-3 w-3" />
					<span>{config.label}</span>
				</Badge>
			);
		},
		size: 120,
	},
];
