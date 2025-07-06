"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@src/components/ui/sidebar";
import React from "react";
import { TeamSwitcher } from "./team-switcher";
import { MainWorkspace } from "./main-workspace";
import { MemberInvitationTrigger } from "./member-invitation-trigger";
import { UserActions } from "./user-actions";

export const AppSidebar = ({
	...props
}: React.ComponentProps<typeof Sidebar>) => {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				AppSidebar
				<TeamSwitcher teams={[]} />
			</SidebarHeader>
			<SidebarContent>
				<MainWorkspace items={[]} />
				Project -- sub project 1 -- sub project 2 ... \nInsights \n\t--
				Reporting \n\t-- Goals \nInbox \n\t-- Read \n\t-- Archived \n\t-- Unread
				\n\t-- All
			</SidebarContent>
			<SidebarFooter>
				<UserActions
					user={{
						name: "",
						email: "",
						avatar: "",
					}}
				/>
				<MemberInvitationTrigger />
			</SidebarFooter>
		</Sidebar>
	);
};
