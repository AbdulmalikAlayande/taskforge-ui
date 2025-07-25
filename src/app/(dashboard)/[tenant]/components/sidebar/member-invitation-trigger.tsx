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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@src/components/ui/select";
import { Loader2, MailIcon, UserPlus2 } from "lucide-react";
import { useApiClient } from "@src/app/hooks/useApiClient";
import { Input } from "@src/components/ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@src/lib/response-types";
import { SidebarMenu, SidebarMenuItem } from "@src/components/ui/sidebar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@src/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";

type InvitationRequest = {
	email: string;
	name: string;
	invitedBy: string;
	organizationId: string;
	role: string;
};

type InvitationResponse = {
	message: string;
	memberID: string;
	roles: string[];
	email: string;
	publicId: string;
	invitationLink: string;
	organizationId: string;
	organizationName: string;
	status: string;
	createdAt: string;
	expiresAt: string;
	lastModifiedAt: string;
};

const FormSchema = z.object({
	email: z.string().email("Invalid email address"),
	name: z.string().min(1, "Name is required"),
	role: z.string().min(1, "Role is required"),
});

export const MemberInvitationTrigger = () => {
	const { apiClient } = useApiClient();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isOpen, setIsOpen] = React.useState(false);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			name: "",
			role: "",
		},
	});

	const { reset, register, control } = form;

	async function inviteMember(data: z.infer<typeof FormSchema>) {
		setIsLoading(true);
		try {
			console.log("Inviting:", data);

			const invitationResponse = await apiClient.post<
				InvitationResponse,
				InvitationRequest
			>("/organization/invite", {
				...data,
				invitedBy: "currentUserId",
				organizationId: "currentOrganizationId",
			});

			console.log("Invitation sent:", invitationResponse);
			reset();
			setIsOpen(false); // Close dialog on success
		} catch (error) {
			console.error("Error inviting member:", error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Card className="gap-6 py-4 shadow-none">
					<CardHeader className="px-4">
						<CardTitle className="text-sm">Invite team mates</CardTitle>
						<CardDescription>
							Invite people to your organization
						</CardDescription>
					</CardHeader>
					<CardContent className="flex items-center justify-center px-4">
						<Dialog open={isOpen} onOpenChange={setIsOpen}>
							<DialogTrigger className="w-full">
								<Button
									size="sm"
									className="w-full flex items-center-safe bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
								>
									<MailIcon className="mr-2" />
									Invite Member
								</Button>
							</DialogTrigger>
							<DialogContent className="w-full max-w-md h-80 px-0 gap-2">
								<DialogHeader className="w-full px-4">
									<DialogTitle>Invite a new member</DialogTitle>
								</DialogHeader>
								<div className="w-full h-10 px-4">
									<span className="size-10 flex items-center justify-center bg-muted-foreground rounded-xl">
										<UserPlus2 />
									</span>
								</div>
								<form
									className="w-full flex flex-col items-center justify-evenly gap-4"
									onSubmit={form.handleSubmit(inviteMember)}
								>
									<div className={"w-full flex flex-col gap-2.5 px-4"}>
										<Input
											id="name"
											type="text"
											placeholder="Name"
											variant={"normal"}
											{...register("name")}
										/>
										<Input
											id="email"
											type="email"
											placeholder="Email"
											variant={"normal"}
											{...register("email")}
										/>
									</div>
									<div className="w-full flex items-center justify-center px-4">
										<Controller
											name="role"
											control={control}
											render={({ field }) => (
												<Select
													onValueChange={field.onChange}
													value={field.value}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select Role" />
													</SelectTrigger>
													<SelectContent className="w-full">
														<SelectItem value={Role.ORGANIZATION_MEMBER}>
															Member
														</SelectItem>
														<SelectItem value={Role.ORGANIZATION_ADMIN}>
															Admin
														</SelectItem>
														<SelectItem value={Role.ORGANIZATION_OWNER}>
															Organization Owner
														</SelectItem>
													</SelectContent>
												</Select>
											)}
										/>
									</div>
									<div className="w-full flex items-center justify-center gap-2 px-4">
										<Button
											disabled={isLoading || form.formState.isSubmitting}
											type="submit"
											className="w-1/2 bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
											size="sm"
										>
											{isLoading || form.formState.isSubmitting ? (
												<span className="w-full flex items-center justify-center gap-2 ">
													<Loader2 className="animate-spin h-8 w-8 text-primary" />
													<span className="">Inviting</span>
												</span>
											) : (
												<span className="w-full flex items-center justify-center gap-2 ">
													<MailIcon />
													<span className="">Invite</span>
												</span>
											)}
										</Button>
									</div>
								</form>
							</DialogContent>
						</Dialog>
					</CardContent>
				</Card>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
