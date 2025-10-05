import ProjectDataSelector from "./project-data-selector";
import React, { useEffect, useState } from "react";
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
import { MemberResponse } from "@src/lib/response-types";
import { Spinner } from "@src/components/ui/spinner";
import { useApiClient } from "@src/app/hooks/useApiClient";

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
	// Memoize the handler to prevent unnecessary re-renders
	const handleChange = React.useCallback(
		(id: string) => {
			onChange(id);
		},
		[onChange]
	);

	return (
		<ProjectDataSelector
			selectedId={statusOptions[0].id}
			options={statusOptions}
			onChange={handleChange}
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
	// Memoize the handler to prevent unnecessary re-renders
	const handleChange = React.useCallback(
		(id: string) => {
			onChange(id);
		},
		[onChange]
	);

	return (
		<ProjectDataSelector
			selectedId={priorityOptions[2].id}
			options={priorityOptions}
			onChange={handleChange}
			placeholder={"Change priority..."}
			keybinding={["P", "P"]}
			emptyText="No priority"
			label="Priority"
			labelIcon={<AlertTriangle size={16} />}
		/>
	);
}

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
	const handleChange = React.useCallback(
		(id: string) => {
			onChange(id);
		},
		[onChange]
	);

	return (
		<ProjectDataSelector
			selectedId={categoryOptions[0].id}
			options={categoryOptions}
			onChange={handleChange}
			placeholder={""}
			keybinding={["P", "C"]}
			emptyText="No category"
			label="Category"
			labelIcon={<Tag size={16} />}
		/>
	);
}

type TeamLeadSelectorProps = SelectorProps & {
	tenantId: string;
	members: UserResponse[];
};

export function TeamLeadSelector({
	onChange,
	tenantId,
	members,
}: TeamLeadSelectorProps) {
	const [teamMembers, setTeamMembers] = useState<UserResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const { apiClient } = useApiClient();

	const fetchMembers = React.useCallback(async () => {
		setLoading(true);
		try {
			const response = await apiClient.get<UserResponse[]>(
				`/organization/${tenantId}/members`
			);
			if (response && response.length > 0) setTeamMembers(response);
		} finally {
			setLoading(false);
		}
	}, [apiClient, tenantId]);

	useEffect(() => {
		if (members && members.length > 0) {
			setTeamMembers(members);
		} else {
			fetchMembers();
		}
	}, [members, fetchMembers]);

	const teamLeadSelectorOptions = React.useMemo(
		() =>
			teamMembers.map((member, index) => ({
				id: member.publicId,
				name: `${member.firstName} ${member.lastName}`,
				icon: <User />,
				value: index + 1,
			})),
		[teamMembers]
	);

	const handleChange = React.useCallback(
		(id: string) => {
			onChange(id);
		},
		[onChange]
	);

	if (loading || teamLeadSelectorOptions.length === 0) {
		return (
			<div className="w-full h-full flex flex-coljustify-center items-center gap-2">
				<Spinner variant="bars" className="text-accent-foreground" size={25} />
				<span className="text-sm">Loading Team Members</span>
			</div>
		);
	}

	return (
		<ProjectDataSelector
			selectedId={teamLeadSelectorOptions[0].id}
			options={teamLeadSelectorOptions}
			onChange={handleChange}
			placeholder={"Change team lead"}
			keybinding={["P", "L"]}
			emptyText="No user available"
			label="Team Lead"
			labelIcon={<BadgeCheck size={16} />}
		/>
	);
}
