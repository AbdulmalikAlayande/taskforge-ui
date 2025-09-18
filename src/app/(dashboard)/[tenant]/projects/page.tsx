"use client";

import React, { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import { AppNavbar } from "../components/navbar/app-navbar";
import { useOrganization } from "@src/components/tenant-provider";
import {
	ArrowUpDown,
	ListFilter,
	PlusIcon,
	SlidersHorizontal,
} from "lucide-react";
import { Button } from "@src/components/ui/button";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@src/components/ui/popover";
import { NoAvailableProjectView } from "./components/no-available-project-view";
import { Label } from "@src/components/ui/label";
import DataTable from "@src/components/ui/data-table";
import { ProjectResponse } from "@src/lib/response-types";
import { ColumnDef } from "@tanstack/react-table";
import CreateProjectPopover from "./components/create-project-popover";
import { Checkbox } from "@src/components/ui/checkbox";
import {
	Command,
	CommandEmpty,
	CommandList,
	CommandSeparator,
} from "@src/components/ui/command";
import { Kbd } from "@src/components/ui/kbd";
import { format, parseISO } from "date-fns";

const projectColumns: ColumnDef<ProjectResponse>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all projects"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label={`Select project ${row.getValue("name")}`}
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "endDate",
		header: "End Date",
		cell: ({ row }) => {
			const dateValue = row.getValue("endDate");
			if (!dateValue || typeof dateValue !== "string") return "-";
			try {
				const parsedDate = parseISO(dateValue);
				return format(parsedDate, "MMM d, yyyy");
			} catch {
				return "-";
			}
		},
	},
	{ accessorKey: "status", header: "Status" },
	{ accessorKey: "priority", header: "Priority" },
	{ accessorKey: "category", header: "Category" },
];

const Project = () => {
	const {
		organization,
		isLoading,
		error,
		tenantId,
		hasOrganization,
		refreshOrganization,
		projects,
	} = useOrganization();
	const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
	const [path, setPath] = useState([
		{
			pathname: "Projects",
			pathurl: "/projects",
		},
	]);

	useEffect(() => {
		console.log("Projects", projects);
	}, [projects]);

	const onProjectRowClick = (project: ProjectResponse) => {
		setPath((prev) => [
			...prev,
			{
				pathname: project.name,
				pathurl: `/projects/${project.publicId}`,
			},
		]);
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

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-lg font-semibold text-destructive mb-2">
						Failed to load organization
					</h2>
					<p className="text-muted-foreground mb-4">{error}</p>
					<button
						onClick={refreshOrganization}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	if (!hasOrganization) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-lg font-semibold mb-2">Organization not found</h2>
					<p className="text-muted-foreground">
						The requested organization could not be found.
					</p>
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
			<AppSidebar
				props={{ variant: "inset" }}
				organization={organization!}
				navbarPathProps={path}
				// activeSection="Projects"
				setNavbarPathProps={setPath}
			/>
			<SidebarInset>
				<AppNavbar section={"Projects"} pathProps={path} />
				<div className="text-sm w-full border-b flex justify-between items-center px-2 py-1">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant={"ghost"}>
								<ListFilter />
								<Label className="text-sm">Filter</Label>
							</Button>
						</PopoverTrigger>
						<PopoverContent
							align="start"
							sideOffset={8}
							className="text-sm w-80 h-screen p-2 rounded-md border bg-popover text-popover-foreground shadow-md"
						>
							<Command className="text-sm">
								<div className="h-6 flex items-baseline justify-between mb-2">
									<span className="h-full text-xs text-muted-foreground flex items-center gap-1">
										<Kbd className="border-border">⌘</Kbd>
										<span> then </span>
										<Kbd className="border-border">F</Kbd>
									</span>
								</div>
								<CommandSeparator />
								<CommandList>
									<CommandEmpty>No filters applied</CommandEmpty>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
					<div className="flex space-x-2 text-sm">
						<CreateProjectPopover
							tenantId={tenantId}
							dialogOpen={createProjectDialogOpen}
							setDialogOpen={setCreateProjectDialogOpen}
							controller={
								<Button
									className="h-7 text-sm text-accent-foreground"
									variant={"ghost"}
									size={"sm"}
								>
									<PlusIcon />
									<Label className="text-sm">Add Project</Label>
								</Button>
							}
						/>

						<Popover>
							<PopoverTrigger asChild>
								<Button
									className="h-7 text-sm border text-accent-foreground bg-blend-color"
									size={"sm"}
									variant={"secondary"}
								>
									<SlidersHorizontal />
									<Label className="text-sm">Display</Label>
								</Button>
							</PopoverTrigger>
							<PopoverContent className="text-sm w-80 h-80 p-4"></PopoverContent>
						</Popover>
					</div>
				</div>
				<div className="h-full w-full flex flex-col items-center px-6 py-2">
					{projects.length > 0 ? (
						<div className="w-full">
							<DataTable
								columns={projectColumns}
								data={projects}
								onRowClick={onProjectRowClick}
							/>
						</div>
					) : (
						<NoAvailableProjectView
							tenantId={tenantId}
							dialogOpen={createProjectDialogOpen}
							setDialogOpen={setCreateProjectDialogOpen}
						/>
					)}

					{/* <CreateProjectPopover
						tenantId={tenantId}
						dialogOpen={createProjectDialogOpen}
						setDialogOpen={setCreateProjectDialogOpen}
					/> */}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default Project;
