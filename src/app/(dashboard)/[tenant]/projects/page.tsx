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
import {
	StatusSelector,
	PrioritySelector,
	CategorySelector,
	TeamLeadSelector,
} from "./components/data-selector";
import { MemberSelector } from "./components/member-selector";
import DatePicker from "@src/components/ui/date-picker";
import { Separator } from "@src/components/ui/separator";
import { useApiClient } from "@src/app/hooks/useApiClient";
import {
	ProjectCategory,
	ProjectPriority,
	ProjectRequest,
	ProjectStatus,
} from "@src/lib/request-types";
import { ProjectResponse } from "@src/lib/response-types";
import { toast } from "sonner";

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

const defaultProjectData: ProjectRequest = {
	name: "",
	description: "",
	organizationId: "",
	summary: "",
	startDate: "",
	endDate: "",
	memberIds: [],
	status: ProjectStatus.ACTIVE,
	priority: ProjectPriority.HIGH,
	category: ProjectCategory.BUILDING,
};
const Project = () => {
	const { isLoading, tenantId } = useTenant();
	const searchParams = useSearchParams();
	const userId = searchParams.get("uid");
	const { apiClient } = useApiClient();
	const { getOrganization } = useIndexedDB();
	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [organization, setOrganization] = useState<OrganizationResponse>(
		defaultOrganizationData
	);
	const [project, setProject] = useState<ProjectRequest>(defaultProjectData);

	const fetchConfig = useMemo(
		() => ({
			enabled: !!tenantId,
			url: `/organization/${tenantId}`,
			queryKey: [`organization-${tenantId}`],
			retry: 3,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000,
		}),
		[tenantId]
	);

	const { data } = useFetch<OrganizationResponse>(fetchConfig);

	const loadOrganization = useCallback(async () => {
		if (!tenantId) return;
		try {
			const org = await getOrganization(tenantId);
			if (org) {
				setOrganization(org);
				return;
			}

			if (data) {
				Logger.debug("Loading organization from API:", data);
				setOrganization(data);
			}
		} catch (error) {
			Logger.error("Failed to load organization data", {
				error: String(error),
			});
		}
	}, [data, getOrganization, tenantId]);

	useEffect(() => {
		if (!tenantId) {
			return;
		}
		// Logger.debug("Loading organization data for tenant:", {
		// 	tenantId,
		// 	userId,
		// });
		loadOrganization();
	}, [loadOrganization, tenantId, userId]);

	useEffect(() => {
		if (tenantId) {
			setProject((prev) => ({
				...prev,
				organizationId: tenantId,
			}));
		}
	}, [tenantId]);

	const handleOptionClick = (id: string, selectorType?: string) => {
		console.log("Selected option:", id, "Type:", selectorType);
		console.log("Project Before:: ", project);
		setProject((prev) => {
			switch (selectorType) {
				case "status":
					return { ...prev, status: id.toUpperCase() as ProjectStatus };
				case "priority":
					return { ...prev, priority: id.toUpperCase() as ProjectPriority };
				case "category":
					return { ...prev, category: id.toUpperCase() as ProjectCategory };
				case "lead":
					return { ...prev, leadId: id };
				case "member":
					// For members, we need to toggle the member in the array
					const memberIds = [...prev.memberIds];
					const memberIndex = memberIds.indexOf(id);

					if (memberIndex >= 0) {
						memberIds.splice(memberIndex, 1);
					} else {
						memberIds.push(id);
					}

					return { ...prev, memberIds };
				default:
					return prev;
			}
		});
		console.log("Project After:: ", project);
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

	function createProject(event: React.MouseEvent<HTMLButtonElement>): void {
		event.preventDefault();

		if (!project.name) {
			alert("Project name is required");
			return;
		}

		Logger.info("Start Date: ", { startDate });
		Logger.info("End Date: ", { endDate });

		const projectToSubmit = {
			...project,
			organizationId: localStorage.getItem("current_tenant_id") || "",
			startDate: startDate ? startDate.toISOString() : "",
			endDate: endDate ? endDate.toISOString() : "",
		};

		Logger.debug("Creating project:", { project: projectToSubmit });

		apiClient
			.post<ProjectResponse, ProjectRequest>(
				`/project/create-new`,
				projectToSubmit
			)
			.then((response) => {
				Logger.debug("Project created successfully:", { response });
				toast.success("Project created successfully!", {
					duration: 3000,
					position: "top-right",
					description: `Project "${response.name}" has been created.`,
					style: {
						backgroundColor: "#f0fff4",
						color: "#16a34a",
					},
				});
				setProject(defaultProjectData);
				setStartDate(undefined);
				setEndDate(undefined);

				setDialogOpen(false);
				// Optionally, you can also refresh the project list or redirect to the new project page
				// window.location.href = `/projects/${response.id}`;
			})
			.catch((error) => {
				Logger.error("Failed to create project:", { error });
				toast.error("Failed to create project. Please try again.", {
					duration: 3000,
					position: "top-right",
					description: "There was an error creating the project.",
					style: {
						backgroundColor: "#fee2e2",
						color: "#b91c1c",
					},
				});
			});
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

						<div className="mt-4 w-full flex justify-start">
							<Dialog
								open={dialogOpen}
								onOpenChange={() => {
									setDialogOpen(!dialogOpen);
									setStartDate(undefined);
									setEndDate(undefined);
								}}
							>
								<DialogTrigger asChild>
									<Button variant={"default"} size={"sm"}>
										Create new project
									</Button>
								</DialogTrigger>
								{/* 
								w-full sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh]
								max-w-[95vw] sm:w-[500px] max-h-[90vh]
								sm:max-w-120 md:max-w-170 lg:max-w-220 sm:max-h-150 w-400 h-140
								w-[100vh] max-w-[95vw] max-h-[90vh]
								*/}

								<DialogContent className="p-4 overflow-auto rounded-xl w-[700px] max-w-[95vw]">
									<DialogHeader className="flex flex-col gap-4 mb-4">
										<DialogTitle className="w-full text-lg text-left">
											New project
										</DialogTitle>
										<DialogDescription className="w-full flex items-center gap-2 text-sm sm:text-xs font-medium break-words text-left whitespace-normal">
											Provide a name, summary, and details for your new project.
											Projects help you organize tasks, milestones, and team
											members around a specific goal or initiative.
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
												value={project.name}
												onChange={(e) =>
													setProject((prev) => ({
														...prev,
														name: e.target.value,
													}))
												}
												className="h-8 text-lg md:text-xl font-semibold p-2 border-none shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
											/>
											<Input
												variant={"minimal"}
												placeholder="Add a short summary..."
												name="summary"
												value={project.summary}
												onChange={(e) =>
													setProject((prev) => ({
														...prev,
														summary: e.target.value,
													}))
												}
												className="text-sm font-semibold p-2 border-none shadow-none bg-transparent text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
											/>
										</div>

										{/* Project metadata options */}
										<div className="flex gap-2 text-sm">
											<StatusSelector
												onChange={(id) => handleOptionClick(id, "status")}
											/>
											<PrioritySelector
												onChange={(id) => handleOptionClick(id, "priority")}
											/>
											<CategorySelector
												onChange={(id) => handleOptionClick(id, "category")}
											/>
											<TeamLeadSelector
												onChange={(id) => handleOptionClick(id, "lead")}
											/>
											<MemberSelector
												onChange={(id) => handleOptionClick(id, "member")}
											/>
											<DatePicker
												triggerLabel="Start"
												triggerIcon={<Calendar size={14} />}
												selectedDate={startDate}
												setSelectedDate={(date: Date) => {
													setStartDate(date);
													setProject((prev) => ({
														...prev,
														startDate: date.toISOString(),
													}));
												}}
												title="Start"
											/>
											<DatePicker
												triggerLabel="Target"
												triggerIcon={<Calendar size={14} />}
												selectedDate={endDate}
												setSelectedDate={(date: Date) => {
													setEndDate(date);
													setProject((prev) => ({
														...prev,
														endDate: date.toISOString(),
													}));
												}}
												title="Target"
											/>
										</div>
										<Separator className="mt-2" />

										{/* Description area */}
										<div className="">
											<textarea
												placeholder="Write a description, a project brief, or collect ideas..."
												value={project.description}
												onChange={(e) =>
													setProject((prev) => ({
														...prev,
														description: e.target.value,
													}))
												}
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
									{/* Dialog footer */}
									<DialogFooter className="flex-shrink-0 pt-4 border-t">
										<div className="flex flex-row justify-end items-center gap-2 w-full">
											<Button onClick={createProject} type="submit">
												Create project
											</Button>
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
