import { apiClient } from "@src/lib/apiClient";
import Logger from "@src/lib/logger";

export function useApiClient() {
	//I nned to make this apiClient something that will be reusable
	//In the sense that, I want to be able to embed auth headers, and other stuffs,
	// so when I call this guy, it doesn't just return an apiclient built on axios
	// It returns an apiClient I can use simply to make auntheticated requests to my server
	const accessToken = sessionStorage.getItem("next-auth.access-token");

	if (accessToken && accessToken !== null) apiClient.setAuthHeader(accessToken);

	Logger.debug(`API Client:: ${apiClient}`);
	Logger.debug(`API Client Auth Header:: ${apiClient.getAuthHeader()}`);
	Logger.debug(`API Client Headers:: ${apiClient.getAllHeaders()}`);

	return apiClient;
}
