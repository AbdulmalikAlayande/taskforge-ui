"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@src/components/ui/sidebar";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { TeamSwitcher } from "./team-switcher";
import { MainWorkspace } from "./main-workspace";
import { MemberInvitationTrigger } from "./member-invitation-trigger";
import { UserAccountActions } from "./user-account-actions";
import {
	BarChart2,
	FolderClosed,
	Inbox,
	ListTodo,
	MailCheck,
	MessageCircle,
	type LucideIcon,
} from "lucide-react";
import { useUserStorage } from "@src/app/hooks/useUserStorage";
import Logger from "@src/lib/logger";
import { defaultTeams } from "@src/lib/utils";
import { OrganizationResponse, TaskResponse } from "@src/lib/response-types";
import { apiClient, ApiError } from "@src/lib/apiClient";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useFetch } from "@src/app/hooks/useFetch";
import { useOrganization } from "@src/components/tenant-provider";

interface WorkspaceItem {
	title: string;
	url: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: Array<{
		title: string;
		url: string;
		icon?: LucideIcon;
	}>;
}

// User data interface
interface UserData {
	name: string;
	email: string;
	avatar: string;
}

type AppSidebarProps = {
	organization: OrganizationResponse;
	props: React.ComponentProps<typeof Sidebar>;
	navbarPathProps?: NavbarPathProps[];
	setNavbarPathProps?: React.Dispatch<React.SetStateAction<NavbarPathProps[]>>;
};

type NavbarPathProps = {
	pathname: string;
	pathurl: string;
};

export const AppSidebar = ({
	organization,
	navbarPathProps,
	setNavbarPathProps,
	...props
}: AppSidebarProps) => {
	const { getUserData } = useUserStorage();
	const { tenantId } = useOrganization();
	const [taskItems, setTaskItems] = useState<
		Array<{ title: string; url: string }>
	>([]);
	const [userData, setUserData] = useState<UserData>();

	const defaultProjectId = useMemo(() => {
		return organization.projects.length > 0
			? organization.projects[0].id
			: null;
	}, [organization.projects]);

	const { data: tasksData } = useFetch<TaskResponse[]>({
		url: `/tasks?projectid=${defaultProjectId || ""}`,
		queryKey: ["tasks", defaultProjectId || ""],
		enabled: !!defaultProjectId,
	});

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

	useEffect(() => {
		if (tasksData) {
			const items = tasksData.map((task) => ({
				title: task.title,
				url: `/tasks/${task.publicId}`,
			}));
			setTaskItems(items);
		}
	}, [tasksData]);

	const buildProjectItemFromOrganization = useCallback(() => {
		return organization.projects.map((project) => ({
			title: project.name,
			url: `/${tenantId}/projects/${project.publicId}`,
		}));
	}, [organization, tenantId]);

	const buildTaskItems = useCallback(async (projectId: string) => {
		if (!projectId) return [];

		try {
			const tasks = await apiClient.get<TaskResponse[]>(
				`/tasks?projectid=${projectId}`
			);

			return tasks.map((task) => ({
				title: task.title,
				url: `/tasks/${task.publicId}`,
			}));
		} catch (error: unknown) {
			const axiosError = error as AxiosError;
			const apiError: ApiError = new ApiError(
				axiosError.message,
				axiosError.status!
			);
			apiError.cause = axiosError.cause;
			apiError.status = axiosError.status ?? 0;
			if (axiosError.response) {
				apiError.code = axiosError.code;
				const responseData = axiosError.response.data as { message?: string };
				apiError.details = responseData?.message ?? "";
			}
			toast.error("Failed to load tasks", {
				description: apiError.message,
				action: {
					label: "Retry",
					onClick: () => {
						buildTaskItems(projectId);
					},
				},
			});
			return [];
		}
	}, []);

	// Build all workspace items
	const buildWorkspaceItems = useCallback((): WorkspaceItem[] => {
		return [
			{
				title: "Project",
				url: "/projects",
				icon: FolderClosed,
				isActive: true,
				items: buildProjectItemFromOrganization(),
			},
			{
				title: "Tasks",
				url: "/tasks",
				icon: ListTodo,
				isActive: true,
				items: taskItems,
			},
			{
				title: "Insights",
				url: "/insights",
				icon: BarChart2,
				isActive: true,
				items: [
					{
						title: "Reporting",
						url: "/insights/reporting",
					},
					{
						title: "Goals",
						url: "/insights/goals",
					},
					{
						title: "Analytics",
						url: "/insights/analytics",
					},
				],
			},
			{
				title: "Messages",
				url: "/messages",
				icon: MailCheck,
				isActive: true,
				items: [
					{
						title: "Chats",
						url: "/messages/all",
						icon: MessageCircle,
					},
					{
						title: "Inbox",
						url: "/messages/inbox",
						icon: Inbox,
					},
				],
			},
		];
	}, [buildProjectItemFromOrganization, taskItems]);

	// Memoize workspace items to prevent unnecessary re-renders
	const workspaceItems = useMemo(
		() => buildWorkspaceItems(),
		[buildWorkspaceItems]
	);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={defaultTeams} />
			</SidebarHeader>
			<SidebarContent>
				<MainWorkspace
					navbarPathProps={navbarPathProps}
					items={workspaceItems}
					setNavbarPathProps={setNavbarPathProps}
				/>
			</SidebarContent>
			<SidebarFooter>
				<UserAccountActions
					user={{
						name: userData?.name || "Unknown User",
						email: userData?.email || "unknown@example.com",
						avatar: userData?.avatar || "",
					}}
				/>
				<MemberInvitationTrigger />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
};
