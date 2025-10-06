"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { SignupForm } from "./signup-form";
import { ModeToggle } from "@src/components/theme-toggle";
import Link from "next/link";
import { TypographyH3 } from "@src/components/ui/typography";
import { useEffect, useRef, useState } from "react";
import { UserResponse } from "@src/lib/response-types";
import { toast } from "sonner";

export default function SignupPage() {
	const [signupResponse, setSignupResponse] = useState<UserResponse>();
	const hasShownToast = useRef(false);

	useEffect(() => {
		if (hasShownToast.current) return;
		const timer = setTimeout(() => {
			toast.info("🚧 Development Notice", {
				description:
					"Google & GitHub signup may have issues. Please use the email signup method for the best experience. We're working on OAuth stability!",
				position: "top-center",
				duration: 20_000,
				closeButton: true,
				dismissible: true,
				className: "group",
				classNames: {
					toast:
						"group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-blue-50 group-[.toaster]:to-indigo-50 dark:group-[.toaster]:from-blue-950 dark:group-[.toaster]:to-indigo-950 group-[.toaster]:border-2 group-[.toaster]:border-blue-200 dark:group-[.toaster]:border-blue-800 group-[.toaster]:shadow-xl group-[.toaster]:backdrop-blur-sm",
					title:
						"group-[.toast]:text-blue-900 dark:group-[.toast]:text-blue-100 group-[.toast]:font-bold group-[.toast]:text-base",
					description:
						"group-[.toast]:text-blue-800 dark:group-[.toast]:text-blue-200 group-[.toast]:text-sm group-[.toast]:leading-relaxed",
					actionButton:
						"group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:hover:bg-blue-700",
					closeButton:
						"group-[.toast]:bg-blue-100 dark:group-[.toast]:bg-blue-900 group-[.toast]:hover:bg-blue-200 dark:group-[.toast]:hover:bg-blue-800 group-[.toast]:border-blue-300 dark:group-[.toast]:border-blue-700",
					icon: "group-[.toast]:text-blue-600 dark:group-[.toast]:text-blue-400",
				},
				style: {
					minWidth: "380px",
					maxWidth: "500px",
					padding: "16px",
				},
				action: {
					label: "Got it! 👍",
					onClick: () => {
						toast.success("Thanks for understanding!", {
							duration: 2000,
						});
					},
				},
			});
			hasShownToast.current = true;
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-2">
			<nav className="w-full flex items-center justify-end">
				<ModeToggle />
			</nav>
			<div className="flex w-full max-w-sm flex-col gap-6 mt-2">
				<Link
					href="/"
					className="flex items-center gap-2 self-center font-medium"
				>
					<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
						<GalleryVerticalEnd className="size-4" />
					</div>
					<TypographyH3>TaskForge Inc.</TypographyH3>
				</Link>
				<SignupForm
					url="/admin/create-new"
					route={`/onboarding/organization?userId=${signupResponse?.publicId}`}
					setResponse={setSignupResponse}
				/>
			</div>
		</div>
	);
}
