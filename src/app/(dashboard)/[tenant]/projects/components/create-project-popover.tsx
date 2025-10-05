import React, { JSX, ReactNode, useEffect } from "react";
import { Box, Calendar, Users2 } from "lucide-react";
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
} from "./data-selector";
import { MemberSelector } from "./member-selector";
import DatePicker from "@src/components/ui/date-picker";
import { Separator } from "@src/components/ui/separator";
import { useState } from "react";
import { Button } from "@src/components/ui/button";
import {
	MemberResponse,
	OrganizationResponse,
	ProjectResponse,
} from "@src/lib/response-types";
import { toast } from "sonner";
import { useApiClient } from "@src/app/hooks/useApiClient";
import Logger from "@src/lib/logger";
import { ProjectRequest } from "@src/lib/request-types";
import {
	ProjectCategory,
	ProjectPriority,
	ProjectStatus,
} from "@src/lib/enumeration";

const defaultProjectData: ProjectRequest = {
	name: "",
	description: "",
	organizationId: "",
	summary: "",
	startDate: "",
	endDate: "",
	teamLeadId: "",
	memberIds: [],
	status: ProjectStatus.ACTIVE,
	priority: ProjectPriority.HIGH,
	category: ProjectCategory.BUILDING,
};

const CreateProjectPopover: React.FC<{
	tenantId: string;
	dialogOpen: boolean;
	setDialogOpen: (dialogOpen: boolean) => void;
	organization: OrganizationResponse;
	controller: ReactNode | JSX.Element;
}> = ({ tenantId, dialogOpen, setDialogOpen, organization, controller }) => {
	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();
	const { apiClient } = useApiClient();
	const [project, setProject] = useState<ProjectRequest>(defaultProjectData);
	const [teamMembers, setTeamMembers] = useState<MemberResponse[]>([]);
	const [loadingTeamMembers, setLoadingTeammembers] = useState<boolean>(false);

	const fetchMembers = React.useCallback(async () => {
		setLoadingTeammembers(true);
		try {
			const response = await apiClient.get<MemberResponse[]>(
				`/organization/${tenantId}/members`
			);
			if (response && response.length > 0) setTeamMembers(response);
		} finally {
			setLoadingTeammembers(false);
		}
	}, [apiClient, tenantId]);

	useEffect(() => {
		if (organization.members && organization.members.length > 0) {
			setTeamMembers(organization.members);
		} else {
			fetchMembers();
		}
	}, [organization.members, fetchMembers]);

	const handleOptionClick = (id: string, selectorType?: string) => {
		setProject((prev) => {
			switch (selectorType) {
				case "status":
					return { ...prev, status: id.toUpperCase() as ProjectStatus };
				case "priority":
					return { ...prev, priority: id.toUpperCase() as ProjectPriority };
				case "category":
					return { ...prev, category: id.toUpperCase() as ProjectCategory };
				case "lead":
					return { ...prev, teamLeadId: id };
				case "member":
					const memberIds = [...prev.memberIds];
					if (!memberIds.includes(id)) {
						memberIds.push(id);
					}
					return { ...prev, memberIds };
				default:
					return prev;
			}
		});
		console.log("Project After:: ", project);
	};

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
			organizationId:
				tenantId || localStorage.getItem("current_tenant_id") || "",
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
				/*TODO: I think I should refresh the project list or redirect to the new project page
				 like: window.location.href = `/projects/${response.id}`;*/
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
		<div className="flex justify-start">
			<Dialog
				open={dialogOpen}
				onOpenChange={() => {
					setDialogOpen(!dialogOpen);
					// setStartDate(undefined);
					// setEndDate(undefined);
				}}
			>
				<DialogTrigger asChild>{controller}</DialogTrigger>
				<DialogContent className="p-4 overflow-auto rounded-xl min-w-[90vw] max-w-[95vw] lg:min-w-[60vw] lg:max-w-[70vw] ">
					<DialogHeader className="flex flex-col gap-4 mb-4">
						<DialogTitle className="w-full text-lg text-left">
							New project
						</DialogTitle>
						<DialogDescription className="w-full flex items-center gap-2 text-sm sm:text-xs font-medium break-words text-left whitespace-normal">
							Provide a name, summary, and details for your new project.
							Projects help you organize tasks, milestones, and team members
							around a specific goal or initiative.
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
								tenantId={tenantId}
								members={teamMembers}
								onChange={(id) => handleOptionClick(id, "lead")}
							/>
							<MemberSelector
								userIcon={<Users2 />}
								label="Members"
								members={teamMembers}
								isLoading={loadingTeamMembers}
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
	);
};

export default CreateProjectPopover;
