"use client";

import React, { useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { ModeToggle } from "@src/components/theme-toggle";
import Link from "next/link";
import { TypographyH3 } from "@src/components/ui/typography";
import { SignupForm } from "@src/app/(auth)/signup/signup-form";
import { UserResponse } from "@src/lib/response-types";

const CreateAccountPage = () => {
	const [signupResponse, setSignupResponse] = useState<UserResponse>();

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
					url="/members/create-new"
					route={"/auth/success"}
					setResponse={setSignupResponse}
				/>
			</div>
		</div>
	);
};
export default CreateAccountPage;
