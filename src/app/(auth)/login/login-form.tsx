"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@src/components/ui/label";
import { Button } from "@src/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@src/components/ui/card";
import { FaGoogle, FaMeta, FaApple, FaGithub } from "react-icons/fa6";
import { cn, login } from "@src/lib/utils";
import { Input } from "@src/components/ui/input";
import Link from "next/link";
import Logger from "@src/lib/logger";
import { toast } from "sonner";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must be at least 8 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { update } = useSession();
	const [isLoading, setIsLoading] = useState(false);
	const [socialLoading, setSocialLoading] = useState<string | null>(null);
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true);
		let loadingToast: string | number | null = null;
		try {
			loadingToast = toast.loading("Creating your account...");

			(async () => {
				try {
					await new Promise((resolve) => setTimeout(resolve, 500));
					const response = await login(data, update);
					Logger.success("Login was successful", response);
				} catch (loginError) {
					Logger.error("Login after signup failed:", {
						error:
							loginError instanceof Error
								? loginError.message
								: String(loginError),
						stack: loginError instanceof Error ? loginError.stack : undefined,
					});
				}
			})().catch((err) => {
				console.error("CRITICAL: Unexpected error in login process:", err);
			});

			if (loadingToast) {
				toast.dismiss(loadingToast);
				loadingToast = null;
			}

			setTimeout(() => {
				toast.dismiss();
				router.push(`/auth/success`);
			}, 1500);
		} catch (error) {
			Logger.error(`Login error:: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSocialLogin = async (provider: string) => {
		setSocialLoading(provider);
		try {
			Logger.info(`Initiating ${provider} login`);

			// Store intent in sessionStorage for post-auth handling
			sessionStorage.setItem("auth_intent", "login");
			sessionStorage.setItem("auth_provider", provider);

			// Use NextAuth's client-side signIn
			const result = await signIn(provider, {
				callbackUrl: "/auth/success",
				redirect: false,
			});

			if (result?.error) {
				Logger.error(`${provider} login error:`, { error: result.error });
				toast.error(`${provider} login failed`, {
					description:
						result.error === "AccessDenied"
							? "Access was denied. Please try again."
							: "An unexpected error occurred. Please try again.",
				});
			} else if (result?.url) {
				// Redirect manually since we used redirect: false
				window.location.href = result.url;
			}
		} catch (error) {
			Logger.error(`${provider} login error:`, { error });
			toast.error(`${provider} login failed`, {
				description: "An unexpected error occurred. Please try again.",
			});
		} finally {
			setSocialLoading(null);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="border border-border/50 shadow-lg backdrop-blur-sm bg-card/95">
				<CardHeader className="text-center pb-8">
					<CardTitle className="text-2xl font-bold text-foreground font-heading">
						Welcome back
					</CardTitle>
					<CardDescription className="text-base text-muted-foreground">
						Login with your preferred account
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Social Login Buttons */}
						<div className="flex flex-col gap-3">
							<Button
								type="button"
								variant="outline"
								className="w-full border border-border hover:border-border/80 hover:bg-accent/50 text-foreground font-medium h-12 transition-all duration-200"
								onClick={() => handleSocialLogin("apple")}
								disabled={socialLoading === "apple"}
							>
								{socialLoading === "apple" ? (
									<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
								) : (
									<FaApple className="w-5 h-5" />
								)}
								Login with Apple
							</Button>
							<Button
								type="button"
								variant="outline"
								className="w-full border border-border hover:border-border/80 hover:bg-accent/50 text-foreground font-medium h-12 transition-all duration-200"
								onClick={() => handleSocialLogin("google")}
								disabled={socialLoading === "google"}
							>
								{socialLoading === "google" ? (
									<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
								) : (
									<FaGoogle className="w-5 h-5" />
								)}
								Login with Google
							</Button>
							<Button
								type="button"
								variant="outline"
								className="w-full border border-border hover:border-border/80 hover:bg-accent/50 text-foreground font-medium h-12 transition-all duration-200"
								onClick={() => handleSocialLogin("facebook")}
								disabled={socialLoading === "facebook"}
							>
								{socialLoading === "facebook" ? (
									<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
								) : (
									<FaMeta className="w-5 h-5" />
								)}
								Login with Meta
							</Button>
							<Button
								type="button"
								variant="outline"
								className="w-full border border-border hover:border-border/80 hover:bg-accent/50 text-foreground font-medium h-12 transition-all duration-200"
								onClick={() => handleSocialLogin("github")}
								disabled={socialLoading === "github"}
							>
								{socialLoading === "github" ? (
									<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
								) : (
									<FaGithub className="w-5 h-5" />
								)}
								Login with Github
							</Button>
						</div>

						{/* Divider */}
						<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
							<span className="bg-card text-muted-foreground relative z-10 px-4 font-medium">
								Or continue with
							</span>
						</div>

						{/* Email and Password Fields */}
						<div className="grid gap-6">
							<div className="grid gap-3">
								<Label htmlFor="email" className="text-foreground font-medium">
									Email
								</Label>
								<Input
									id="email"
									type="email"
									variant={"normal"}
									placeholder="m@example.com"
									{...register("email")}
									className={cn(
										"border border-input focus:border-ring focus:ring-ring/20 h-12 text-foreground placeholder:text-muted-foreground transition-all duration-200",
										errors.email &&
											"border-destructive focus:border-destructive focus:ring-destructive/20"
									)}
								/>
								{errors.email && (
									<p className="text-sm text-destructive">
										{errors.email.message}
									</p>
								)}
							</div>

							<div className="grid gap-3">
								<div className="flex items-center">
									<Label
										htmlFor="password"
										className="text-foreground font-medium"
									>
										Password
									</Label>
									<Link
										href="/forgot-password"
										className="ml-auto text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors duration-200"
									>
										Forgot your password?
									</Link>
								</div>
								<Input
									id="password"
									type="password"
									variant={"normal"}
									{...register("password")}
									className={cn(
										"border border-input focus:border-ring focus:ring-ring/20 h-12 text-foreground transition-all duration-200",
										errors.password &&
											"border-destructive focus:border-destructive focus:ring-destructive/20"
									)}
								/>
								{errors.password && (
									<p className="text-sm text-destructive">
										{errors.password.message}
									</p>
								)}
							</div>

							<Button
								type="submit"
								className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 shadow-lg hover:shadow-xl transition-all duration-200"
								disabled={isLoading || isSubmitting}
							>
								{isLoading || isSubmitting ? (
									<>
										<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
										Logging in...
									</>
								) : (
									"Login"
								)}
							</Button>
						</div>

						<div className="text-center text-sm text-muted-foreground">
							Don&apos;t have an account?{" "}
							<Link
								href="/signup"
								className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors duration-200"
							>
								Sign up
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
			<div className="text-muted-foreground text-center text-xs text-balance">
				By clicking continue, you agree to our{" "}
				<Link
					href="/terms"
					className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors duration-200"
				>
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link
					href="/privacy"
					className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors duration-200"
				>
					Privacy Policy
				</Link>
				.
			</div>
		</div>
	);
}
