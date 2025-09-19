"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@src/components/ui/card";
import { jwtDecode } from "jwt-decode";
import {
	formatDistanceToNow,
	format,
	isToday,
	isYesterday,
	isThisWeek,
} from "date-fns";
import Image from "next/image";
import { Button } from "@src/components/ui/button";
import { Avatar, AvatarFallback } from "@src/components/ui/avatar";
import { useApiClient } from "@src/app/hooks/useApiClient";
import { Spinner } from "@src/components/ui/spinner";
import { toast } from "sonner";
import { hasContent } from "@src/lib/utils";

type PayLoadProperties = {
	name: string;
	subject: string;
	email: string;
	id: string;
	role: string;
	date: string;
	inviterName: string;
	organizationId: string;
	organizationName: string;
	organizationLogoUrl: string;
};

type InvitationResponse = {
	publicId: string;
	message: string;
	memberID: string;
	roles: string;
	email: string;
	invitationLink: string;
	organizationId: string;
	organizationName: string;
	status: string;
	createdAt: string;
	expiresAt: string;
	lastModifiedAt: string;
};

const InvitationView = () => {
	const { token } = useParams<{ tenant: string; token: string }>();
	const [invitationProperties, setInvitationProperties] =
		React.useState<PayLoadProperties>();
	const { apiClient } = useApiClient();
	const [isLoading, setIsLoading] = React.useState(false);
	const router = useRouter();

	useEffect(() => {
		if (token) {
			try {
				const decodedJwtToken = jwtDecode(decodeBase64String(token));
				if (!decodedJwtToken) return;
				const payload = decodedJwtToken as PayLoadProperties;
				setInvitationProperties(payload);
				sessionStorage.setItem("current_tenant_id", payload.organizationId);
				localStorage.setItem("current_tenant_id", payload.organizationId);
				console.log("Decoded Payload:", payload);
			} catch (error) {
				console.error("Failed to decode token:", error);
				return;
			}
		}
	}, [token]);

	function decodeBase64String(base64String: string) {
		return Buffer.from(base64String, "base64").toString("utf8");
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);

		if (isToday(date)) {
			return `Today, ${format(date, "MMMM d, yyyy")}`;
		}
		if (isYesterday(date)) {
			return `Yesterday, ${format(date, "MMMM d, yyyy")}`;
		}
		if (isThisWeek(date, { weekStartsOn: 1 })) {
			return `${formatDistanceToNow(date, { addSuffix: true })}`;
		}
		return format(date, "MMMM d, yyyy");
	};

	const acceptInvitation = async () => {
		setIsLoading(true);
		try {
			const invitationResponse = await apiClient.post<InvitationResponse>(
				`/members/accept-invitation?token=${token}`
			);

			if (
				invitationResponse &&
				invitationResponse.status?.toLowerCase() === "accepted"
			) {
				setIsLoading(false);
				if (hasContent(invitationResponse.memberID)) {
					toast.success("Invitation Accepted", {
						duration: 5000,
						position: "top-center",
						action: {
							label: "Close",
							onClick: () => toast.dismiss(),
						},
						description: `You have successfully accepted the invitation. 
							Please log in to continue.`,
					});
					router.push("/login");
				} else {
					toast.success("Invitation Accepted", {
						duration: 7000,
						position: "top-center",
						action: {
							label: "Close",
							onClick: () => toast.dismiss(),
						},
						description: `You have successfully accepted the invitation. 
							Seems like you don't have an account, please create one`,
					});
					router.push("/onboarding/member/new-account");
				}
			}
		} catch (error) {
			setIsLoading(false);
			toast.error("Unable to Accept Invitation", {
				duration: 10_000,
				position: "top-center",
				action: {
					label: "Close",
					onClick: () => toast.dismiss(),
				},
				style: {
					width: "400px",
					height: "auto",
					backgroundColor: "#FF0000",
					color: "#FFFFFF",
				},
				description:
					"We couldn't process your invitation. This could be because it expired, was revoked, or already accepted. Please contact the organization or try again.",
			});
			console.error("Error accepting invitation:", error);
		}
	};

	const teamMembers = [
		{
			name: "Sarah Johnson",
			avatar: "S",
			color: "bg-[oklch(var(--avatar-blue))]",
		},
		{
			name: "Mike Chen",
			avatar: "M",
			color: "bg-[oklch(var(--avatar-purple))]",
		},
		{
			name: "Emma Wilson",
			avatar: "E",
			color: "bg-[oklch(var(--avatar-orange))]",
		},
		{
			name: "Alex Rivera",
			avatar: "A",
			color: "bg-[oklch(var(--avatar-pink))]",
		},
	];

	if (isLoading) {
		return (
			<div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
				<div className="flex flex-col items-center gap-4 text-center">
					<Spinner variant="pinwheel" className="text-primary" size={64} />
					<p className="text-lg text-foreground">
						Processing your invitation...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
			<Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-card">
				<CardHeader className="pb-6">
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">
							{invitationProperties?.date &&
								formatDate(invitationProperties.date)}
						</p>
						<h1 className="text-2xl font-semibold text-foreground">
							Pending invite
						</h1>
					</div>
				</CardHeader>

				<CardContent className="space-y-8">
					<div className="flex flex-col items-center text-center space-y-6">
						{invitationProperties?.organizationLogoUrl ? (
							<Image
								src={
									invitationProperties.organizationLogoUrl || "/placeholder.svg"
								}
								alt="Organization Logo"
								width={80}
								height={80}
								className="rounded-full"
							/>
						) : (
							<Avatar className="w-20 h-20 bg-[oklch(var(--avatar-blue))] text-white">
								<AvatarFallback className="bg-[oklch(var(--avatar-blue))] text-white text-2xl font-semibold">
									{invitationProperties?.organizationName?.[0] || "S"}
								</AvatarFallback>
							</Avatar>
						)}

						<div className="space-y-3">
							<h2 className="text-xl font-medium text-foreground leading-tight">
								{invitationProperties?.inviterName || "A member"} invited you to
								join {""}
								{invitationProperties?.organizationName || "their organization"}
								&apos;s team on TaskForge
								<br />
							</h2>
							<p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
								Are you ready to take collaboration to the next level? Join your
								team and start contributing to the project today!
							</p>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-center -space-x-2">
								{teamMembers.map((member, index) => (
									<Avatar
										key={index}
										className={`w-12 h-12 ${member.color} text-white border-2 border-card`}
									>
										<AvatarFallback
											className={`${member.color} text-white font-semibold`}
										>
											{member.avatar}
										</AvatarFallback>
									</Avatar>
								))}
								<div className="w-12 h-12 bg-muted rounded-full border-2 border-card flex items-center justify-center ml-2">
									<span className="text-sm font-medium text-muted-foreground">
										+5
									</span>
								</div>
							</div>
							<p className="text-sm text-muted-foreground">
								6 from your team have already accepted
							</p>
						</div>
					</div>
				</CardContent>

				<CardFooter className="pt-6">
					<div className="w-full flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Your invitation expires in 7 days.
						</p>
						<div className="flex gap-3">
							<Button
								variant="outline"
								className="px-6 bg-transparent hover:bg-primary  border-primary border-2"
							>
								Decline
							</Button>
							<Button
								onClick={acceptInvitation}
								className="px-6 bg-primary text-[oklch(var(--success-foreground))]"
							>
								Accept invitation
							</Button>
						</div>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default InvitationView;
