"use client";

import { ModeToggle } from "@src/components/theme-toggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@src/components/ui/breadcrumb";
import { Button } from "@src/components/ui/button";
import { Separator } from "@src/components/ui/separator";
import { SidebarTrigger } from "@src/components/ui/sidebar";
import { TypographyP } from "@src/components/ui/typography";
import { Badge, BellIcon, HelpCircle, Sparkles } from "lucide-react";
import React from "react";

type AppNavbarProps = {
	section: string;
	pathProps?: NavbarPathProps[];
};

type NavbarPathProps = {
	pathname: string;
	pathurl: string;
};

// const PATH_ITEMS_TO_DISPLAY = 3;

export const AppNavbar = ({ pathProps }: AppNavbarProps) => {
	return (
		<header className="flex h-[var(--header-height) - 10px] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
			<div className={"flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"}>
				<SidebarTrigger className={"-ml-1"} />
				<Separator
					orientation={"vertical"}
					className={"mx-2 data-[orientation=vertical]:h4"}
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{pathProps?.map((path, index) => (
							<React.Fragment key={index}>
								<BreadcrumbItem key={index}>
									<BreadcrumbLink href={path.pathurl}>
										<TypographyP>{path.pathname}</TypographyP>
									</BreadcrumbLink>
								</BreadcrumbItem>
								{index < pathProps.length - 1 && <BreadcrumbSeparator />}
							</React.Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
				<div className={"ml-auto flex items-center gap-2"}>
					<Button
						variant="ghost"
						size="icon"
						className="hidden sm:flex dark:text-foreground"
					>
						<HelpCircle />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="hidden sm:flex dark:text-foreground"
					>
						<Sparkles />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="hidden sm:flex dark:text-foreground"
					>
						<Badge>
							<BellIcon />
						</Badge>
					</Button>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
};
