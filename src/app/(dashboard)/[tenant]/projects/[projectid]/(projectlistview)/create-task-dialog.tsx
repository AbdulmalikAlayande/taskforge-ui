import React, { useEffect, useState } from "react";
import { Plus, Calendar, User2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@src/components/ui/dialog";
import DatePicker from "@src/components/ui/date-picker";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import {
	ProjectResponse,
	MemberResponse,
	TaskResponse,
} from "@src/lib/response-types";
import { TaskPriority, TaskStatus, TaskCategory } from "@src/lib/enumeration";
import { TaskRequest } from "@src/lib/request-types";
import { useApiClient } from "@src/app/hooks/useApiClient";
import { FaTasks } from "react-icons/fa";
import { MemberSelector } from "../../components/member-selector";
import {
	TaskCategorySelector,
	TaskPrioritySelector,
	TaskStatusSelector,
} from "./task-metadata-selector";
import { useSession } from "next-auth/react";
import { useUserStorage } from "@src/app/hooks/useUserStorage";
import { toast } from "sonner";

type CreateTaskDialogProps = {
	project: ProjectResponse;
};

const defaultTaskData = {
	title: "",
	description: "",
	projectId: "",
	assigneeId: "",
	organizationId: "",
	startDate: "",
	dueDate: "",
	priority: TaskPriority.HIGH,
	status: TaskStatus.TODO,
	category: TaskCategory.FEATURE,
};

const CreateTaskDialog = ({ project }: CreateTaskDialogProps) => {
	const { apiClient } = useApiClient();
	const { getCurrentTenantId } = useUserStorage();
	const { data: session } = useSession();
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [teamMembers, setTeamMembers] = useState<MemberResponse[]>([]);
	const [loadingTeamMembers, setLoadingTeammembers] = useState<boolean>(false);
	const [taskStartDate, setTaskStartDate] = useState<Date>();
	const [taskDueDate, setTaskDueDate] = useState<Date>();
	const [taskRequest, setTaskRequest] = useState<TaskRequest>(defaultTaskData);

	const fetchMembers = React.useCallback(async () => {
		setLoadingTeammembers(true);
		try {
			const response = await apiClient.get<MemberResponse[]>(
				`/project/${project.publicId}/members`
			);
			if (response && response.length > 0) setTeamMembers(response);
		} finally {
			setLoadingTeammembers(false);
		}
	}, [apiClient, project.publicId]);

	useEffect(() => {
		if (project.members && project.members.length > 0) {
			setTeamMembers(project.members);
		} else {
			fetchMembers();
		}
	}, [project.members, fetchMembers]);

	const createNewTask = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("Creating new task");
		const response = await apiClient.post<TaskResponse, TaskRequest>(
			`/tasks/create-new`,
			{
				...taskRequest,
				projectId: project.publicId,
				organizationId: session?.tenantId || getCurrentTenantId() || "",
				startDate: taskStartDate ? taskStartDate.toISOString() : "",
				dueDate: taskDueDate ? taskDueDate.toISOString() : "",
			}
		);
		if (response) {
			toast.success("Project created successfully!", {
				duration: 3000,
				position: "top-right",
				description: `Project "${response.title}" has been created.`,
				style: {
					backgroundColor: "#f0fff4",
					color: "#16a34a",
				},
			});
			setTaskRequest(defaultTaskData);
			setTaskStartDate(undefined);
			setTaskDueDate(undefined);
			setDialogOpen(false);
		}
		console.log(response);
	};

	const handleOptionClick = (id: string, selectorType?: string) => {
		setTaskRequest((prev) => {
			switch (selectorType) {
				case "status":
					return { ...prev, status: id.toUpperCase() as TaskStatus };
				case "priority":
					return { ...prev, priority: id.toUpperCase() as TaskPriority };
				case "category":
					return { ...prev, category: id.toUpperCase() as TaskCategory };
				case "member":
					return { ...prev, assigneeId: id };
				default:
					return prev;
			}
		});
	};

	return (
		<Dialog
			open={dialogOpen}
			onOpenChange={() => {
				setDialogOpen(!dialogOpen);
			}}
		>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="h-9 flex items-center gap-2 px-3 rounded-r-none border-r-0 hover:bg-accent bg-transparent"
				>
					<Plus className="h-4 w-4" />
					<span className="text-sm font-medium">Add Task</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="p-4 overflow-auto rounded-xl min-w-[90vw] max-w-[95vw] lg:min-w-[60vw] lg:max-w-[70vw] ">
				<form onSubmit={createNewTask} action="">
					<DialogHeader className="flex flex-col gap-4">
						<DialogTitle className="w-full text-lg text-left">
							Create New Task
						</DialogTitle>
						<DialogDescription className="w-full flex items-center gap-2 text-sm sm:text-xs font-medium break-words text-left whitespace-normal">
							Add a new task to your project
						</DialogDescription>
					</DialogHeader>
					<div className="w-full flex flex-col gap-4 py-4">
						<span className="bg-accent flex items-center justify-center rounded-sm w-8 h-8 text-muted-foreground">
							<FaTasks size={20} className="text-muted-foreground" />
						</span>
						<div className="w-full flex flex-col gap-2">
							<Input
								id="task-title"
								variant={"minimal"}
								value={taskRequest.title}
								placeholder="Enter task title..."
								onChange={(e) =>
									setTaskRequest((prev) => ({
										...prev,
										title: e.target.value,
									}))
								}
								className="h-8 text-lg md:text-xl font-semibold p-2 border-none shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
							/>
							<Input
								id="task-description"
								variant={"minimal"}
								value={taskRequest.description}
								placeholder="Enter task description..."
								onChange={(e) =>
									setTaskRequest((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								className="text-sm font-semibold p-2 border-none shadow-none bg-transparent text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
							/>
						</div>
						<div className="flex gap-2 text-sm">
							<TaskCategorySelector
								onChange={(id) => handleOptionClick(id, "category")}
							/>
							<TaskPrioritySelector
								onChange={(id) => handleOptionClick(id, "priority")}
							/>
							<TaskStatusSelector
								onChange={(id) => handleOptionClick(id, "status")}
							/>
							<MemberSelector
								userIcon={<User2 />}
								label={"Assignee"}
								members={teamMembers}
								onChange={(id) => handleOptionClick(id, "member")}
								isLoading={loadingTeamMembers}
							/>
							<DatePicker
								title="Task start date"
								triggerLabel="Start"
								triggerIcon={<Calendar size={14} />}
								selectedDate={taskStartDate}
								setSelectedDate={(date: Date) => {
									setTaskStartDate(date);
									setTaskRequest((prev) => ({
										...prev,
										startDate: date.toISOString(),
									}));
								}}
							/>
							<DatePicker
								title="Task due date"
								triggerLabel="Due"
								triggerIcon={<Calendar size={14} />}
								selectedDate={taskDueDate}
								setSelectedDate={(date: Date) => {
									setTaskDueDate(date);
									setTaskRequest((prev) => ({
										...prev,
										dueDate: date.toISOString(),
									}));
								}}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Create Task</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateTaskDialog;
