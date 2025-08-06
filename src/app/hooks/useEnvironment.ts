import { useMemo } from "react";
import { config, getApiUrl, isDevMode } from "@src/lib/config";
import { createApiClient } from "@src/lib/apiClient";

/**
 * Hook for environment-aware API operations
 * Provides utilities for making API calls that adapt to the current environment
 */
export function useEnvironment() {
	const apiClient = useMemo(() => createApiClient(), []);

	const environment = useMemo(
		() => ({
			isDevelopment: config.env.isDevelopment,
			isProduction: config.env.isProduction,
			isTest: config.env.isTest,
			nodeEnv: config.env.nodeEnv,
			apiBaseUrl: config.api.baseUrl,
			debugMode: config.features.debugMode,
		}),
		[]
	);

	const buildUrl = useMemo(() => (endpoint: string) => getApiUrl(endpoint), []);

	const logEnvironmentInfo = useMemo(
		() => () => {
			if (isDevMode()) {
				console.group("🔧 Environment Information");
				console.log("Environment:", environment.nodeEnv);
				console.log("API Base URL:", environment.apiBaseUrl);
				console.log("Debug Mode:", environment.debugMode);
				console.log("Features:", config.features);
				console.groupEnd();
			}
		},
		[environment]
	);

	return {
		...environment,
		apiClient,
		buildUrl,
		config: config,
		logEnvironmentInfo,
	};
}

/**
 * Simple hook to check if we're in development mode
 */
export function useIsDev(): boolean {
	return config.env.isDevelopment;
}

/**
 * Hook to get environment-specific configuration values
 */
export function useConfig() {
	return config;
}
