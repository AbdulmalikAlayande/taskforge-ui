"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { FileText, LinkIcon } from "lucide-react";

type KeyResourcesProps = {
	onCreateBrief?: () => void;
	onAddLinks?: () => void;
};

export function KeyResources({ onCreateBrief, onAddLinks }: KeyResourcesProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Key resources</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-muted-foreground">
					Align your team around a shared vision with a project brief and
					supporting resources.
				</p>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={onCreateBrief}
						className="gap-2 bg-transparent"
					>
						<FileText className="h-4 w-4" />
						Create project brief
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={onAddLinks}
						className="gap-2 bg-transparent"
					>
						<LinkIcon className="h-4 w-4" />
						Add links & files
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
