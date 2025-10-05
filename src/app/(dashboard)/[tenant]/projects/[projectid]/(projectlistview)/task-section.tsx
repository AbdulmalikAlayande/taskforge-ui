"use client";

import React from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@src/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Spinner } from "@src/components/ui/spinner";
import DataTable from "@src/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { TaskResponse } from "@src/lib/response-types";
import { cn } from "@src/lib/utils";

type TaskSectionProps = {
	title: string;
	taskCount: number;
	isLoading: boolean;
	error: Error | null;
	tasks: TaskResponse[];
	columns: ColumnDef<TaskResponse>[];
	defaultOpen?: boolean;
};

const TaskSection = ({
	title,
	taskCount,
	isLoading,
	error,
	tasks,
	columns,
	defaultOpen = true,
}: TaskSectionProps) => {
	const [isOpen, setIsOpen] = React.useState(defaultOpen);

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="w-full border-b border-border last:border-b-0"
		>
			<CollapsibleTrigger className="w-full group">
				<div className="flex items-center gap-2 px-4 py-3 hover:bg-accent/50 transition-colors">
					<ChevronRight
						className={cn(
							"h-4 w-4 text-muted-foreground transition-transform duration-200",
							isOpen && "rotate-90"
						)}
					/>
					<span className="text-sm font-semibold text-foreground">{title}</span>
					<span className="text-xs text-muted-foreground ml-1">
						{taskCount}
					</span>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="px-4 pb-4">
				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<Spinner variant="bars" />
					</div>
				) : error ? (
					<div className="flex items-center justify-center py-12">
						<p className="text-sm text-destructive">{error.message}</p>
					</div>
				) : tasks.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<p className="text-sm text-muted-foreground">No tasks yet</p>
						<p className="text-xs text-muted-foreground mt-1">
							Tasks you add will appear here
						</p>
					</div>
				) : (
					<DataTable columns={columns} data={tasks} />
				)}
			</CollapsibleContent>
		</Collapsible>
	);
};

export default TaskSection;
