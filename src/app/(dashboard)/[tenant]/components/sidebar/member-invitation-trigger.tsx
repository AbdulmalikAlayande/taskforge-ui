"use client";
import React from "react";

import { Button } from "@src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import { SidebarInput } from "@src/components/ui/sidebar";
import { MailIcon } from "lucide-react";

export const MemberInvitationTrigger = () => {
	return (
		<Card className="gap-2 py-4 shadow-none">
			<CardHeader>
				<CardTitle>Invite team mates</CardTitle>
				<CardDescription>invite one or more team mates</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className={"flex flex-col gap-2.5"}>
						<SidebarInput type="email" placeholder="Email" />
						<Button
							className="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
							size="sm"
						>
							<MailIcon />
							Invite
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};
