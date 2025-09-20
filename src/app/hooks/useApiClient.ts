import { apiClient } from "@src/lib/apiClient";
import { useMemo } from "react";
// import Logger from "@src/lib/logger";

export function useApiClient() {
	return useMemo(() => {
		//I need to make this apiClient something that will be reusable
		//In the sense that, I want to be able to embed auth headers, and other stuffs,
		// so when I call this guy, it doesn't just return an apiclient built on axios
		// It returns an apiClient I can use simply to make auntheticated requests to my server

		let accessToken;
		if (typeof window !== "undefined" && window.sessionStorage) {
			accessToken = sessionStorage.getItem("next-auth.access-token");
			console.log("In useApiClient:: Testing Access token:: ", accessToken);
		}
		console.log("2: In useApiClient:: Testing Access token:: ", accessToken);
		if (accessToken) apiClient.setAuthHeader(accessToken);
		console.log(
			"In useApiClient:: Testing Auth Header:: ",
			apiClient.getAuthHeader()
		);

		console.log(
			"In useApiClient:: Testing All Headers:: ",
			apiClient.getAllHeaders()
		);

		let tenantId;
		if (typeof window !== "undefined" && window.localStorage) {
			tenantId = localStorage.getItem("current_tenant_id");
			if (tenantId) {
				apiClient.setCustomHeader("X-Tenant-ID", tenantId);
			}
		}
		console.log("In useApiClient:: Testing Local Storage data:: ", tenantId);

		// if (process.env.NODE_ENV === "development") {
		// 	Logger.debug(`API Client Auth Header:: ${apiClient.getAuthHeader()}`);
		// 	Logger.debug(
		// 		`API Client Tenant Header:: ${apiClient.getHeader("X-Tenant-ID")}`
		// 	);
		// }

		const tenantAwareApiClient = {
			apiClient,

			setTenantId: (id: string) => {
				if (id) {
					apiClient.setCustomHeader("X-Tenant-ID", id);
					if (typeof window !== "undefined" && window.localStorage) {
						localStorage.setItem("current_tenant_id", id);
					}
				}
				return tenantAwareApiClient;
			},

			clearTenantId: () => {
				apiClient.removeCustomHeader("X-Tenant-ID");
				if (typeof window !== "undefined" && window.localStorage) {
					localStorage.removeItem("current_tenant_id");
				}
				return tenantAwareApiClient;
			},

			getCurrentTenantId: () => {
				return apiClient.getHeader("X-Tenant-ID") as string | undefined;
			},
		};

		return tenantAwareApiClient;
	}, []);
}
