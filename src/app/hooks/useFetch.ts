import { apiClient, ApiError } from "@src/lib/apiClient";
import Logger from "@src/lib/logger";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type FetchParams = {
	url: string;
};

export function useFetch<T>(params: FetchParams) {
	const fetchData = async () => {
		try {
			return await apiClient.get<T>(params.url);
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
		queryKey: [],
		queryFn: fetchData,
	});
}
