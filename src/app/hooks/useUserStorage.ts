import { UserResponse } from "@src/lib/response-types";

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
	const storeUserData = (userData: UserResponse) => {
		const storageData: StoredUserData = {
			publicId: userData.publicId,
			email: userData.email,
			firstName: userData.firstname,
			lastName: userData.lastname,
			image: userData.image,
			organizationId: userData.organizationId,
			createdAt: userData.createdAt,
		};

		// Store in localStorage for cross-session persistence
		localStorage.setItem("taskforge_user", JSON.stringify(storageData));

		// Store in sessionStorage for immediate access
		sessionStorage.setItem("signup_completed", "true");
		sessionStorage.setItem("user_public_id", userData.publicId);
	};

	const getUserData = (): StoredUserData | null => {
		try {
			const stored = localStorage.getItem("taskforge_user");
			return stored ? JSON.parse(stored) : null;
		} catch {
			return null;
		}
	};

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

	return {
		storeUserData,
		getUserData,
		clearUserData,
		isSignupCompleted,
		getAuthIntent,
		getAuthProvider,
	};
}
