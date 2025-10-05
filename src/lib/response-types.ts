import {
	Role,
	ProjectStatus,
	ProjectPriority,
	ProjectCategory,
	TaskStatus,
	TaskPriority,
	TaskCategory,
} from "./enumeration";

export interface LoginResponse {
	userId: string;
	email: string;
	accessToken: string;
	refreshToken: string;
	roles: string[];
	tokenType: "Bearer";
	expiresIn: string;
	tenantId?: string;
	organizationId?: string;
}

export interface UserResponse {
	role: Role;
	publicId: string;
	organizationId: string;
	email: string;
	firstName: string;
	lastName: string;
	image?: string;
	createdAt: string;
	lastModifiedAt: string;
	active: boolean;
}

export interface Task {
	publicId: string;
	title: string;
	description?: string;
	status: "todo" | "in-progress" | "completed";
	priority: "low" | "medium" | "high";
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface CountryAndTimezone {
	status: string;
	message: string;
	zones: [
		{
			countryCode: string;
			countryName: string;
			zoneName: string;
			gmtOffset: number;
			timestamp: number;
		},
	];
}

export interface ApiResponse<T> {
	data: T;
	message?: string;
	meta?: {
		page?: number;
		limit?: number;
		total?: number;
	};
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}
export interface OrganizationResponse {
	publicId: string;
	name: string;
	email: string;
	slug: string;
	description?: string;
	industry?: string;
	country?: string;
	phone?: string;
	timeZone?: string;
	websiteUrl?: string;
	logoUrl?: string;
	projects: ProjectResponse[];
	members: UserResponse[];
}

export interface ProjectResponse {
	id: string;
	publicId: string;
	name: string;
	summary: string;
	description: string;
	startDate: string;
	endDate: string;
	organizationId: string;
	memberIds: string[];
	members: MemberResponse[];
	status: ProjectStatus;
	priority: ProjectPriority;
	category: ProjectCategory;
	createdAt: string;
	lastModifiedAt: string;
}

export interface MemberResponse {
	active: boolean;
	publicId: string;
	firstName: string;
	lastName: string;
	email: string;
	image?: string;
	organizationId?: string;
	role: Role;
	createdAt: string;
	lastModifiedAt: string;
}

export interface TaskResponse {
	pinned: boolean;
	title: string;
	publicId: string;
	projectId: string;
	assigneeId: string;
	assignee: MemberResponse;
	description: string;
	organizationId: string;
	createdAt: string;
	lastModifiedAt: string;
	completedAt: string;
	dueDate: string;
	startDate: string;

	status: TaskStatus;
	priority: TaskPriority;
	category: TaskCategory;
}

export interface ApiErrorResponse {
	message: string;
	code?: string;
	details?: unknown;
}
