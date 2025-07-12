import {
	Check,
	Loader,
	Clock,
	Activity,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { Button } from "@src/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@src/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import React from "react";
import { Kbd } from "@src/components/ui/kbd";

type StatusSelectorProps = {
	selected: "backlog" | "in_progress" | "completed" | "cancelled";
	onChange: (value: string) => void;
};

const statusOptions = [
	{
		id: "backlog",
		name: "Backlog",
		icon: Loader,
		value: 1,
		description: "Task is waiting to be worked on",
	},
	{
		id: "planned",
		name: "Planned",
		icon: Clock,
		value: 2,
		description: "Task is planned but not started",
	},
	{
		id: "in_progress",
		name: "In Progress",
		icon: Activity,
		value: 3,
		description: "Task is actively being worked on",
	},
	{
		id: "completed",
		name: "Completed",
		icon: CheckCircle,
		value: 4,
		description: "Task is finished",
	},
	{
		id: "canceled",
		name: "Canceled",
		icon: XCircle,
		value: 5,
		description: "Task has been canceled",
	},
];

const StatusSelector = ({ selected, onChange }: StatusSelectorProps) => {
	const selectedStatus =
		statusOptions.find((status) => status.id === selected) || statusOptions[0];

	return (
		<div>
			<Popover>
				<PopoverTrigger>
					<Button variant="outline" size="sm" className="gap-2">
						<selectedStatus.icon className="w-4 h-4 text-muted-foreground" />
						<span>{selectedStatus.name}</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					sideOffset={8}
					className="w-72 rounded-md border bg-popover text-popover-foreground shadow-md p-0"
				>
					<Command>
						<div className="h-10 flex items-baseline justify-between px-2">
							<CommandInput className="h-10" placeholder="Change status..." />
							<span className="h-full text-xs text-muted-foreground flex items-center gap-1">
								<Kbd className="border-border">P</Kbd>
								<span>then</span>
								<Kbd className="border-border">S</Kbd>
							</span>
						</div>
						<CommandSeparator />
						<CommandList>
							<CommandEmpty>No Status</CommandEmpty>
							{statusOptions.map((option, key) => (
								<CommandItem
									className="cursor-pointer"
									key={key}
									value={option.id}
									onClick={() => onChange(option.id)}
								>
									<span className="flex items-center gap-2">
										<span className="text-lg">
											<option.icon />
										</span>
										<span>{option.name}</span>
									</span>
									<div className="flex items-center gap-2">
										{selectedStatus.id === option.id && <Check size={16} />}
									</div>
									<CommandShortcut>{option.value}</CommandShortcut>
								</CommandItem>
							))}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default StatusSelector;
