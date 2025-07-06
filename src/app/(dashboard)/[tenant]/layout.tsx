"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { TenantProvider } from "@src/components/tenant-provider";

interface TenantLayoutProps {
	children: React.ReactNode;
	params: {
		tenant: string;
	};
}

export default function TenantLayout({ children, params }: TenantLayoutProps) {
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		const validateTenantAccess = async () => {
			if (status === "loading") return;

			if (!session) {
				router.push("/auth/login");
				return;
			}
			router.push("/onboarding/organization");
		};

		validateTenantAccess();
	}, [session, status, params.tenant, router]);

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading organization...</p>
				</div>
			</div>
		);
	}

	// Provide tenant context to all child components
	return (
		<TenantProvider>
			<div data-tenant={params.tenant}>{children}</div>
		</TenantProvider>
	);
}
