import React from "react";
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
	AlertTriangle,
	SignalHigh,
	SignalMedium,
	SignalLow,
	MoreHorizontal,
	Check,
} from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import { Button } from "@src/components/ui/button";
import { Kbd } from "@src/components/ui/kbd";

type PrioritySelectorProps = {
	selected: "no_priority" | "urgent" | "high" | "medium" | "low";
	onChange: (value: string) => void;
};

const priorityOptions = [
	{
		id: "no_priority",
		name: "No priority",
		icon: MoreHorizontal,
		value: 0,
	},
	{
		id: "urgent",
		name: "Urgent",
		icon: AlertTriangle,
		value: 1,
	},
	{
		id: "high",
		name: "High",
		icon: SignalHigh,
		value: 2,
	},
	{
		id: "medium",
		name: "Medium",
		icon: SignalMedium,
		value: 3,
	},
	{
		id: "low",
		name: "Low",
		icon: SignalLow,
		value: 4,
	},
];

export function PrioritySelector({
	selected,
	onChange,
}: PrioritySelectorProps) {
	const selectedOption =
		priorityOptions.find((priority) => priority.id === selected) ||
		priorityOptions[0];

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<selectedOption.icon /> {selectedOption.name}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={8}
				className="w-72 rounded-md border bg-popover text-popover-foreground shadow-md p-0"
			>
				<Command>
					<div className="h-10 flex items-baseline justify-between px-2">
						<CommandInput className="h-10" placeholder="Change Priority..." />
						<span className="h-full text-xs text-muted-foreground flex items-center gap-1">
							<Kbd className="border-border">P</Kbd>
							<span>then</span>
							<Kbd className="border-border">P</Kbd>
						</span>
					</div>
					<CommandSeparator />
					<CommandList>
						<CommandEmpty>No Priority</CommandEmpty>
						{priorityOptions.map((option, key) => (
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
									{selectedOption.id === option.id && <Check size={16} />}
								</div>
								<CommandShortcut>{option.value}</CommandShortcut>
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export default PrioritySelector;
