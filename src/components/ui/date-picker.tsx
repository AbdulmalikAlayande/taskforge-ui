import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Calendar } from "./calendar";

type DatePickerProps = {
	triggerIcon: React.ReactNode | React.ReactElement; // | React.ElementType;
	triggerLabel?: string;
	title?: string;
};

const DatePicker = (props: DatePickerProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					{props.triggerIcon}
					{props.triggerLabel || "Select Date"}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={8}
				className="w-72 flex flex-col items-center justify-between gap-4 px-2 rounded-md border bg-popover text-popover-foreground shadow-md"
			>
				<div className="flex items-center justify-start w-full">
					<Label className="h-full w-full">
						{props.title || "Select Date"}
					</Label>
				</div>
				<div className="w-full flex items-center justify-between">
					<Input
						variant={"normal"}
						type="px-0 py-0 text"
						placeholder="Try: 'May 2026, Q4', '05/23/2025'"
					/>
				</div>
				<Tabs className="w-full">
					<TabsList className="w-full px-2 overflow-x-auto whitespace-nowrap scrollbar-hidden flex gap-2 justify-start">
						<TabsTrigger className="snap-start" value="day">
							Day
						</TabsTrigger>
						<TabsTrigger className="snap-start" value="month">
							Month
						</TabsTrigger>
						<TabsTrigger className="snap-start" value="quarter">
							Quarter
						</TabsTrigger>
						<TabsTrigger className="snap-start" value="half-year">
							Half-Year
						</TabsTrigger>
						<TabsTrigger className="snap-start" value="year">
							Year
						</TabsTrigger>
						<div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-popover to-transparent pointer-events-none" />
					</TabsList>
					<TabsContent value="day">
						<Calendar />
					</TabsContent>
					<TabsContent value="month">
						<Calendar />
					</TabsContent>
					<TabsContent value="quarter">
						<Calendar />
					</TabsContent>
					<TabsContent value="half-year">
						<Calendar />
					</TabsContent>
					<TabsContent value="year">
						<Calendar />
					</TabsContent>
				</Tabs>
			</PopoverContent>
		</Popover>
	);
};

export default DatePicker;
