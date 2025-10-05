import { MemberResponse } from "@src/lib/response-types";
import { useCallback } from "react";

interface StoredUserData {
	publicId: string;
	email: string;
	firstName: string;
	lastName: string;
	image?: string;
	organizationId?: string;
	createdAt: string;
}

export function useUserStorage() {
	const storeUserData = useCallback((userData: UserResponse) => {
		const storageData: StoredUserData = {
			publicId: userData.publicId,
			email: userData.email,
			firstName: userData.firstName,
			lastName: userData.lastName,
			image: userData.image,
			organizationId: userData.organizationId,
			createdAt: userData.createdAt,
		};

		localStorage.setItem("taskforge_user", JSON.stringify(storageData));
		sessionStorage.setItem("taskforge_user", JSON.stringify(storageData));
		sessionStorage.setItem("signup_completed", "true");
		sessionStorage.setItem("user_public_id", userData.publicId);
		sessionStorage.setItem("user_email", userData.email);
	}, []);

	const getUserData = useCallback((): StoredUserData | null => {
		try {
			const stored =
				localStorage.getItem("taskforge_user") ||
				sessionStorage.getItem("taskforge_user");
			return stored ? JSON.parse(stored) : null;
		} catch {
			return null;
		}
	}, []);

	const clearUserData = () => {
		localStorage.removeItem("taskforge_user");
		sessionStorage.removeItem("signup_completed");
		sessionStorage.removeItem("user_public_id");
		sessionStorage.removeItem("auth_intent");
		sessionStorage.removeItem("auth_provider");
	};

	const isSignupCompleted = (): boolean => {
		return sessionStorage.getItem("signup_completed") === "true";
	};

	const getAuthIntent = (): string | null => {
		return sessionStorage.getItem("auth_intent");
	};

	const getAuthProvider = (): string | null => {
		return sessionStorage.getItem("auth_provider");
	};

	// Tenant/Organization management functions
	const getCurrentTenantId = useCallback((): string | null => {
		return (
			localStorage.getItem("current_tenant_id") ||
			sessionStorage.getItem("current_tenant_id")
		);
	}, []);

	const setCurrentTenantId = useCallback((tenantId: string) => {
		localStorage.setItem("current_tenant_id", tenantId);
		sessionStorage.setItem("current_tenant_id", tenantId);
	}, []);

	const clearTenantData = useCallback(() => {
		localStorage.removeItem("current_tenant_id");
		sessionStorage.removeItem("current_tenant_id");
	}, []);

	return {
		storeUserData,
		getUserData,
		clearUserData,
		isSignupCompleted,
		getAuthIntent,
		getAuthProvider,
		getCurrentTenantId,
		setCurrentTenantId,
		clearTenantData,
	};
}
