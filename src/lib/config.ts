/**
 * Application Configuration
 *
 * This file centralizes all environment-based configuration.
 * It provides type-safe access to environment variables and handles
 * switching between development and production environments.
 */

export interface AppConfig {
	// API Configuration
	api: {
		baseUrl: string;
		timeout: number;
		retries: number;
	};

	// Authentication Configuration
	auth: {
		nextAuthUrl: string;
		nextAuthSecret: string;
		providers: {
			github: {
				clientId: string;
				clientSecret: string;
			};
			google: {
				clientId: string;
				clientSecret: string;
			};
			apple: {
				clientId: string;
				clientSecret: string;
			};
			facebook: {
				clientId: string;
				clientSecret: string;
			};
		};
	};

	// External Services
	services: {
		timezoneDb: {
			apiKey: string;
		};
	};

	// Feature flags
	features: {
		enableLogging: boolean;
		enableAnalytics: boolean;
		debugMode: boolean;
	};

	// Environment info
	env: {
		isDevelopment: boolean;
		isProduction: boolean;
		isTest: boolean;
		nodeEnv: string;
	};
}

/**
 * Get the API base URL based on environment
 */
function getApiBaseUrl(): string {
	if (process.env.NEXT_PUBLIC_API_URL) {
		return process.env.NEXT_PUBLIC_API_URL;
	}

	// Default based on NODE_ENV
	switch (process.env.NODE_ENV) {
		case "production":
			return (
				process.env.NEXT_PUBLIC_PROD_API_URL ||
				"https://taskforge-f4v0.onrender.com/api"
			);
		case "development":
			return process.env.NEXT_PUBLIC_DEV_API_URL || "http://localhost:8080/api";
		case "test":
			return (
				process.env.NEXT_PUBLIC_TEST_API_URL || "http://localhost:8080/api"
			);
		default:
			return "http://localhost:8080/api";
	}
}

/**
 * Validate required environment variables
 */
function validateEnvVars(): void {
	const requiredVars = [
		"NEXTAUTH_SECRET",
		"GITHUB_CLIENT_ID",
		"GITHUB_CLIENT_SECRET",
	];

	const missingVars = requiredVars.filter((varName) => !process.env[varName]);

	if (missingVars.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missingVars.join(", ")}`
		);
	}
}

/**
 * Create and export the application configuration
 */
function createConfig(): AppConfig {
	// Validate environment variables first
	validateEnvVars();

	const isDevelopment = process.env.NODE_ENV === "development";
	const isProduction = process.env.NODE_ENV === "production";
	const isTest = process.env.NODE_ENV === "test";

	return {
		api: {
			baseUrl: getApiBaseUrl(),
			timeout: parseInt(process.env.API_TIMEOUT || "30000", 10),
			retries: parseInt(process.env.API_RETRIES || "3", 10),
		},

		auth: {
			nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
			nextAuthSecret: process.env.NEXTAUTH_SECRET!,
			providers: {
				github: {
					clientId: process.env.GITHUB_CLIENT_ID!,
					clientSecret: process.env.GITHUB_CLIENT_SECRET!,
				},
				google: {
					clientId: process.env.GOOGLE_CLIENT_ID || "",
					clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
				},
				apple: {
					clientId: process.env.APPLE_CLIENT_ID || "",
					clientSecret: process.env.APPLE_CLIENT_SECRET || "",
				},
				facebook: {
					clientId: process.env.FACEBOOK_CLIENT_ID || "",
					clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
				},
			},
		},

		services: {
			timezoneDb: {
				apiKey: process.env.TIMEZONE_DB_API_KEY || "AFIYJ4MWEMD1",
			},
		},

		features: {
			enableLogging: process.env.ENABLE_LOGGING !== "false",
			enableAnalytics: process.env.ENABLE_ANALYTICS === "true",
			debugMode: isDevelopment || process.env.DEBUG_MODE === "true",
		},

		env: {
			isDevelopment,
			isProduction,
			isTest,
			nodeEnv: process.env.NODE_ENV || "development",
		},
	};
}

// Export the configuration
export const config = createConfig();

// Export convenience functions
export const getApiUrl = (endpoint: string = ""): string => {
	const baseUrl = config.api.baseUrl.replace(/\/$/, "");
	const cleanEndpoint = endpoint.replace(/^\//, "");
	return cleanEndpoint ? `${baseUrl}/${cleanEndpoint}` : baseUrl;
};

export const isDevMode = (): boolean => config.env.isDevelopment;
export const isProdMode = (): boolean => config.env.isProduction;
export const isTestMode = (): boolean => config.env.isTest;

// Debug helper to log current configuration (only in development)
if (config.env.isDevelopment && typeof window !== "undefined") {
	console.log("🔧 App Configuration:", {
		apiBaseUrl: config.api.baseUrl,
		environment: config.env.nodeEnv,
		debugMode: config.features.debugMode,
	});
}
