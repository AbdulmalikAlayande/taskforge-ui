import {
	ProjectStatus,
	ProjectPriority,
	ProjectCategory,
	TaskPriority,
	TaskStatus,
	TaskCategory,
} from "./enumeration";

export interface OAuthRequest {
	email: string;
	firstname: string;
	lastname: string;
	image: string;
	provider: string;
	providerId: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface ProjectRequest {
	name: string;
	summary: string;
	description: string;
	startDate: string;
	endDate: string;
	organizationId: string;
	teamLeadId: string;
	memberIds: string[];
	status: ProjectStatus;
	priority: ProjectPriority;
	category: ProjectCategory;
}

export interface TaskRequest {
	title: string;
	description?: string;
	projectId: string;
	assigneeId: string;
	organizationId: string;
	startDate: string;
	dueDate: string;
	priority: TaskPriority;
	status?: TaskStatus;
	category: TaskCategory;
}
