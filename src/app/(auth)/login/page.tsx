"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "./login-form";
import { ModeToggle } from "@src/components/theme-toggle";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function LoginPage() {
	const hasShownToast = useRef(false);

	useEffect(() => {
		if (hasShownToast.current) return;
		const timer = setTimeout(() => {
			toast.info("Development Note", {
				description:
					"In case you encounter any error using Google or Github login, please use the normal login method. The app is still in development phase.",
				position: "top-right",
				duration: 15_000,
				closeButton: true,
			});
			hasShownToast.current = true;
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-2">
			<nav className="w-full flex items-center justify-end">
				<ModeToggle />
			</nav>
			<div className="flex w-full max-w-sm flex-col gap-6 mt-2">
				<a href="#" className="flex items-center gap-2 self-center font-medium">
					<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
						<GalleryVerticalEnd className="size-4" />
					</div>
					TaskForge Inc.
				</a>
				<LoginForm />
			</div>
		</div>
	);
}
