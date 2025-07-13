"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import { AppNavbar } from "../components/navbar/app-navbar";
import { useTenant } from "@src/components/tenant-provider";
import { useSearchParams } from "next/navigation";
import Logger from "@src/lib/logger";
import { useFetch } from "@src/app/hooks/useFetch";
import { OrganizationResponse } from "@src/lib/response-types";
import useIndexedDB from "@src/lib/useIndexedDB";
import {
	Box,
	Boxes,
	Calendar,
	ListFilter,
	SlidersHorizontal,
} from "lucide-react";
import { Button } from "@src/components/ui/button";
import { Label } from "@src/components/ui/label";
import { TypographyP } from "@src/components/ui/typography";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@src/components/ui/popover";
import {
	Dialog,
	DialogTitle,
	DialogHeader,
	DialogContent,
	DialogTrigger,
	DialogDescription,
	DialogFooter,
} from "@src/components/ui/dialog";
import { Input } from "@src/components/ui/input";
import { ScrollArea, ScrollBar } from "@src/components/ui/scroll-area";
import {
	StatusSelector,
	PrioritySelector,
	CategorySelector,
	TeamLeadSelector,
} from "./components/data-selector";
import { MemberSelector } from "./components/member-selector";
import DatePicker from "@src/components/ui/date-picker";
import { Separator } from "@src/components/ui/separator";

const defaultOrganizationData = {
	publicId: "",
	name: "string",
	email: "",
	slug: "",
	description: "",
	industry: "",
	country: "",
	phone: "",
	timeZone: "",
	websiteUrl: "",
	logoUrl: "",
};

const Project = () => {
	const { isLoading, tenantId } = useTenant();
	const searchParams = useSearchParams();
	const userId = searchParams.get("uid");
	const { getOrganization } = useIndexedDB();
	const [organization, setOrganization] = useState<OrganizationResponse>(
		defaultOrganizationData
	);

	const fetchConfig = useMemo(
		() => ({
			enabled: !!tenantId,
			url: `${process.env.NEXT_PUBLIC_API_URL!}/organization/${tenantId}`,
			queryKey: [`organization-${tenantId}`],
			retry: 3,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000,
		}),
		[tenantId]
	);

	const { data } = useFetch<OrganizationResponse>(fetchConfig);

	const loadOrganization = useCallback(async () => {
		try {
			const org = await getOrganization(tenantId);
			if (org) {
				setOrganization(org);
				return;
			}

			if (data) {
				setOrganization(data);
			}
		} catch (error) {
			Logger.error("Failed to load organization data", {
				error: String(error),
			});
		}
	}, [data, getOrganization, tenantId]);

	useEffect(() => {
		if (tenantId) {
			Logger.debug("Loading organization data for tenant:", {
				tenantId,
				userId,
			});
			loadOrganization();
		}
	}, [tenantId, userId, loadOrganization]);

	const handleOptionClick = (option: string) => {
		console.log("Selected option:", option);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading projects...</p>
				</div>
			</div>
		);
	}

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant={"inset"} />
			<SidebarInset>
				<AppNavbar section={"Projects"} />
				<div className="w-full border-b flex justify-between items-center p-2">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant={"ghost"}>
								<ListFilter />
								<Label>Filter</Label>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80 h-screen p-4"></PopoverContent>
					</Popover>
					<Popover>
						<PopoverTrigger asChild>
							<Button className="border-2" size={"sm"} variant={"secondary"}>
								<SlidersHorizontal />
								<Label>Display</Label>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80 h-80 p-4"></PopoverContent>
					</Popover>
				</div>
				<div className="h-full w-full flex flex-col items-center px-6 py-2">
					<div className="h-full w-full md:w-2/3 lg:1/2 flex flex-col justify-center text-muted-foreground text-sm">
						<Boxes size={32} color="currentColor" />
						<TypographyP>
							A Project is a high-level container for a larger body of work that
							drives toward a specific objective or outcome, such as a new
							feature you want to ship.
						</TypographyP>
						<TypographyP className="hidden md:block">
							They are often goal-oriented (e.g. <b>Launch v2.0</b>,
							<b>Revamp onboarding</b>) and consist of multiple tasks or issues
							that need to be completed.
						</TypographyP>
						<TypographyP className="hidden lg:block">
							They can be shared across multiple teams and are comprised of
							issues and optional documents. Projects are typically time-bound
							and may span across multiple teams or departments.
						</TypographyP>

						<div className="mt-4 w-full flex justify-start h-[80px]">
							<Dialog>
								<DialogTrigger>
									<Button variant={"default"} size={"sm"}>
										Create new project
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-120 md:max-w-170 lg:max-w-220 sm:max-h-150 w-400 h-140 scrollbar-hidden overflow-y-scroll">
									<ScrollArea className="h-full w-full">
										<DialogHeader className="flex flex-col gap-4 mb-4">
											<DialogTitle className="text-lg">New project</DialogTitle>
											<DialogDescription className="w-full">
												<TypographyP className="flex items-center gap-2 text-sm font-medium break-words whitespace-normal w-full">
													Provide a name, summary, and details for your new
													project. Projects help you organize tasks, milestones,
													and team members around a specific goal or initiative.
												</TypographyP>
											</DialogDescription>
										</DialogHeader>
										<div className="w-full flex flex-col gap-4">
											<span className="bg-accent flex items-center justify-center rounded-sm w-8 h-8 text-muted-foreground">
												<Box size={20} className="text-muted-foreground" />
											</span>
											<div className="w-full flex flex-col gap-2">
												<Input
													variant={"minimal"}
													placeholder="Project name: 'Launch v2.0', 'Revamp onboarding'"
													name="project_name"
													className="h-8 text-lg md:text-xl font-semibold p-2 border-none shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
												/>
												<Input
													variant={"minimal"}
													placeholder="Add a short summary..."
													name="summary"
													className="text-sm font-semibold p-2 border-none shadow-none bg-transparent text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
												/>
											</div>

											{/* Project metadata options */}
											<div className="flex flex-wrap gap-2 text-sm">
												<StatusSelector onChange={handleOptionClick} />
												<PrioritySelector onChange={handleOptionClick} />
												<CategorySelector onChange={handleOptionClick} />
												<TeamLeadSelector onChange={handleOptionClick} />
												<MemberSelector onChange={handleOptionClick} />
												<DatePicker
													triggerLabel="Start"
													triggerIcon={<Calendar />}
												/>
												<Popover>
													<PopoverTrigger>
														<Button
															variant="outline"
															size="sm"
															className="gap-2"
														>
															<Label className="cursor-pointer">Target</Label>
														</Button>
													</PopoverTrigger>
													<PopoverContent></PopoverContent>
												</Popover>
												<Popover>
													<PopoverTrigger>
														<Button
															variant="outline"
															size="sm"
															className="gap-2"
														>
															<Label className="cursor-pointer">Labels</Label>
														</Button>
													</PopoverTrigger>
													<PopoverContent></PopoverContent>
												</Popover>
												<Separator className="mt-2" />
											</div>

											{/* Description area */}
											<div className="">
												<textarea
													placeholder="Write a description, a project brief, or collect ideas..."
													className="w-full min-h-[120px] bg-transparent border-none focus:outline-none resize-none text-sm text-muted-foreground"
												/>
											</div>

											{/* Milestones section
											<div className="flex justify-between items-center mt-6 py-2 border-t">
												<h3 className="text-sm font-medium">Milestones</h3>
												<Button variant="ghost" size="sm">
													<span className="text-xl">+</span>
												</Button>
											</div> */}
										</div>
										<ScrollBar orientation={"vertical"} />
									</ScrollArea>

									{/* Dialog footer */}
									<DialogFooter>
										<div className="flex justify-end gap-2 mt-6">
											<Button variant="outline" type="button">
												Cancel
											</Button>
											<Button type="submit">Create project</Button>
										</div>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</div>
					{/* Your project content will go here */}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default Project;
