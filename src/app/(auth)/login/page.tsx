import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "./login-form";
import { ModeToggle } from "@src/components/theme-toggle";

export default function LoginPage() {
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
