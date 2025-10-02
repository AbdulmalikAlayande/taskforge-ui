import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Logger from "./logger";
import { config } from "./config";

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

	constructor(baseUrl?: string, axiosConfig: AxiosRequestConfig = {}) {
		// Use provided baseUrl or fall back to config
		this.baseUrl = baseUrl || config.api.baseUrl;

		this.client = axios.create({
			baseURL: this.baseUrl,
			timeout: config.api.timeout,
			...axiosConfig,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				...axiosConfig.headers,
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

	setAuthHeader(token: string) {
		this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
	}

	removeAuthHeader() {
		delete this.client.defaults.headers.common.Authorization;
	}

	setCustomHeader(name: string, value: string) {
		this.client.defaults.headers.common[name] = value;
	}

	removeCustomHeader(name: string) {
		delete this.client.defaults.headers.common[name];
	}

	getHeader(name: string) {
		return this.client.defaults.headers.common[name];
	}

	getAllHeaders() {
		return this.client.defaults.headers.common;
	}
	getAuthHeader() {
		return this.client.defaults.headers.common.Authorization;
	}

	getRawClient(): AxiosInstance {
		return this.client;
	}
}

export const apiClient = new ApiClient();

export const createApiClient = (
	baseUrl?: string,
	axiosConfig?: AxiosRequestConfig
) => new ApiClient(baseUrl, axiosConfig);

export const getCurrentApiUrl = () => config.api.baseUrl;
