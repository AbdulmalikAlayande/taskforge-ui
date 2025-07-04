"use client";

import { useState } from "react";
import { Menu, GalleryVerticalEnd } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@src/components/ui/sheet";
import { cn } from "@src/lib/utils";
import { ModeToggle } from "@src/components/theme-toggle";
import Link from "next/link";

const navigation = [
	{ name: "Home", href: "#", current: true },
	{ name: "Dashboard", href: "#", current: false },
	{ name: "Team", href: "#", current: false },
	{ name: "Projects", href: "#", current: false },
	{ name: "Calendar", href: "#", current: false },
];

export default function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between px-4">
				{/* Mobile menu button and logo */}
				<div className="flex items-center gap-4">
					<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
						<SheetTrigger asChild className="sm:hidden">
							<Button
								variant="ghost"
								size="icon"
								className="rounded-[var(--radius)] hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<Menu className="size-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-[280px] sm:w-[300px]">
							<div className="flex flex-col gap-1 pt-6">
								{navigation.map((item) => (
									<Button
										key={item.name}
										variant="ghost"
										asChild
										className={cn(
											"w-full justify-start rounded-[var(--radius)] px-4 py-2",
											item.current
												? "bg-accent text-accent-foreground"
												: "hover:bg-accent hover:text-accent-foreground"
										)}
										onClick={() => setMobileMenuOpen(false)}
									>
										<a href={item.href}>{item.name}</a>
									</Button>
								))}
							</div>
						</SheetContent>
					</Sheet>

					<div className="flex items-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<GalleryVerticalEnd className="size-5" />
						</div>
						<h1 className="text-lg font-semibold text-foreground">TaskForge</h1>
					</div>
				</div>

				{/* Desktop navigation */}
				<div className="hidden items-center gap-6 md:flex">
					{navigation.map((item) => (
						<a
							key={item.name}
							href={item.href}
							className={cn(
								"text-sm font-medium transition-colors hover:text-primary",
								item.current ? "text-primary" : "text-foreground/80"
							)}
						>
							{item.name}
						</a>
					))}
				</div>

				{/* Right side controls */}
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						className="rounded-[var(--radius)] px-4 text-sm font-medium hover:bg-accent"
					>
						<Link href={"/login"} className="w-full h-full text-primary">
							Sign In
						</Link>
					</Button>
					<ModeToggle />
				</div>
			</div>
		</nav>
	);
}
