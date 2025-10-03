import React, { useEffect, useRef, useState } from "react";
import { ProjectResponse } from "@src/lib/response-types";
import { Button } from "@src/components/ui/button";
import {
	ArrowUpDown,
	CheckCircle,
	ChevronDown,
	Filter,
	Milestone,
	Plus,
	Search,
	Tag,
} from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import { Input } from "@src/components/ui/input";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@src/components/ui/collapsible";
import { Label } from "@src/components/ui/label";
import DataTable from "@src/components/ui/data-table";

type ProjectListViewProps = {
	project: ProjectResponse;
};

const ProjectListView = ({ project }: ProjectListViewProps) => {
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

	return (
		<div className="w-full h-fit">
			<div className="w-full h-12 p-2 flex items-center justify-between">
				<div className="h-8 max-w-40 flex items-center justify-center gap-0 border rounded-md">
					<Button
						variant="outline"
						className="h-full flex items-center justify-evenly px-0 py-2 m-0 border-none border-r rounded-none rounded-l-md"
					>
						<Plus />
						<span>Add Task</span>
					</Button>
					<Popover>
						<PopoverTrigger
							className="h-full border-l rounded-r-md bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer"
							asChild
						>
							<ChevronDown className="h-full" />
						</PopoverTrigger>
						<PopoverContent align="start" className="w-40">
							<div className="">
								<div className="flex justify-start items-center">
									<CheckCircle className="size-6 mr-2" />
									<span>Task</span>
								</div>
								<div className="flex justify-start items-center">
									<Milestone className="size-6 mr-2" />
									<span>Mile Stone</span>
								</div>
								<div className="flex justify-start items-center">
									<Tag className="size-6 mr-2" />
									<span>Tag</span>
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>
				<div className="h-8 flex items-center justify-between gap-2">
					<Button variant="ghost" className="h-full flex items-center">
						<Filter className="h-full" />
						<span>Filter</span>
					</Button>
					<Button variant="ghost" className="h-full flex items-center">
						<ArrowUpDown className="h-full" />
						<span>Sort</span>
					</Button>
					<div className="relative h-8 flex items-center">
						{isSearchOpen ? (
							<div
								className="flex items-center border rounded-md px-2 py-1 gap-2 h-8 animate-in slide-in-from-right duration-500"
								style={{
									minWidth: "200px",
									animation: "slideInFromRight 0.3s ease-out",
								}}
							>
								<Search className="h-4 w-4 text-muted-foreground" />
								<Input
									ref={inputRef}
									className="h-6 border-0 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 hover:ring-0 hover:border-0 hover:border-none focus:border-0 focus:border-none p-0 m-0"
									placeholder="Search task names"
									onBlur={handleBlur}
									style={{
										boxShadow: "none",
										border: "none",
										outline: "none",
									}}
								/>
							</div>
						) : (
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={handleSearchClick}
							>
								<Search className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
			</div>
			{/* List View */}
			<div className="">
				<Collapsible>
					<CollapsibleTrigger>
						<Label>To do</Label>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<DataTable columns={[]} data={[]} />
					</CollapsibleContent>
				</Collapsible>
				<Collapsible>
					<CollapsibleTrigger>
						<Label>In Progress</Label>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<DataTable columns={[]} data={[]} />
					</CollapsibleContent>
				</Collapsible>
				<Collapsible>
					<CollapsibleTrigger>
						<Label>Done</Label>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<DataTable columns={[]} data={[]} />
					</CollapsibleContent>
				</Collapsible>
				<Collapsible>
					<CollapsibleTrigger>
						<Label>Archived</Label>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<DataTable columns={[]} data={[]} />
					</CollapsibleContent>
				</Collapsible>
			</div>
			<p>{project.name}</p>
			<p>{project.description}</p>
		</div>
	);
};

export default ProjectListView;
