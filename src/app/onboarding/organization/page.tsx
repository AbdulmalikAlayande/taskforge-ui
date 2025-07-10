"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	cn,
	defaultIdustries,
	formatGMTOffset,
	defaultCountries,
	defaultTimeZones,
} from "@src/lib/utils";
import { useFetch } from "@src/app/hooks/useFetch";
import {
	CountryAndTimezone,
	OrganizationResponse,
} from "@src/lib/response-types";
import Logger from "@src/lib/logger";
import { useApiClient } from "@src/app/hooks/useApiClient";

// Organization data schema
const organizationSchema = z.object({
	name: z
		.string()
		.min(1, "Organization name is required")
		.min(2, "Name must be at least 2 characters"),
	slug: z
		.string()
		.min(1, "Slug is required")
		.regex(
			/^[a-z0-9-]+$/,
			"Slug can only contain lowercase letters, numbers, and hyphens"
		),
	description: z.string().optional(),
	industry: z.string().min(1, "Industry is required"),
	country: z.string().min(1, "Country is required"),
	email: z.string().email("Please enter a valid email address"),
	phone: z.string().optional(),
	timeZone: z.string().min(1, "Time zone is required"),
	websiteUrl: z
		.string()
		.url("Please enter a valid URL")
		.optional()
		.or(z.literal("")),
	logoUrl: z
		.string()
		.url("Please enter a valid URL")
		.optional()
		.or(z.literal("")),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

const steps = [
	{
		id: 1,
		title: "Organization Name",
		description: "What should we call your organization?",
		fields: ["name"] as const,
	},
	{
		id: 2,
		title: "Basic Details",
		description: "Tell us more about your organization",
		fields: ["slug", "description"] as const,
	},
	{
		id: 3,
		title: "Industry & Location",
		description: "Help us understand your business",
		fields: ["industry", "country"] as const,
	},
	{
		id: 4,
		title: "Contact Information",
		description: "How can we reach you?",
		fields: ["email", "phone"] as const,
	},
	{
		id: 5,
		title: "Preferences",
		description: "Set up your workspace preferences",
		fields: ["timeZone", "websiteUrl", "logoUrl"] as const,
	},
];

export default function OrganizationOnboardingPage() {
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const countries: string[] = [];
	const timeZones: string[] = [];
	const industries: string[] = defaultIdustries;
	const searchParams = useSearchParams();
	const router = useRouter();
	const apiClient = useApiClient();
	const { data: session, status } = useSession();
	const { getUserData, isSignupCompleted, getAuthIntent, clearUserData } =
		useUserStorage();

	const { data, error } = useFetch<CountryAndTimezone>({
		url: `http://api.timezonedb.com/v2.1/list-time-zone?key=${process.env.TIMEZONE_DB_API_KEY || "AFIYJ4MWEMD1"}&format=json`,
	});

	if (data) {
		data.zones.forEach((zone) => {
			countries.push(zone.countryName);
			timeZones.push(formatGMTOffset(zone.gmtOffset, zone.zoneName));
		});
	} else if (!data || error) {
		defaultCountries.forEach((country) => {
			countries.push(country);
		});
		defaultTimeZones.forEach((timezone) => {
			timeZones.push(timezone);
		});
	}

	const {
		register,
		formState: { errors },
		watch,
		setValue,
		trigger,
		getValues,
	} = useForm<OrganizationFormData>({
		resolver: zodResolver(organizationSchema),
		defaultValues: {
			name: "",
			slug: "",
			description: "",
			industry: "",
			country: "",
			email: "",
			phone: "",
			timeZone: "",
			websiteUrl: "",
			logoUrl: "",
		},
		mode: "onChange",
	});

	// Auto-generate slug from name
	const watchedName = watch("name");
	useEffect(() => {
		if (watchedName && currentStep === 2) {
			const slug = watchedName
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, "")
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-")
				.trim();
			setValue("slug", slug);
		}
	}, [watchedName, setValue, currentStep]);

	useEffect(() => {
		// Check if user came from signup flow
		const userData = getUserData();
		const authIntent = getAuthIntent();

		if (!userData && !isSignupCompleted() && authIntent !== "signup") {
			toast.error("Please sign up first");
			router.push("/signup");
			return;
		}

		if (authIntent === "signup" && status === "loading") {
			return;
		}

		if (authIntent === "signup" && session?.user) {
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

	const currentStepData = steps.find((step) => step.id === currentStep);
	const isLastStep = currentStep === steps.length;
	const isFirstStep = currentStep === 1;

	const validateCurrentStep = async () => {
		const fieldsToValidate = currentStepData?.fields || [];
		return await trigger(fieldsToValidate);
	};

	const handleNext = async () => {
		const isValid = await validateCurrentStep();
		if (!isValid) return;

		if (isLastStep) {
			await handleSubmitForm();
			return;
		}

		setIsAnimating(true);
		setTimeout(() => {
			setCurrentStep((prev) => prev + 1);
			setIsAnimating(false);
		}, 150);
	};

	const handlePrevious = () => {
		if (isFirstStep) return;

		setIsAnimating(true);
		setTimeout(() => {
			setCurrentStep((prev) => prev - 1);
			setIsAnimating(false);
		}, 150);
	};

	const handleSubmitForm = async () => {
		setIsLoading(true);
		try {
			const formData = getValues();

			Logger.info("Creating organization with data:", formData);
			const response = await apiClient.post<
				OrganizationResponse,
				OrganizationFormData
			>(
				`${process.env.NEXT_PUBLIC_API_URL!}/organization/create-new`,
				formData
			);

			toast.success("Organization created successfully!", {
				description: "Welcome to TaskForge! You're all set up.",
			});

			clearUserData();

			Logger.info("Response:: ", response);

			const tenantId = response.publicId;
			router.push(`/${tenantId}/projects`);
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
			<Card className="w-full max-w-lg">
				<CardHeader className="text-center">
					<div className="mb-4">
						<div className="flex justify-center space-x-2">
							{steps.map((step) => (
								<div
									key={step.id}
									className={cn(
										"w-2 h-2 rounded-full transition-all duration-300",
										step.id === currentStep
											? "bg-primary w-8"
											: step.id < currentStep
												? "bg-primary"
												: "bg-muted"
									)}
								/>
							))}
						</div>
						<p className="text-sm text-muted-foreground mt-3">
							Step {currentStep} of {steps.length}
						</p>
					</div>
					<CardTitle className="text-2xl font-bold">
						{currentStepData?.title}
					</CardTitle>
					<CardDescription>{currentStepData?.description}</CardDescription>
				</CardHeader>
				<CardContent>
					<div
						className={cn(
							"transition-all duration-150",
							isAnimating
								? "opacity-0 transform translate-x-4"
								: "opacity-100 transform translate-x-0"
						)}
					>
						{renderStepContent()}
					</div>

					<div className="flex justify-between mt-8">
						<Button
							type="button"
							variant="outline"
							onClick={handlePrevious}
							disabled={isFirstStep}
							className="flex items-center"
						>
							<ChevronLeft className="w-4 h-4 mr-1" />
							Previous
						</Button>

						<Button
							type="button"
							onClick={handleNext}
							disabled={isLoading}
							className="flex items-center"
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
									Creating...
								</>
							) : isLastStep ? (
								"Create Organization"
							) : (
								<>
									Next
									<ChevronRight className="w-4 h-4 ml-1" />
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);

	function renderStepContent() {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-4">
						<div>
							<Label htmlFor="name">Organization Name *</Label>
							<Input
								id="name"
								{...register("name")}
								placeholder="Acme Inc."
								className="h-12 mt-2"
							/>
							{errors.name && (
								<p className="text-sm text-destructive mt-1">
									{errors.name.message}
								</p>
							)}
						</div>
					</div>
				);

			case 2:
				return (
					<div className="space-y-4">
						<div>
							<Label htmlFor="slug">Organization Slug *</Label>
							<Input
								id="slug"
								{...register("slug")}
								placeholder="acme-inc"
								className="h-12 mt-2"
							/>
							<p className="text-xs text-muted-foreground mt-1">
								This will be used in your organization URL
							</p>
							{errors.slug && (
								<p className="text-sm text-destructive mt-1">
									{errors.slug.message}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="description">Description</Label>
							<Input
								id="description"
								{...register("description")}
								placeholder="Brief description of your organization"
								className="h-12 mt-2"
							/>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="space-y-4">
						<div>
							<Label htmlFor="industry">Industry *</Label>
							<select
								id="industry"
								{...register("industry")}
								className="w-full h-12 mt-2 px-3 border border-input rounded-md bg-background"
							>
								<option value="">Select an industry</option>
								{industries.map((industry, index) => (
									<option key={`${industry}-${index}`} value={industry}>
										{industry}
									</option>
								))}
							</select>
							{errors.industry && (
								<p className="text-sm text-destructive mt-1">
									{errors.industry.message}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="country">Country *</Label>
							<select
								id="country"
								{...register("country")}
								className="w-full h-12 mt-2 px-3 border border-input rounded-md bg-background"
							>
								<option value="">Select a country</option>
								{countries.map((country, index) => (
									<option key={`${country}-${index}`} value={country}>
										{country}
									</option>
								))}
							</select>
							{errors.country && (
								<p className="text-sm text-destructive mt-1">
									{errors.country.message}
								</p>
							)}
						</div>
					</div>
				);

			case 4:
				return (
					<div className="space-y-4">
						<div>
							<Label htmlFor="email">Email Address *</Label>
							<Input
								id="email"
								type="email"
								{...register("email")}
								placeholder="hello@acme.com"
								className="h-12 mt-2"
							/>
							{errors.email && (
								<p className="text-sm text-destructive mt-1">
									{errors.email.message}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="phone">Phone Number</Label>
							<Input
								id="phone"
								type="tel"
								{...register("phone")}
								placeholder="+1 (555) 123-4567"
								className="h-12 mt-2"
							/>
						</div>
					</div>
				);

			case 5:
				return (
					<div className="space-y-4">
						<div>
							<Label htmlFor="timeZone">Time Zone *</Label>
							<select
								id="timeZone"
								{...register("timeZone")}
								className="w-full h-12 mt-2 px-3 border border-input rounded-md bg-background"
							>
								<option value="">Select your time zone</option>
								{timeZones.map((tz, index) => (
									<option key={`${tz}-${index}`} value={tz}>
										{tz}
									</option>
								))}
							</select>
							{errors.timeZone && (
								<p className="text-sm text-destructive mt-1">
									{errors.timeZone.message}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="websiteUrl">Website URL</Label>
							<Input
								id="websiteUrl"
								type="url"
								{...register("websiteUrl")}
								placeholder="https://acme.com"
								className="h-12 mt-2"
							/>
							{errors.websiteUrl && (
								<p className="text-sm text-destructive mt-1">
									{errors.websiteUrl.message}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="logoUrl">Logo URL</Label>
							<Input
								id="logoUrl"
								type="url"
								{...register("logoUrl")}
								placeholder="https://acme.com/logo.png"
								className="h-12 mt-2"
							/>
							{errors.logoUrl && (
								<p className="text-sm text-destructive mt-1">
									{errors.logoUrl.message}
								</p>
							)}
						</div>
					</div>
				);

			default:
				return null;
		}
	}
}
