import React, { useEffect, useRef, useState } from "react";
import {
	MemberResponse,
	ProjectResponse,
	TaskResponse,
} from "@src/lib/response-types";
import { Button } from "@src/components/ui/button";
import {
	AlertTriangle,
	ArrowUpDown,
	CheckCircle,
	ChevronDown,
	Filter,
	Milestone,
	MoreHorizontal,
	Plus,
	Search,
	SignalHigh,
	SignalLow,
	SignalMedium,
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
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@src/components/ui/checkbox";
import { format, parseISO } from "date-fns";
import { isBlank } from "@src/lib/utils";
import { useFetch } from "@src/app/hooks/useFetch";
import { Spinner } from "@src/components/ui/spinner";
import { useApiClient } from "@src/app/hooks/useApiClient";
import { TaskRequest } from "@src/lib/request-types";
import { TaskCategory, TaskPriority } from "@src/lib/enumeration";

type ProjectListViewProps = {
	project: ProjectResponse;
};

/*
pinned: boolean;
	title: string;
	
	assigneeId: string;
	assignee: MemberResponse;


	createdAt: string;
	lastModifiedAt: string;
	completedAt: string;
	dueDate: string;
	startDate: string;

	status: TaskStatus;
	priority: TaskPriority;
	category: TaskCategory;	
*/

const tableColumns: ColumnDef<TaskResponse>[] = [
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
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label={`Select task ${row.getValue("title")}`}
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "title",
		header: "Title",
	},
	{
		accessorKey: "priority",
		header: "Priority",
		cell: ({ row }) => {
			const priority = row.getValue<TaskPriority>("priority");
			if (!isBlank(priority)) return "";
			if (priority === TaskPriority.HIGH) return <SignalHigh />;
			else if (priority === TaskPriority.LOW) return <SignalLow />;
			else if (priority === TaskPriority.MEDIUM) return <SignalMedium />;
			else if (priority === TaskPriority.CRITICAL) return <AlertTriangle />;
			else return <MoreHorizontal />;
		},
	},
	{
		accessorKey: "assignee",
		header: "Assignee",
		cell: ({ row }) => {
			const assignee = row.getValue<MemberResponse>("assignee");
			const assigneeId = row.getValue<string>("assigneeId");

			if (!assignee && !assigneeId) return "-";
			try {
				if (assignee?.firstName) return assignee.firstName + assignee.lastName;
			} catch {
				return "-";
			}
		},
	},
	{
		accessorKey: "startDate",
		header: "Start Date",
		cell: ({ row }) => {
			const dateValue = row.getValue("startDate");
			if (!dateValue || typeof dateValue !== "string") return "-";
			try {
				const parsedDate = parseISO(dateValue);
				return format(parsedDate, "MMM d, yyyy");
			} catch {
				return "-";
			}
		},
	},
	{
		accessorKey: "dueDate",
		header: "Due Date",
		cell: ({ row }) => {
			const dateValue = row.getValue("dueDate");
			if (!dateValue || typeof dateValue !== "string") return "-";
			try {
				const parsedDate = parseISO(dateValue);
				return format(parsedDate, "MMM d, yyyy");
			} catch {
				return "-";
			}
		},
	},
];

const ProjectListView = ({ project }: ProjectListViewProps) => {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [taskList, setTaskList] = useState<TaskResponse[]>([]);
	const { apiClient } = useApiClient();
	const { data, isLoading, error } = useFetch<TaskResponse[]>({
		queryKey: [""],
		url: `/project/${project.publicId}/tasks`,
	});

	useEffect(() => {
		if (isSearchOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isSearchOpen]);

	useEffect(() => {
		if (data) {
			console.log("Tasks data: ", data);
			setTaskList(data);
		}
	}, [data]);

	const handleSearchClick = () => {
		setIsSearchOpen(true);
	};

	const handleBlur = () => {
		setIsSearchOpen(false);
	};

	const createNewTask = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const response = await apiClient.post<TaskResponse, TaskRequest>(
			`/task/createNew`,
			{
				title: "",
				projectId: "",
				assigneeId: "",
				organizationId: "",
				startDate: "",
				dueDate: "",
				priority: TaskPriority.LOW,
				category: TaskCategory.BUG,
			}
		);
		console.log(response);
	};

	return (
		<div className="w-full h-fit">
			<div className="w-full h-12 p-2 flex items-center justify-between">
				<div className="h-8 max-w-40 flex items-center justify-center gap-0 border rounded-md">
					<Button
						variant="outline"
						onClick={createNewTask}
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
			<div className="bg-teal-300 w-full h-fit p-2 flex flex-col items-center justify-center gap-4">
				<Collapsible className="bg-green-300 w-full h-fit">
					<CollapsibleTrigger>
						<Label className="text-xl text-pretty font-medium">To do</Label>
					</CollapsibleTrigger>
					<CollapsibleContent className="">
						{isLoading ? (
							<div className="loader w-full h-full">
								<Spinner variant="bars" className="" />
							</div>
						) : error ? (
							<div>{error.message}</div>
						) : taskList.length === 0 ? (
							<div className="">No tasks found</div>
						) : (
							<DataTable columns={tableColumns} data={taskList} />
						)}
					</CollapsibleContent>
				</Collapsible>
				<Collapsible className="bg-blue-300 w-full h-fit">
					<CollapsibleTrigger>
						<Label className="text-xl text-pretty font-medium">
							In Progress
						</Label>
					</CollapsibleTrigger>
					<CollapsibleContent className="">
						{isLoading ? (
							<div className="loader w-full h-full">
								<Spinner variant="bars" className="" />
							</div>
						) : error ? (
							<div>{error.message}</div>
						) : taskList.length === 0 ? (
							<div className="">No tasks found</div>
						) : (
							<DataTable columns={tableColumns} data={taskList} />
						)}
					</CollapsibleContent>
				</Collapsible>
				<Collapsible className="bg-red-300 w-full h-fit">
					<CollapsibleTrigger>
						<Label className="text-xl text-pretty font-medium">Completed</Label>
					</CollapsibleTrigger>
					<CollapsibleContent className="">
						{isLoading ? (
							<div className="loader w-full h-full">
								<Spinner variant="bars" className="" />
							</div>
						) : error ? (
							<div>{error.message}</div>
						) : taskList.length === 0 ? (
							<div className="">No tasks found</div>
						) : (
							<DataTable columns={tableColumns} data={taskList} />
						)}
					</CollapsibleContent>
				</Collapsible>
				<Collapsible className="bg-yellow-300 w-full h-fit">
					<CollapsibleTrigger>
						<Label className="text-xl text-pretty font-medium">Archived</Label>
					</CollapsibleTrigger>
					<CollapsibleContent className="">
						{isLoading ? (
							<div className="loader w-full h-full">
								<Spinner variant="bars" className="" />
							</div>
						) : error ? (
							<div>{error.message}</div>
						) : taskList.length === 0 ? (
							<div className="">No tasks found</div>
						) : (
							<DataTable columns={tableColumns} data={taskList} />
						)}
					</CollapsibleContent>
				</Collapsible>
			</div>
			<p>{project.name}</p>
			<p>{project.description}</p>
		</div>
	);
};

export default ProjectListView;
