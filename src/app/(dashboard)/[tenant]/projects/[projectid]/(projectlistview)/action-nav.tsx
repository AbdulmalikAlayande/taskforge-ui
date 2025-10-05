"use client";

import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@src/components/ui/popover";
import { Input } from "@src/components/ui/input";
import { Kbd } from "@src/components/ui/kbd";
import {
	ChevronDown,
	CheckCircle,
	Milestone,
	Tag,
	Filter,
	ArrowUpDown,
	Search,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@src/components/ui/button";
import { ProjectResponse } from "@src/lib/response-types";
import CreateTaskDialog from "./create-task-dialog";

type ActionNavProps = {
	project: ProjectResponse;
	createNewTask?: (event: React.FormEvent<HTMLFormElement>) => void;
};

const ActionNav = ({ project }: ActionNavProps) => {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isSearchOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isSearchOpen]);

	const handleSearchClick = () => {
		setIsSearchOpen(true);
	};

	const handleBlur = () => {
		setIsSearchOpen(false);
	};

	/*
		startDate: string;
		dueDate: string;
		priority: TaskPriority;
		status?: TaskStatus;
		category: TaskCategory;
	*/

	return (
		<div className="w-full h-14 px-6 py-3 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="h-9 flex items-center justify-center gap-0">
				<CreateTaskDialog project={project} />
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 rounded-l-none hover:bg-accent bg-transparent"
						>
							<ChevronDown className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent align="start" className="w-64 p-2">
						<div className="space-y-1">
							<button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left">
								<CheckCircle className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium flex-1">Task</span>
								<span className="flex items-center gap-1 text-xs text-muted-foreground">
									<Kbd className="px-1.5 py-0.5">Ctrl</Kbd>
									<Kbd className="px-1.5 py-0.5">T</Kbd>
								</span>
							</button>
							<button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left">
								<Milestone className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium flex-1">Milestone</span>
								<span className="flex items-center gap-1 text-xs text-muted-foreground">
									<Kbd className="px-1.5 py-0.5">M</Kbd>
									<Kbd className="px-1.5 py-0.5">S</Kbd>
								</span>
							</button>
							<button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left">
								<Tag className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium flex-1">Tag</span>
								<span className="flex items-center gap-1 text-xs text-muted-foreground">
									<Kbd className="px-1.5 py-0.5">T</Kbd>
									<Kbd className="px-1.5 py-0.5">T</Kbd>
								</span>
							</button>
						</div>
					</PopoverContent>
				</Popover>
			</div>

			<div className="h-9 flex items-center gap-2">
				<Button
					variant="ghost"
					size="sm"
					className="h-9 flex items-center gap-2 text-sm"
				>
					<Filter className="h-4 w-4" />
					<span>Filter</span>
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="h-9 flex items-center gap-2 text-sm"
				>
					<ArrowUpDown className="h-4 w-4" />
					<span>Sort</span>
				</Button>
				<div className="relative">
					{isSearchOpen ? (
						<div className="flex items-center border rounded-md px-3 h-9 gap-2 min-w-[240px] animate-in slide-in-from-right-5 duration-200">
							<Search className="h-4 w-4 text-muted-foreground" />
							<Input
								ref={inputRef}
								className="h-full border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
								placeholder="Search tasks..."
								onBlur={handleBlur}
							/>
						</div>
					) : (
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9"
							onClick={handleSearchClick}
						>
							<Search className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ActionNav;
