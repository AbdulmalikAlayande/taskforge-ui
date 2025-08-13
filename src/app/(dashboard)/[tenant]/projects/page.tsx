"use client";

import React from "react";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import { AppNavbar } from "../components/navbar/app-navbar";
import { useOrganization } from "@src/components/tenant-provider";
import { Boxes, ListFilter, SlidersHorizontal } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { TypographyP } from "@src/components/ui/typography";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@src/components/ui/popover";
import { CreateProjectDialog } from "./components/create-project-popover";
import { DescriptionItem, DescriptionList } from "@src/components/ui/list";
import { Label } from "@src/components/ui/label";

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
				sidebarProps={{ variant: "inset" }}
				organization={organization!}
			/>
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

						<CreateProjectDialog tenantId={tenantId} />
					</div>

					{organization && (
						<DescriptionList>
							<DescriptionItem term="Name" description={organization.name} />
							<DescriptionItem
								term="Industry"
								description={organization.industry || "Not specified"}
							/>
							<DescriptionItem
								term="Country"
								description={organization.country || "Not specified"}
							/>
							<DescriptionItem
								term="Phone"
								description={organization.phone || "Not specified"}
							/>
							<DescriptionItem
								term="Time Zone"
								description={organization.timeZone || "Not specified"}
							/>
							<DescriptionItem
								term="Website"
								description={organization.websiteUrl || "Not specified"}
							/>
							<DescriptionItem
								term="Projects Count"
								description={projects.length.toString()}
							/>
						</DescriptionList>
					)}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default Project;
