import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";
// import { Label } from "./label";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { parseDate } from "chrono-node";
import { CalendarIcon } from "lucide-react";
import Logger from "@src/lib/logger";
import { toast } from "sonner";

type DatePickerProps = {
	selectedDate: Date;
	setSelectedDate: (date: Date) => void;
	triggerIcon: React.ReactNode | React.ReactElement; // | React.ElementType;
	triggerLabel?: string;
	title?: string;
};

function formatDate(date: Date | undefined) {
	if (!date) {
		return "";
	}

	return date.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

const DatePicker = (props: DatePickerProps) => {
	const [naturalLanguage, setNaturalLanguage] = useState("");
	const [date, setDate] = useState(parseDate(naturalLanguage));
	const [month, setMonth] = useState(date);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const parseNaturalLanguage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNaturalLanguage(event.target.value);
		const date = parseDate(event.target.value);
		setDate(date);
		setMonth(date);
		props.setSelectedDate(date || new Date());
	};
	function openPopover(event: React.KeyboardEvent<HTMLInputElement>): void {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setPopoverOpen(true);
		}
	}

	function handleDateSelection(
		props: DatePickerProps,
		setNaturalLanguage: React.Dispatch<React.SetStateAction<string>>,
		setPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>
	) {
		return (date: Date | undefined) => {
			props.setSelectedDate(date ?? new Date());
			setNaturalLanguage(formatDate(date));
			setPopoverOpen(false);
			Logger.debug(`Selected date:>${date}`);
			toast.success(`Selected date: ${date}`);
		};
	}

	return (
		<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
			<PopoverTrigger asChild>
				<Button
					id="date-picker"
					variant={"outline"}
					size={"sm"}
					className="h-6 p-0 m-0"
				>
					<span className="w-full h-full flex items-center justify-between rounded-md gap-2">
						{props.title}
					</span>
					<CalendarIcon size={20} />{" "}
					<span className="sr-only">Select date</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-72 rounded-md border bg-popover text-popover-foreground shadow-md overflow-hidden p-0"
				align="start"
			>
				<div className="w-full relative flex items-center justify-center gap-2 bg-primary">
					<Input
						id="date"
						variant={"normal"}
						value={naturalLanguage}
						placeholder="Tomorrow or next week"
						onChange={parseNaturalLanguage}
						onKeyDown={openPopover}
						className="h-8 w-full"
					/>
				</div>
				<Calendar
					mode="single"
					className="w-full bg-amber-700 px-0"
					selected={props.selectedDate}
					captionLayout="dropdown"
					month={month ? month : undefined}
					onMonthChange={setMonth}
					onSelect={handleDateSelection(
						props,
						setNaturalLanguage,
						setPopoverOpen
					)}
				/>
			</PopoverContent>
		</Popover>
	);
};

export default DatePicker;
