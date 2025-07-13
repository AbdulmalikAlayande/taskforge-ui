// components/ui/date-picker.tsx
"use client";

import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Calendar } from "./calendar";
import { format, addMonths, addYears } from "date-fns";
import { parseDate } from "chrono-node";
import { cn } from "@src/lib/utils";
import type { DayPickerProps, Modifiers } from "react-day-picker";

type DatePickerProps = {
	triggerIcon: React.ReactNode | React.ReactElement;
	triggerLabel?: string;
	title?: string;
};

const DatePicker = (props: DatePickerProps) => {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedRange, setSelectedRange] = useState<
		{ from: Date; to: Date } | undefined
	>(undefined);
	const [activeTab, setActiveTab] = useState<string>("day");

	const handleDateSelect = (date: Date | undefined, tab: string) => {
		setActiveTab(tab);
		if (tab === "day") {
			setSelectedDate(date);
			setSelectedRange(undefined);
		} else if (tab === "month") {
			setSelectedDate(undefined);
			setSelectedRange({
				from: date || new Date(),
				to: addMonths(date || new Date(), 1),
			});
		} else if (tab === "quarter") {
			setSelectedDate(undefined);
			setSelectedRange({
				from: date || new Date(),
				to: addMonths(date || new Date(), 3),
			});
		} else if (tab === "half-year") {
			setSelectedDate(undefined);
			setSelectedRange({
				from: date || new Date(),
				to: addMonths(date || new Date(), 6),
			});
		} else if (tab === "year") {
			setSelectedDate(undefined);
			setSelectedRange({
				from: date || new Date(),
				to: addYears(date || new Date(), 1),
			});
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;
		const parsedDate = parseDate(input);
		if (parsedDate) {
			setSelectedDate(parsedDate);
			setActiveTab("day");
			setSelectedRange(undefined);
		}
	};

	const renderTabContent = (tab: string) => {
		const today = new Date(); // Current date: July 13, 2025, 02:54 PM WAT
		const currentYear = today.getFullYear();

		switch (tab) {
			case "day":
				return (
					<Calendar
						mode="single"
						selected={selectedDate}
						onSelect={(date) => handleDateSelect(date, "day")}
						captionLayout="dropdown"
						className="rounded-md border bg-card text-card-foreground"
						disabled={{ before: new Date("2024-01-01") }}
					/>
				);
			case "month":
				return (
					<Calendar
						mode="single"
						selected={selectedDate}
						onSelect={(date) => handleDateSelect(date, "month")}
						captionLayout="dropdown"
						className="rounded-md border bg-card text-card-foreground"
						components={{
							CaptionLabel: ({ displayMonth }) => (
								<div className="flex justify-center items-center gap-2 py-2">
									<span className="text-sm font-medium">
										{format(displayMonth, "yyyy")}
									</span>
								</div>
							),
							DayButton: ({ date, displayMonth }) => (
								<button
									className={cn(
										"w-10 h-10 rounded-md text-sm font-medium text-center hover:bg-accent hover:text-accent-foreground",
										date.getMonth() === displayMonth.getMonth() &&
											"bg-primary text-primary-foreground"
									)}
									onClick={() => handleDateSelect(date, "month")}
								>
									{format(date, "MMM")}
								</button>
							),
						}}
						fromDate={new Date(currentYear - 1, 0, 1)}
						toDate={new Date(currentYear + 1, 11, 31)}
					/>
				);
			case "quarter":
				return (
					<div className="grid grid-cols-2 gap-2 p-2 bg-card text-card-foreground rounded-md">
						{["Q1", "Q2", "Q3", "Q4"].map((q, i) => {
							const startDate = new Date(today.getFullYear(), i * 3, 1);
							return (
								<button
									key={q}
									className={cn(
										"w-full h-10 rounded-md text-sm font-medium text-center hover:bg-accent hover:text-accent-foreground",
										selectedRange?.from?.getMonth() === i * 3 &&
											"bg-primary text-primary-foreground"
									)}
									onClick={() => handleDateSelect(startDate, "quarter")}
								>
									{q}
								</button>
							);
						})}
					</div>
				);
			case "half-year":
				return (
					<div className="grid grid-cols-2 gap-2 p-2 bg-card text-card-foreground rounded-md">
						{["H1", "H2"].map((h, i) => {
							const startDate = new Date(today.getFullYear(), i * 6, 1);
							return (
								<button
									key={h}
									className={cn(
										"w-full h-10 rounded-md text-sm font-medium text-center hover:bg-accent hover:text-accent-foreground",
										selectedRange?.from &&
											selectedRange.from.getMonth() >= i * 6 &&
											selectedRange.from.getMonth() < (i + 1) * 6 &&
											"bg-primary text-primary-foreground"
									)}
									onClick={() => handleDateSelect(startDate, "half-year")}
								>
									{h}
								</button>
							);
						})}
					</div>
				);
			case "year":
				return (
					<div className="grid grid-cols-2 gap-2 p-2 bg-card text-card-foreground rounded-md">
						{Array.from({ length: 5 }, (_, i) => currentYear + i - 2).map(
							(year) => (
								<button
									key={year}
									className={cn(
										"w-full h-10 rounded-md text-sm font-medium text-center hover:bg-accent hover:text-accent-foreground",
										selectedRange?.from?.getFullYear() === year &&
											"bg-primary text-primary-foreground"
									)}
									onClick={() => handleDateSelect(new Date(year, 0, 1), "year")}
								>
									{year}
								</button>
							)
						)}
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="gap-2 bg-card text-card-foreground hover:bg-accent"
				>
					{props.triggerIcon}
					{selectedDate
						? format(selectedDate, "PPP")
						: selectedRange
							? `${format(selectedRange.from, "PPP")} - ${format(selectedRange.to, "PPP")}`
							: props.triggerLabel || "Select Date"}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={8}
				className="w-72 flex flex-col items-center justify-between gap-2 p-2 rounded-md border bg-popover text-popover-foreground shadow-md"
			>
				<div className="flex items-center justify-start w-full">
					<Label className="text-sm font-medium">
						{props.title || "Start date"}
					</Label>
				</div>
				<div className="w-full">
					<Input
						type="text"
						className="w-full text-sm bg-card text-card-foreground border-none focus:ring-0"
						placeholder="Try: 'May 2026, Q4, 05/20/2026'"
						onChange={handleInputChange}
						value={
							selectedDate
								? format(selectedDate, "PPP")
								: selectedRange
									? `${format(selectedRange.from, "PPP")} - ${format(selectedRange.to, "PPP")}`
									: ""
						}
					/>
				</div>
				<Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="w-full px-2 overflow-x-auto whitespace-nowrap scrollbar-hidden flex gap-2 justify-start bg-card text-card-foreground rounded-md">
						{["day", "month", "quarter", "half-year", "year"].map((tab) => (
							<TabsTrigger
								key={tab}
								className="snap-start text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded px-2 py-1"
								value={tab}
							>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</TabsTrigger>
						))}
						<div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-popover to-transparent pointer-events-none" />
					</TabsList>
					<TabsContent value={activeTab} className="mt-2">
						{renderTabContent(activeTab)}
					</TabsContent>
				</Tabs>
			</PopoverContent>
		</Popover>
	);
};

export default DatePicker;
