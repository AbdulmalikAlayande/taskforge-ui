import React from "react";
import Link from "next/link";
import { Button } from "@src/components/ui/button";
import { Separator } from "@src/components/ui/separator";
import {
	TypographyH3,
	TypographyP,
	TypographySmall,
} from "@src/components/ui/typography";
import { Mail, MessageSquare } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa6";

export const Footer = () => {
	const footerSections = [
		{
			title: "Solutions",
			links: [
				{ name: "Task Management", href: "/solutions/tasks" },
				{ name: "Project Analytics", href: "/solutions/analytics" },
				{ name: "Team Automation", href: "/solutions/automation" },
				{ name: "Workflow Intelligence", href: "/solutions/insights" },
			],
		},
		{
			title: "Support",
			links: [
				{ name: "Submit ticket", href: "/support/tickets" },
				{ name: "Documentation", href: "/docs" },
				{ name: "API Reference", href: "/docs/api" },
				{ name: "Guides", href: "/guides" },
			],
		},
		{
			title: "Company",
			links: [
				{ name: "About", href: "/about" },
				{ name: "Blog", href: "/blog" },
				{ name: "Jobs", href: "/careers" },
				{ name: "Press", href: "/press" },
			],
		},
		{
			title: "Legal",
			links: [
				{ name: "Terms of service", href: "/legal/terms" },
				{ name: "Privacy policy", href: "/legal/privacy" },
				{ name: "License", href: "/legal/license" },
				{ name: "Security", href: "/legal/security" },
			],
		},
	];

	const socialLinks = [
		{
			icon: <FaGithub className="size-5" />,
			href: "https://github.com/taskforge",
			label: "GitHub",
		},
		{
			icon: <FaTwitter className="size-5" />,
			href: "https://twitter.com/taskforge",
			label: "Twitter",
		},
		{
			icon: <FaLinkedin className="size-5" />,
			href: "https://linkedin.com/company/taskforge",
			label: "LinkedIn",
		},
		{
			icon: <Mail className="size-5" />,
			href: "mailto:hello@taskforge.com",
			label: "Email",
		},
	];

	return (
		<footer className="w-full bg-background border-t border-border mt-20">
			<div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
					{/* Brand Section */}
					<div className="lg:col-span-2">
						<div className="flex items-center gap-2 mb-6">
							<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
								<MessageSquare className="size-5 text-primary-foreground" />
							</div>
							<TypographyH3 className="text-xl font-bold">
								TaskForge
							</TypographyH3>
						</div>
						<TypographyP className="text-muted-foreground mb-6 max-w-sm">
							Making the world a better place through constructing elegant
							hierarchies.
						</TypographyP>
						<div className="flex items-center gap-4">
							{socialLinks.map((social, index) => (
								<Button
									key={index}
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:text-foreground hover:bg-accent"
									asChild
								>
									<Link href={social.href} aria-label={social.label}>
										{social.icon}
									</Link>
								</Button>
							))}
						</div>
					</div>

					{/* Footer Links */}
					{footerSections.map((section, index) => (
						<div key={index} className="space-y-4">
							<TypographyH3 className="text-base font-semibold">
								{section.title}
							</TypographyH3>
							<ul className="space-y-3">
								{section.links.map((link, linkIndex) => (
									<li key={linkIndex}>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<Separator className="mb-8" />

				{/* Bottom Footer */}
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
					<TypographySmall className="text-muted-foreground text-center sm:text-left">
						© 2024 TaskForge, Inc. All rights reserved.
					</TypographySmall>

					<div className="flex items-center gap-6">
						<Link
							href="/legal/terms"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Terms
						</Link>
						<Link
							href="/legal/privacy"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Privacy
						</Link>
						<Link
							href="/legal/cookies"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Cookies
						</Link>
					</div>
				</div>

				{/* Newsletter Signup Section */}
				<div className="mt-12 p-8 bg-muted/30 rounded-lg border border-border/50">
					<div className="max-w-md mx-auto text-center">
						<TypographyH3 className="text-lg font-semibold mb-2">
							Stay Updated
						</TypographyH3>
						<TypographyP className="text-sm text-muted-foreground mb-6">
							Get the latest updates on new features and productivity tips.
						</TypographyP>
						<div className="flex gap-2">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
							/>
							<Button size="sm">Subscribe</Button>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
