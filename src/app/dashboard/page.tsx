"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@src/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@src/components/ui/card";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status, router]);

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<Button
						variant="outline"
						onClick={() => signOut({ callbackUrl: "/" })}
					>
						Sign Out
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Welcome!</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground mb-4">
								Hello, {session.user?.name || session.user?.email}!
							</p>
							<p className="text-sm text-muted-foreground">
								You have successfully signed up and set up your organization.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Next Steps</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-sm">
								<li>✓ Account created</li>
								<li>✓ Organization set up</li>
								<li>• Create your first project</li>
								<li>• Invite team members</li>
								<li>• Start managing tasks</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
