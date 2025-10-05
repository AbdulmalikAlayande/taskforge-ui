import React, { useEffect, useState } from "react";
import { ProjectResponse, TaskResponse } from "@src/lib/response-types";
import { useFetch } from "@src/app/hooks/useFetch";
import ActionNav from "./action-nav";
import TaskSection from "./task-section";
import { tableColumns } from "./table-columns";
import { TaskStatus } from "@src/lib/enumeration";

type ProjectListViewProps = {
	project: ProjectResponse;
};

const ProjectListView = ({ project }: ProjectListViewProps) => {
	const [taskList, setTaskList] = useState<TaskResponse[]>([]);
	const { data, isLoading, error } = useFetch<TaskResponse[]>({
		queryKey: [project.publicId, "Tasks"],
		url: `/project/${project.publicId}/tasks`,
	});

	useEffect(() => {
		if (data) {
			setTaskList(data);
		}
	}, [data]);

	const todoTasks = taskList.filter((task) => task.status === TaskStatus.TODO);
	const inProgressTasks = taskList.filter(
		(task) => task.status === TaskStatus.IN_PROGRESS
	);
	const completedTasks = taskList.filter(
		(task) => task.status === TaskStatus.DONE
	);
	const archivedTasks = taskList.filter(
		(task) => task.status === TaskStatus.ARCHIVED
	);

	return (
		<div className="w-full h-fit">
			<ActionNav project={project} />
			{/* List View */}
			<div className="flex-1 overflow-auto">
				<div className="w-full border-t border-border">
					<TaskSection
						title="To do"
						taskCount={todoTasks.length}
						isLoading={isLoading}
						error={error}
						tasks={todoTasks}
						columns={tableColumns}
						defaultOpen={true}
					/>
					<TaskSection
						title="In Progress"
						taskCount={inProgressTasks.length}
						isLoading={isLoading}
						error={error}
						tasks={inProgressTasks}
						columns={tableColumns}
						defaultOpen={true}
					/>
					<TaskSection
						title="Completed"
						taskCount={completedTasks.length}
						isLoading={isLoading}
						error={error}
						tasks={completedTasks}
						columns={tableColumns}
						defaultOpen={false}
					/>
					<TaskSection
						title="Archived"
						taskCount={archivedTasks.length}
						isLoading={isLoading}
						error={error}
						tasks={archivedTasks}
						columns={tableColumns}
						defaultOpen={false}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProjectListView;
