"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
import {
	FaGoogle,
	FaMeta,
	FaApple,
	FaGithub,
	FaEye,
	FaEyeSlash,
} from "react-icons/fa6";
import { cn } from "@src/lib/utils";
import { Input } from "@src/components/ui/input";
import { Checkbox } from "@src/components/ui/checkbox";
import Link from "next/link";
import Logger from "@src/lib/logger";

// Zod schema for form validation
const signupSchema = z
	.object({
		firstName: z
			.string()
			.min(1, "First name is required")
			.min(2, "First name must be at least 2 characters")
			.max(50, "First name must be less than 50 characters"),
		lastName: z
			.string()
			.min(1, "Last name is required")
			.min(2, "Last name must be at least 2 characters")
			.max(50, "Last name must be less than 50 characters"),
		email: z
			.string()
			.min(1, "Email is required")
			.email("Please enter a valid email address"),
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must be at least 8 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number"
			),
		confirmPassword: z.string().min(1, "Please confirm your password"),
		acceptTerms: z
			.boolean()
			.refine(
				(val) => val === true,
				"You must accept the terms and conditions"
			),
		marketingEmails: z.boolean(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isLoading, setIsLoading] = useState(false);
	const [socialLoading, setSocialLoading] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
		setValue,
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			acceptTerms: false,
			marketingEmails: false,
		},
		mode: "onChange",
	});

	const acceptTerms = watch("acceptTerms");
	const marketingEmails = watch("marketingEmails");

	const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			console.log("Signup data:", data);
			// Handle successful signup here
		} catch (error) {
			console.error("Signup error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSocialSignup = async (provider: string) => {
		setSocialLoading(provider);
		try {
			Logger.info(`Signing up with ${provider}`);
			await new Promise((resolve) => setTimeout(resolve, 1500));
			// Handle social signup here
		} catch (error) {
			console.error(`${provider} signup error:`, error);
		} finally {
			setSocialLoading(null);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="border border-border/50 shadow-lg backdrop-blur-sm bg-card/95">
				<CardHeader className="text-center pb-8">
					<CardTitle className="text-2xl font-bold text-foreground font-heading">
						Create your account
					</CardTitle>
					<CardDescription className="text-base text-muted-foreground">
						Sign up to get started with TaskForge
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Social Signup Buttons */}
						<div className="flex flex-col gap-3">
							<Button
								type="button"
								variant="outline"
								className="w-full border border-border hover:border-border/80 hover:bg-accent/50 text-foreground font-medium h-12 transition-all duration-200"
								onClick={() => handleSocialSignup("google")}
								disabled={socialLoading === "google"}
							>
								{socialLoading === "google" ? (
									<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
								) : (
									<FaGoogle className="w-5 h-5" />
								)}
								Continue with Google
							</Button>
							<Button
								type="button"
								variant="outline"
								className="w-full border border-border hover:border-border/80 hover:bg-accent/50 text-foreground font-medium h-12 transition-all duration-200"
								onClick={() => handleSocialSignup("google")}
								disabled={socialLoading === "google"}
							>
								{socialLoading === "google" ? (
									<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
								) : (
									<FaMeta className="w-5 h-5" />
								)}
								Continue with Meta
							</Button>
							<Button
								type="button"
								variant="outline"
								className="w-full border border-border hover:border-border/80 hover:bg-accent/50 text-foreground font-medium h-12 transition-all duration-200"
								onClick={() => handleSocialSignup("google")}
								disabled={socialLoading === "google"}
							>
								{socialLoading === "google" ? (
									<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
								) : (
									<FaApple className="w-5 h-5" />
								)}
								Continue with Apple
							</Button>
							<Button
								type="button"
								variant="outline"
								className="w-full border border-border hover:border-border/80 hover:bg-accent/50 text-foreground font-medium h-12 transition-all duration-200"
								onClick={() => handleSocialSignup("github")}
								disabled={socialLoading === "github"}
							>
								{socialLoading === "github" ? (
									<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
								) : (
									<FaGithub className="w-5 h-5" />
								)}
								Continue with Github
							</Button>
						</div>

						{/* Divider */}
						<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
							<span className="bg-card text-muted-foreground relative z-10 px-4 font-medium">
								Or continue with email
							</span>
						</div>

						{/* Name Fields */}
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-3">
								<Label
									htmlFor="firstName"
									className="text-foreground font-medium"
								>
									First Name
								</Label>
								<Input
									id="firstName"
									type="text"
									placeholder="John"
									{...register("firstName")}
									className={cn(
										"border border-input focus:border-ring focus:ring-ring/20 h-12 text-foreground placeholder:text-muted-foreground transition-all duration-200",
										errors.firstName &&
											"border-destructive focus:border-destructive focus:ring-destructive/20"
									)}
								/>
								{errors.firstName && (
									<p className="text-sm text-destructive">
										{errors.firstName.message}
									</p>
								)}
							</div>

							<div className="grid gap-3">
								<Label
									htmlFor="lastName"
									className="text-foreground font-medium"
								>
									Last Name
								</Label>
								<Input
									id="lastName"
									type="text"
									placeholder="Doe"
									{...register("lastName")}
									className={cn(
										"border border-input focus:border-ring focus:ring-ring/20 h-12 text-foreground placeholder:text-muted-foreground transition-all duration-200",
										errors.lastName &&
											"border-destructive focus:border-destructive focus:ring-destructive/20"
									)}
								/>
								{errors.lastName && (
									<p className="text-sm text-destructive">
										{errors.lastName.message}
									</p>
								)}
							</div>
						</div>

						{/* Email Field */}
						<div className="grid gap-3">
							<Label htmlFor="email" className="text-foreground font-medium">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="john@example.com"
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

						{/* Password Fields */}
						<div className="grid gap-3">
							<Label htmlFor="password" className="text-foreground font-medium">
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									{...register("password")}
									className={cn(
										"border border-input focus:border-ring focus:ring-ring/20 h-12 text-foreground placeholder:text-muted-foreground transition-all duration-200 pr-12",
										errors.password &&
											"border-destructive focus:border-destructive focus:ring-destructive/20"
									)}
								/>
								<button
									type="button"
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<FaEyeSlash className="w-4 h-4" />
									) : (
										<FaEye className="w-4 h-4" />
									)}
								</button>
							</div>
							{errors.password && (
								<p className="text-sm text-destructive">
									{errors.password.message}
								</p>
							)}
						</div>

						<div className="grid gap-3">
							<Label
								htmlFor="confirmPassword"
								className="text-foreground font-medium"
							>
								Confirm Password
							</Label>
							<div className="relative">
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Confirm your password"
									{...register("confirmPassword")}
									className={cn(
										"border border-input focus:border-ring focus:ring-ring/20 h-12 text-foreground placeholder:text-muted-foreground transition-all duration-200 pr-12",
										errors.confirmPassword &&
											"border-destructive focus:border-destructive focus:ring-destructive/20"
									)}
								/>
								<button
									type="button"
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? (
										<FaEyeSlash className="w-4 h-4" />
									) : (
										<FaEye className="w-4 h-4" />
									)}
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="text-sm text-destructive">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>

						{/* Checkboxes */}
						<div className="space-y-4">
							<div className="flex items-start space-x-3">
								<Checkbox
									id="acceptTerms"
									checked={acceptTerms}
									onCheckedChange={(checked) =>
										setValue("acceptTerms", checked === true)
									}
									className="mt-1"
								/>
								<div className="grid gap-1.5 leading-none">
									<label
										htmlFor="acceptTerms"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
									>
										I accept the{" "}
										<Link
											href="/terms"
											className="text-primary hover:text-primary/80 underline underline-offset-4"
										>
											Terms and Conditions
										</Link>{" "}
										and{" "}
										<Link
											href="/privacy"
											className="text-primary hover:text-primary/80 underline underline-offset-4"
										>
											Privacy Policy
										</Link>
									</label>
								</div>
							</div>
							{errors.acceptTerms && (
								<p className="text-sm text-destructive ml-6">
									{errors.acceptTerms.message}
								</p>
							)}

							<div className="flex items-start space-x-3">
								<Checkbox
									id="marketingEmails"
									checked={marketingEmails}
									onCheckedChange={(checked) =>
										setValue("marketingEmails", checked === true)
									}
									className="mt-1"
								/>
								<div className="grid gap-1.5 leading-none">
									<label
										htmlFor="marketingEmails"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
									>
										I want to receive marketing emails about TaskForge updates
										and features
									</label>
								</div>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 shadow-lg hover:shadow-xl transition-all duration-200"
							disabled={isLoading || isSubmitting}
						>
							{isLoading || isSubmitting ? (
								<>
									<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
									Creating account...
								</>
							) : (
								"Create account"
							)}
						</Button>

						<div className="text-center text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link
								href="/login"
								className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors duration-200"
							>
								Sign in
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
