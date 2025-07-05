import { apiClient, ApiError } from "@src/lib/apiClient";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export function useApiClient() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const handleApiError = useCallback(
		(error: ApiError) => {
			switch (error.status) {
				case 401:
					toast.error("Session expired. Please log in again.");
					router.push("/login");
					break;
				case 403:
					toast.error("You do not have permission to perform this action.");
					break;
				case 404:
					toast.error("Resource not found.");
					break;
				case 500:
					toast.error("Server error. Please try again later.");
					break;
				case 503:
					toast.error(
						"Service temporarily unavailable. Please try again later."
					);
					break;
				default:
					if (error.status >= 400) {
						toast.error(error.message || "An error occurred");
					}
			}
		},
		[router]
	);

	useEffect(() => {
		if (status === "loading") return;

		if (session?.backendToken) {
			apiClient.setAuthHeader(session.backendToken);
		} else {
			apiClient.removeAuthHeader();
		}

		apiClient.setErrorHandler(handleApiError);
	}, [session, status, handleApiError]);

	useEffect(() => {
		// You can add a global error handler here if needed
		// window.addEventListener('unhandledApiError', handleApiError);

		return () => {
			// window.removeEventListener('unhandledApiError', handleApiError);
		};
	}, [router]);

	return apiClient;
}

export function useRawApiClient() {
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "loading") return;

		if (session?.backendToken) {
			apiClient.setAuthHeader(session.backendToken);
		} else {
			apiClient.removeAuthHeader();
		}
	}, [session, status]);

	return apiClient;
}
