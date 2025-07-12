"use client";

import { ModeToggle } from "@src/components/theme-toggle";
import { Button } from "@src/components/ui/button";
import { Separator } from "@src/components/ui/separator";
import { SidebarTrigger } from "@src/components/ui/sidebar";
import { TypographyH1 } from "@src/components/ui/typography";
import { HelpCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

type AppNavbarProps = {
	section: string;
};

export const AppNavbar = ({ section }: AppNavbarProps) => {
	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className={"flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"}>
				<SidebarTrigger className={"-ml-1"} />
				<Separator
					orientation={"vertical"}
					className={"mx-2 data-[orientation=vertical]:h4"}
				/>
				<TypographyH1>{section}</TypographyH1>
				<div className={"ml-auto flex items-center gap-2"}>
					<Button variant="ghost" asChild size="sm" className="hidden sm:flex">
						<Link
							href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
							rel="noopener noreferrer"
							target="_blank"
							className="dark:text-foreground"
						>
							<HelpCircle />
						</Link>
					</Button>

					<Button variant="ghost" asChild size="sm" className="hidden sm:flex">
						<Link
							href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
							rel="noopener noreferrer"
							target="_blank"
							className="dark:text-foreground"
						>
							<Sparkles />
						</Link>
					</Button>

					<Button variant="ghost" asChild size="sm" className="hidden sm:flex">
						<ModeToggle />
					</Button>
				</div>
			</div>
		</header>
	);
};
