"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@src/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { TeamSwitcher } from "./team-switcher";
import { MainWorkspace } from "./main-workspace";
import { MemberInvitationTrigger } from "./member-invitation-trigger";
import { UserActions } from "./user-actions";
import { BarChart2, FolderClosed, ListTodo, MailCheck } from "lucide-react";
import { useUserStorage } from "@src/app/hooks/useUserStorage";
import Logger from "@src/lib/logger";

const workspaceItems = [
	{
		title: "Project",
		url: "/projects",
		icon: FolderClosed,
		isActive: true,
		items: [
			{
				title: "",
				url: "",
			},
		],
	},
	{
		title: "Tasks",
		url: "/tasks",
		icon: ListTodo,
		isActive: true,
		items: [
			{
				title: "",
				url: "",
			},
			{
				title: "",
				url: "",
			},
			{
				title: "",
				url: "",
			},
		],
	},
	{
		title: "Insights",
		url: "/insights",
		icon: BarChart2,
		isActive: true,
		items: [
			{
				title: "Reporting",
				url: "",
			},
			{
				title: "Goals",
				url: "",
			},
			{
				title: "Analytics",
				url: "",
			},
		],
	},
	{
		title: "Inbox",
		url: "/inbox",
		icon: MailCheck,
		isActive: true,
		items: [
			{
				title: "Read",
				url: "",
			},
			{
				title: "Unread",
				url: "",
			},
			{
				title: "Archived",
				url: "",
			},
		],
	},
];
export const AppSidebar = ({
	...props
}: React.ComponentProps<typeof Sidebar>) => {
	const { getUserData } = useUserStorage();
	const [userData, setUserData] = useState<{
		name: string;
		email: string;
		avatar: string;
	}>();

	useEffect(() => {
		const data = getUserData();
		Logger.info("DATA:: ", { data });
		if (data?.email && (data.firstName || data.lastName) && data.image) {
			setUserData({
				email: data.email,
				name: `${data.firstName} ${data.lastName}`,
				avatar: data.image,
			});
		}
	}, [getUserData]);
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				AppSidebar
				<TeamSwitcher teams={[]} />
			</SidebarHeader>
			<SidebarContent>
				<MainWorkspace items={workspaceItems} />
			</SidebarContent>
			<SidebarFooter>
				<UserActions
					user={{
						name: userData?.name || "",
						email: userData?.email || "",
						avatar: userData?.avatar || `${userData?.name?.charAt(0)}`,
					}}
				/>
				<MemberInvitationTrigger />
			</SidebarFooter>
		</Sidebar>
	);
};
