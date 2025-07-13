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

export enum ProjectCategory {
	BUILDING = "BUILDING",
	SOFTWARE = "SOFTWARE",
	DESIGN = "DESIGN",
	MARKETING = "MARKETING",
	SALES = "SALES",
	HUMAN_RESOURCES = "HUMAN_RESOURCES",
	FINANCE = "FINANCE",
	OPERATIONS = "OPERATIONS",
	LEGAL = "LEGAL",
	IT_SUPPORT = "IT_SUPPORT",
	ENTERTAINMENT = "ENTERTAINMENT",
	OTHER = "OTHER",
}

export enum ProjectStatus {
	ACTIVE = "ACTIVE",
	PAUSED = "PAUSED",
	BACKLOG = "BACKLOG",
	ARCHIVED = "ARCHIVED",
	ABANDONED = "ABANDONED",
	CANCELLED = "CANCELLED",
	COMPLETED = "COMPLETED",
	IN_PROGRESS = "IN_PROGRESS",
}

export enum ProjectPriority {
	HIGH = "HIGH",
	LOW = "LOW",
	MEDIUM = "MEDIUM",
	NO_PRIORITY = "NO_PRIORITY",
}
export interface ProjectRequest {
	name: string;
	summary: string;
	description: string;
	startDate: Date;
	endDate: Date;
	organizationId: string;
	memberIds: string[];
	status: ProjectStatus;
	priority: ProjectPriority;
	category: ProjectCategory;
}
