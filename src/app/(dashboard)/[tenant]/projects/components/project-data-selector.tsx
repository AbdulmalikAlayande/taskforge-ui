import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@src/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@src/components/ui/command";
import { Kbd } from "@src/components/ui/kbd";

type ProjectDataSelectorOption = {
	id: string;
	name: string;
	icon: React.ReactNode;
	value: number | string;
	description?: string;
};

type ProjectDataSelectorProps = {
	selectedId: string;
	options: ProjectDataSelectorOption[];
	onChange: (id: string) => void;
	placeholder: string;
	keybinding?: [string, string];
	emptyText?: string;
	label?: string;
	labelIcon?: React.ReactNode | React.ReactElement;
};

const ProjectDataSelector = (props: ProjectDataSelectorProps) => {
	const [selectedOption, setSelectedOption] =
		useState<ProjectDataSelectorOption>();

	const handleOptionClick = (option: ProjectDataSelectorOption) => {
		setSelectedOption(option);
		props.onChange(option.id);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="text-sm gap-2 p-0">
					{selectedOption ? (
						<span className="w-full h-full flex items-center justify-between gap-2 px-2 border-primary text-primary">
							<span>{selectedOption.icon}</span>
							<span>{selectedOption.name}</span>
						</span>
					) : (
						<span className="w-full h-full flex items-center justify-between rounded-md px-2 gap-2">
							{props.labelIcon} {props.label}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={8}
				className="w-72 rounded-md border bg-popover text-popover-foreground shadow-md p-0"
			>
				<Command>
					<div className="h-10 flex items-baseline justify-between px-2">
						<CommandInput className="h-10" placeholder={props.placeholder} />
						<span className="h-full text-xs text-muted-foreground flex items-center gap-1">
							<Kbd className="border-border">{props.keybinding?.[0]}</Kbd>
							<span>then</span>
							<Kbd className="border-border">{props.keybinding?.[1]}</Kbd>
						</span>
					</div>
					<CommandSeparator />
					<CommandList>
						<CommandEmpty>{props.emptyText}</CommandEmpty>
						{props.options.map((option, key) => (
							<CommandItem
								className="cursor-pointer"
								key={key}
								value={option.id}
							>
								<Button
									variant={"ghost"}
									className="w-full h-full p-0"
									onClick={() => handleOptionClick(option)}
								>
									<span className="flex items-center gap-2">
										<span className="text-sm">{option.icon}</span>
										<span>{option.name}</span>
									</span>
									<div className="flex items-center gap-2 text-sm">
										{selectedOption?.id === option.id && <Check size={16} />}
									</div>
									<CommandShortcut>{option.value}</CommandShortcut>
								</Button>
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default ProjectDataSelector;
