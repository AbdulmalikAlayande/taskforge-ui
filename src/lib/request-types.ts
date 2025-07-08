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
