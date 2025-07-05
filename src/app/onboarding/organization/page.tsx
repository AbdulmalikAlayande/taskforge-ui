"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserStorage } from "@src/app/hooks/useUserStorage";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import { toast } from "sonner";

export default function OrganizationOnboardingPage() {
	const [orgName, setOrgName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	const { data: session, status } = useSession();
	const { getUserData, isSignupCompleted, getAuthIntent, clearUserData } =
		useUserStorage();

	useEffect(() => {
		// Check if user came from signup flow
		const userId = searchParams.get("userId");
		const userData = getUserData();
		const authIntent = getAuthIntent();

		if (
			!userId &&
			!userData &&
			!isSignupCompleted() &&
			authIntent !== "signup"
		) {
			// User didn't come from signup, redirect to login
			toast.error("Please sign up first");
			router.push("/signup");
			return;
		}

		// If user came from social auth, we might need to wait for session
		if (authIntent === "signup" && status === "loading") {
			return; // Wait for session to load
		}

		if (authIntent === "signup" && session?.user) {
			// User completed social signup, clear auth intent
			sessionStorage.removeItem("auth_intent");
			sessionStorage.removeItem("auth_provider");
		}
	}, [
		searchParams,
		router,
		getUserData,
		isSignupCompleted,
		getAuthIntent,
		session,
		status,
	]);

	const handleCreateOrganization = async () => {
		if (!orgName.trim()) {
			toast.error("Please enter an organization name");
			return;
		}

		setIsLoading(true);
		try {
			// Here you would call your API to create the organization
			await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

			toast.success("Organization created successfully!", {
				description: "Welcome to TaskForge! You're all set up.",
			});

			// Clear temporary storage
			clearUserData();

			// Redirect to dashboard
			router.push("/dashboard");
		} catch (error) {
			console.error("Organization creation error:", error);
			toast.error("Failed to create organization", {
				description: "Please try again or contact support.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">
						Create Your Organization
					</CardTitle>
					<CardDescription>
						Set up your workspace to start managing tasks with your team
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="orgName">Organization Name</Label>
						<Input
							id="orgName"
							type="text"
							placeholder="Acme Inc."
							value={orgName}
							onChange={(e) => setOrgName(e.target.value)}
							className="h-12"
						/>
					</div>

					<Button
						onClick={handleCreateOrganization}
						disabled={isLoading || !orgName.trim()}
						className="w-full h-12"
					>
						{isLoading ? (
							<>
								<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
								Creating...
							</>
						) : (
							"Create Organization"
						)}
					</Button>

					<div className="text-center text-sm text-muted-foreground">
						You can change this later in your settings
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
