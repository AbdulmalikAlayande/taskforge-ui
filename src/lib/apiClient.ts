import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Logger from "./logger";

export class ApiError extends Error {
	public status: number;
	public code?: string;
	public details?: unknown;

	constructor(
		message: string,
		status: number,
		code?: string,
		details?: unknown
	) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
		this.details = details;
	}
}

class ApiClient {
	private client: AxiosInstance;
	private baseUrl: string;
	private errorHandler?: (error: ApiError) => void;

	constructor(baseUrl: string, config: AxiosRequestConfig = {}) {
		this.baseUrl = baseUrl;

		this.client = axios.create({
			baseURL: this.baseUrl,
			timeout: 30_000,
			...config,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				...config.headers,
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		this.client.interceptors.request.use(
			(config) => {
				Logger.debug(
					`API Request: ${config.method?.toUpperCase()} ${config.url}`
				);
				return config;
			},
			(error) => Promise.reject(error)
		);

		this.client.interceptors.response.use(
			(response) => {
				Logger.debug(`API Response: ${response.status} ${response.config.url}`);
				return response;
			},
			(error) => {
				Logger.error("API error:", error);
				return Promise.reject(error);
			}
			// (error) => {
			// 	const status = error.response?.status;
			// 	const message =
			// 		error.response?.data?.message || "An unexpected error occurred";
			// 	const code = error.response?.data?.code;
			// 	const details = error.response?.data?.details;
			// 	Logger.error("Errores", error);

			// 	Logger.error(`API Error: ${status} ${error.config?.url}`, {
			// 		message,
			// 		code,
			// 		details,
			// 	});

			// 	const apiError = new ApiError(message, status || 0, code, details);

			// 	if (this.errorHandler) {
			// 		this.errorHandler(apiError);
			// 	}

			// 	return Promise.reject(apiError);
			// }
		);
	}

	setErrorHandler(handler: (error: ApiError) => void) {
		this.errorHandler = handler;
	}

	removeErrorHandler() {
		this.errorHandler = undefined;
	}

	async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.get<T>(url, config);
		return response.data;
	}

	async post<T, D = unknown>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response = await this.client.post<T>(url, data, config);
		return response.data;
	}

	async put<T, D = unknown>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response = await this.client.put<T>(url, data, config);
		return response.data;
	}

	async patch<T, D = unknown>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response = await this.client.patch<T>(url, data, config);
		return response.data;
	}

	async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.delete<T>(url, config);
		return response.data;
	}

	// This helps me set the authorization header
	setAuthHeader(token: string) {
		this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
		Logger.debug("Auth header set");
	}

	// the removes the authorization header
	removeAuthHeader() {
		delete this.client.defaults.headers.common.Authorization;
		Logger.debug("Auth header removed");
	}

	getAllHeaders() {
		return this.client.defaults.headers.common;
	}
	getAuthHeader() {
		return this.client.defaults.headers.common.Authorization;
	}

	// It returns just the raw client instance, with no config
	getRawClient(): AxiosInstance {
		return this.client;
	}
}

export const apiClient = new ApiClient(
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
);
