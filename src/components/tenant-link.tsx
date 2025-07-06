"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTenant } from "./tenant-provider";
import { cn } from "@src/lib/utils";

interface TenantLinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
	activeClassName?: string;
}

/**
 * A Link component that automatically prefixes the tenant ID to the href
 */
export function TenantLink({
	href,
	children,
	className,
	activeClassName,
}: TenantLinkProps) {
	const { tenantId } = useTenant();
	const pathname = usePathname();

	if (!tenantId) {
		return null;
	}

	const tenantHref = href.startsWith("/")
		? `/${tenantId}${href}`
		: `/${tenantId}/${href}`;

	const isActive = pathname === tenantHref;

	return (
		<Link
			href={tenantHref}
			className={cn(className, isActive && activeClassName)}
		>
			{children}
		</Link>
	);
}

/**
 * Navigation items for the tenant dashboard
 */
export const tenantNavItems = [
	{
		label: "Projects",
		href: "/projects",
		icon: "📁",
	},
	{
		label: "Tasks",
		href: "/tasks",
		icon: "✓",
	},
	{
		label: "Inbox",
		href: "/inbox",
		icon: "📧",
	},
	{
		label: "Insights",
		href: "/insights",
		icon: "📊",
	},
] as const;
