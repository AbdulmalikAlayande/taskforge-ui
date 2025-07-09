"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoginRequest } from "@/lib/request-types";
import { loginAndUpdateSession } from "@/lib/session-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { data: session, update } = useSession();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true);

		try {
			// Convert form data to LoginRequest format
			const loginRequest: LoginRequest = {
				email: data.email,
				password: data.password,
			};

			// Call the helper function to login and update session
			const response = await loginAndUpdateSession(loginRequest, update);

			toast.success("Login successful!");

			// Redirect to dashboard
			router.push(`/dashboard/${response.user.defaultTenant || "personal"}`);
		} catch (error) {
			console.error("Login error:", error);
			toast.error("Login failed", {
				description: "Invalid email or password. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					placeholder="your@email.com"
					{...register("email")}
				/>
				{errors.email && (
					<p className="text-sm text-destructive">{errors.email.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					placeholder="••••••••"
					{...register("password")}
				/>
				{errors.password && (
					<p className="text-sm text-destructive">{errors.password.message}</p>
				)}
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? "Logging in..." : "Log in"}
			</Button>
		</form>
	);
}
