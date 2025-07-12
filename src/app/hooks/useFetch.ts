import { ApiError } from "@src/lib/apiClient";
import Logger from "@src/lib/logger";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useApiClient } from "./useApiClient";

type FetchParams = {
	url: string;
	queryKey: string[];
	enabled?: boolean;
	staleTime?: number;
	retry?: number | boolean;
};

export function useFetch<T>(params: FetchParams) {
	const tenantAwareApiClient = useApiClient();
	const fetchData = async () => {
		try {
			return await tenantAwareApiClient.apiClient.get<T>(params.url);
		} catch (error: unknown) {
			Logger.error(`${error}`);
			const axiosError = error as AxiosError;
			const message = axiosError.message || "Unknown error";
			const status = axiosError.response?.status ?? 500;
			const code = axiosError.code;
			const details = axiosError.response?.data;
			const err = new ApiError(message, status, code, details);
			throw err;
		}
	};

	return useQuery<T>({
		queryKey: params.queryKey,
		queryFn: fetchData,
		staleTime: params.staleTime ?? 3_600_000, // Default 1 hour before refetching
		retry: params.retry ?? 2, // Default to only 1 retry
		enabled: params.enabled !== false && !!params.url, // Only run if enabled and URL exists
	});
}
