"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Badge } from "@src/components/ui/badge";
import { Plus, Diamond } from "lucide-react";

type Milestone = {
	id: string;
	title: string;
	dueDate?: string;
	status?: "pending" | "in-progress" | "completed";
};

type MilestonesProps = {
	milestones?: Milestone[];
	onAddMilestone?: () => void;
};

const statusConfig = {
	pending: { label: "Pending", variant: "secondary" as const },
	"in-progress": { label: "In Progress", variant: "default" as const },
	completed: { label: "Completed", variant: "default" as const },
};

export function Milestones({
	milestones = [],
	onAddMilestone,
}: MilestonesProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
				<CardTitle className="text-base">Milestones</CardTitle>
				<Button
					variant="ghost"
					size="sm"
					onClick={onAddMilestone}
					className="h-8 gap-1"
				>
					<Plus className="h-4 w-4" />
					Add
				</Button>
			</CardHeader>
			<CardContent>
				{milestones.length > 0 ? (
					<div className="space-y-3">
						{milestones.map((milestone) => (
							<div
								key={milestone.id}
								className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
							>
								<Diamond className="mt-0.5 h-4 w-4 text-muted-foreground" />
								<div className="flex-1 space-y-1">
									<p className="text-sm font-medium">{milestone.title}</p>
									<div className="flex items-center gap-2">
										{milestone.status && (
											<Badge
												variant={statusConfig[milestone.status].variant}
												className="h-5 text-xs"
											>
												{statusConfig[milestone.status].label}
											</Badge>
										)}
										{milestone.dueDate && (
											<span className="text-xs text-muted-foreground">
												Due {milestone.dueDate}
											</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<button
						onClick={onAddMilestone}
						className="flex w-full items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted/50"
					>
						<Diamond className="h-4 w-4" />
						Add milestone...
					</button>
				)}
			</CardContent>
		</Card>
	);
}
