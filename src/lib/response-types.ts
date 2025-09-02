export enum Role {
	ORGANIZATION_MEMBER = "ORGANIZATION_MEMBER",
	ORGANIZATION_ADMIN = "ORGANIZATION_ADMIN",
	ORGANIZATION_OWNER = "ORGANIZATION_OWNER",
}

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
	firstname: string;
	lastname: string;
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
}

export interface ProjectResponse {
	id: string;
	publicId: string;
	name: string;
	summary: string;
	description: string;
	startDate: Date;
	endDate: Date;
	organizationId: string;
	memberIds: string[];
	status: string;
	priority: string;
	category: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface MemberResponse {
	publicId: string;
}

export enum TaskCategory {
	BUG = "BUG",
	FEATURE = "FEATURE",
	IMPROVEMENT = "IMPROVEMENT",
	RESEARCH = "RESEARCH",
}

export enum TaskPriority {
	LOW = "LOW",
	MEDIUM = "MEDIUM",
	HIGH = "HIGH",
	CRITICAL = "CRITICAL",
}

export enum TaskStatus {
	TODO = "TODO",
	IN_PROGRESS = "IN_PROGRESS",
	DONE = "DONE",
	ARCHIVED = "ARCHIVED",
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
