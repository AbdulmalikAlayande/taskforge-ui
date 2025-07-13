import ProjectDataSelector from "./project-data-selector";
import {
	Loader,
	Clock,
	Activity,
	CheckCircle,
	XCircle,
	Tag,
	Code2,
	Blocks,
	PenTool,
	Megaphone,
	ShoppingCart,
	Users,
	PiggyBank,
	Settings,
	Scale,
	Joystick,
	Headset,
	CircleDashed,
	BadgeCheck,
	User,
} from "lucide-react";
import {
	AlertTriangle,
	SignalHigh,
	SignalMedium,
	SignalLow,
	MoreHorizontal,
} from "lucide-react";

type SelectorProps = {
	onChange: (id: string) => void;
};

const statusOptions = [
	{
		id: "backlog",
		name: "Backlog",
		icon: <Loader />,
		value: 1,
		description: "Task is waiting to be worked on",
	},
	{
		id: "planned",
		name: "Planned",
		icon: <Clock />,
		value: 2,
		description: "Task is planned but not started",
	},
	{
		id: "in_progress",
		name: "In Progress",
		icon: <Activity />,
		value: 3,
		description: "Task is actively being worked on",
	},
	{
		id: "completed",
		name: "Completed",
		icon: <CheckCircle />,
		value: 4,
		description: "Task is finished",
	},
	{
		id: "canceled",
		name: "Canceled",
		icon: <XCircle />,
		value: 5,
		description: "Task has been canceled",
	},
];

export function StatusSelector({ onChange }: SelectorProps) {
	return (
		<ProjectDataSelector
			selectedId={statusOptions[0].id}
			options={statusOptions}
			onChange={onChange}
			placeholder={"Change status..."}
			keybinding={["P", "S"]}
			emptyText="No status"
			label="Status"
			labelIcon={<Activity size={16} />}
		/>
	);
}

const priorityOptions = [
	{
		id: "no_priority",
		name: "No priority",
		icon: <MoreHorizontal />,
		value: 0,
	},
	{
		id: "urgent",
		name: "Urgent",
		icon: <AlertTriangle />,
		value: 1,
	},
	{
		id: "high",
		name: "High",
		icon: <SignalHigh />,
		value: 2,
	},
	{
		id: "medium",
		name: "Medium",
		icon: <SignalMedium />,
		value: 3,
	},
	{
		id: "low",
		name: "Low",
		icon: <SignalLow />,
		value: 4,
	},
];

export function PrioritySelector({ onChange }: SelectorProps) {
	return (
		<ProjectDataSelector
			selectedId={priorityOptions[2].id}
			options={priorityOptions}
			onChange={onChange}
			placeholder={"Change priority..."}
			keybinding={["P", "P"]}
			emptyText="No priority"
			label="Priority"
			labelIcon={<AlertTriangle size={16} />}
		/>
	);
}

/**
 * 	BUILDING = "BUILDING",
	SOFTWARE = "SOFTWARE",
	DESIGN = "DESIGN",
	MARKETING = "MARKETING",
	SALES = "SALES",
	HUMAN_RESOURCES = "HUMAN_RESOURCES",
	FINANCE = "FINANCE",
	OPERATIONS = "OPERATIONS",
	LEGAL = "LEGAL",
	IT_SUPPORT = "IT_SUPPORT",
	ENTERTAINMENT = "ENTERTAINMENT",
	OTHER = "OTHER",
 */

const categoryOptions = [
	{
		id: "building",
		name: "Building",
		icon: <Blocks />,
		value: 1,
	},
	{
		id: "software",
		name: "Software",
		icon: <Code2 />,
		value: 2,
	},
	{
		id: "design",
		name: "Design",
		icon: <PenTool />,
		value: 3,
	},
	{
		id: "marketing",
		name: "Marketing",
		icon: <Megaphone />,
		value: 4,
	},
	{
		id: "sales",
		name: "Sales",
		icon: <ShoppingCart />,
		value: 5,
	},
	{
		id: "finance",
		name: "Finance",
		icon: <PiggyBank />,
		value: 6,
	},
	{
		id: "operations",
		name: "Operations",
		icon: <Settings />,
		value: 6,
	},
	{
		id: "legal",
		name: "Legal",
		icon: <Scale />,
		value: 7,
	},
	{
		id: "it_support",
		name: "IT Support",
		icon: <Headset />,
		value: 8,
	},
	{
		id: "entertainment",
		name: "Entertainment",
		icon: <Joystick />,
		value: 9,
	},
	{
		id: "human_resources",
		name: "Human Resources",
		icon: <Users />,
		value: 10,
	},
	{
		id: "other",
		name: "Other",
		icon: <CircleDashed />,
		value: 4,
	},
];

export function CategorySelector({ onChange }: SelectorProps) {
	return (
		<ProjectDataSelector
			selectedId={categoryOptions[0].id}
			options={categoryOptions}
			onChange={onChange}
			placeholder={""}
			keybinding={["P", "C"]}
			emptyText="No category"
			label="Category"
			labelIcon={<Tag size={16} />}
		/>
	);
}

export function TeamLeadSelector({ onChange }: SelectorProps) {
	const teamLeadSelectorOptions = [
		{
			id: "",
			name: "",
			icon: <User />,
			value: 1,
		},
	];
	return (
		<ProjectDataSelector
			selectedId={teamLeadSelectorOptions[0].name}
			options={[]}
			onChange={onChange}
			placeholder={"Change team lead"}
			keybinding={["P", "L"]}
			emptyText="No user available"
			label="Team Lead"
			labelIcon={<BadgeCheck size={16} />}
		/>
	);
}
