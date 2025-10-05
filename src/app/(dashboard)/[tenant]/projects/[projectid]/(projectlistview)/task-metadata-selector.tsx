import React from "react";
import ProjectDataSelector from "../../components/project-data-selector";
import {
	AlertTriangle,
	Archive,
	Bug,
	Lightbulb,
	Notebook,
	NotebookPen,
	PenTool,
	SignalHigh,
	SignalLow,
	SignalMedium,
	Sparkle,
	Tag,
} from "lucide-react";
import { FaMagnifyingGlass } from "react-icons/fa6";

type SelectorProps = {
	onChange: (id: string) => void;
};

const taskCategoryOptions = [
	{ id: "bug", name: "Bug", icon: <Bug />, value: 1 },
	{ id: "feature", name: "Feature", icon: <Lightbulb />, value: 2 },
	{ id: "improvement", name: "Bug", icon: <Sparkle />, value: 3 },
	{ id: "research", name: "Research", icon: <FaMagnifyingGlass />, value: 4 },
];
const TaskCategorySelector = ({ onChange }: SelectorProps) => {
	const handleChange = React.useCallback(
		(id: string) => {
			onChange(id);
		},
		[onChange]
	);

	return (
		<ProjectDataSelector
			selectedId={taskCategoryOptions[0].id}
			options={taskCategoryOptions}
			onChange={handleChange}
			placeholder={""}
			keybinding={["T", "C"]}
			emptyText="No category"
			label="Category"
			labelIcon={<Tag size={16} />}
		/>
	);
};

const taskPriorityOptions = [
	{ id: "low", name: "LOW", icon: <SignalLow />, value: "1" },
	{ id: "medium", name: "Medium", icon: <SignalMedium />, value: "2" },
	{ id: "high", name: "High", icon: <SignalHigh />, value: "3" },
	{ id: "critical", name: "Critical", icon: <AlertTriangle />, value: "4" },
];
const TaskPrioritySelector = ({ onChange }: SelectorProps) => {
	const handleChange = React.useCallback(
		(id: string) => {
			onChange(id);
		},
		[onChange]
	);
	return (
		<ProjectDataSelector
			selectedId={taskPriorityOptions[0].id}
			options={taskPriorityOptions}
			onChange={handleChange}
			placeholder={""}
			keybinding={["T", "P"]}
			emptyText="No priority"
			label="Priority"
			labelIcon={<Tag size={16} />}
		/>
	);
};

const taskStatusOptions = [
	{ id: "todo", name: "To-do", icon: <PenTool />, value: "1" },
	{ id: "in progress", name: "In Progress", icon: <Notebook />, value: "1" },
	{ id: "done", name: "Done", icon: <NotebookPen />, value: "1" },
	{ id: "archived", name: "Archived", icon: <Archive />, value: "1" },
];
const TaskStatusSelector = ({ onChange }: SelectorProps) => {
	const handleChange = React.useCallback(
		(id: string) => {
			onChange(id);
		},
		[onChange]
	);
	return (
		<ProjectDataSelector
			selectedId={taskStatusOptions[0].id}
			options={taskStatusOptions}
			onChange={handleChange}
			placeholder={""}
			keybinding={["T", "S"]}
			emptyText="No status"
			label="Status"
			labelIcon={<Tag size={16} />}
		/>
	);
};

export { TaskCategorySelector, TaskPrioritySelector, TaskStatusSelector };
