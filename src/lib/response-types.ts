export enum Role {
	ORGANIZATION_MEMBER = "ORGANIZATION_MEMBER",
	ORGANIZATION_ADMIN = "ORGANIZATION_ADMIN",
	ORGANIZATION_OWNER = "ORGANIZATION_OWNER",
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
}

export interface ApiErrorResponse {
	message: string;
	code?: string;
	details?: unknown;
}
