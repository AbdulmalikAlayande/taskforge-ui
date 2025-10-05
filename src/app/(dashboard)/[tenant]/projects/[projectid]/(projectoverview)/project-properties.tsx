import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import { Badge } from "@src/components/ui/badge";
import { Skeleton } from "@src/components/ui/skeleton";
import { Calendar, Users, Tag, Plus, AlertCircle } from "lucide-react";
import { MemberSelector } from "../../components/member-selector";
import useIndexedDB from "@src/app/hooks/useIndexedDB";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useMemo } from "react";
import { useUserStorage } from "@src/app/hooks/useUserStorage";
import { MemberResponse } from "@src/lib/response-types";
import { useApiClient } from "@src/app/hooks/useApiClient";
import { Button } from "@src/components/ui/button";
import { toast } from "sonner";

type Member = {
	publicId: string;
	firstName: string;
	lastName: string;
	image?: string;
};

type ProjectPropertiesProps = {
	members?: Member[];
	isLoadingMembers?: boolean;
	hasErrorMembers?: boolean;
	startDate?: string;
	endDate?: string;
	tags?: string[];
	team?: string;
};

export function ProjectProperties({
	members = [],
	isLoadingMembers = false,
	hasErrorMembers = false,
	startDate,
	endDate,
	tags = [],
	team,
}: ProjectPropertiesProps) {
	const { data: session } = useSession();
	const { getOrganization } = useIndexedDB();
	const { getCurrentTenantId } = useUserStorage();
	const { apiClient } = useApiClient();
	const [organizationMembers, setOrganizationMembers] =
		useState<MemberResponse[]>();

	const fetchOrganizationMembers = React.useCallback(() => {
		apiClient
			.get<MemberResponse[]>("")
			.then((response) => {
				setOrganizationMembers(response);
			})
			.catch((error) => console.log("An error occured", { error }));
	}, [apiClient]);

	const getOrganizationMembers = React.useCallback(async () => {
		const organization = await getOrganization(
			session?.tenantId || getCurrentTenantId() || ""
		);
		if (organization) setOrganizationMembers(organization.members);
		else fetchOrganizationMembers();
	}, [
		getOrganization,
		session?.tenantId,
		getCurrentTenantId,
		fetchOrganizationMembers,
	]);

	useEffect(() => {
		getOrganizationMembers();
	}, [getOrganizationMembers]);

	return (
		<div className="space-y-6">
			<div>
				<h3 className="mb-3 text-sm font-medium">Project Properties</h3>
				<div className="space-y-4">
					{/* Members */}
					<div className="flex items-start gap-3">
						<div className="flex h-5 w-5 items-center justify-center">
							<Users className="h-4 w-4 text-muted-foreground" />
						</div>
						<div className="flex-1 space-y-2">
							<p className="text-sm text-muted-foreground">Members</p>
							<div className="flex items-center gap-2">
								{isLoadingMembers ? (
									<div className="flex gap-2">
										<Skeleton className="h-8 w-8 rounded-full" />
										<Skeleton className="h-8 w-8 rounded-full" />
										<Skeleton className="h-8 w-8 rounded-full" />
									</div>
								) : hasErrorMembers ? (
									<p className="text-sm text-muted-foreground">
										Error loading members
									</p>
								) : members.length > 0 ? (
									<div className="flex -space-x-2">
										{members.slice(0, 5).map((member) => (
											<Avatar
												key={member.publicId}
												className="h-8 w-8 border-2 border-background"
											>
												<AvatarImage
													src={member.image || "/placeholder-user.jpg"}
													alt={`${member.firstName} ${member.lastName}`}
												/>
												<AvatarFallback>
													{member.firstName[0]}
													{member.lastName[0]}
												</AvatarFallback>
											</Avatar>
										))}
										{members.length > 5 && (
											<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
												+{members.length - 5}
											</div>
										)}
									</div>
								) : (
									<p className="text-sm text-muted-foreground">No members</p>
								)}
							</div>
						</div>
						<div className="h-full">
							<MemberSelector
								userIcon={<Plus className="" />}
								label={"Add members"}
								members={organizationMembers || []}
								isLoading={false}
								onChange={(id) => console.log("Selected member:", id)}
							/>
						</div>
					</div>

					{/* Dates */}
					{(startDate || endDate) && (
						<div className="flex items-start gap-3">
							<div className="flex h-5 w-5 items-center justify-center">
								<Calendar className="h-4 w-4 text-muted-foreground" />
							</div>
							<div className="flex-1 space-y-2">
								<p className="text-sm text-muted-foreground">Dates</p>
								<div className="flex items-center gap-2 text-sm">
									{startDate && <span>{startDate}</span>}
									{startDate && endDate && (
										<span className="text-muted-foreground">→</span>
									)}
									{endDate && <span>{endDate}</span>}
								</div>
							</div>
						</div>
					)}

					{/* Team */}
					{team && (
						<div className="flex items-start gap-3">
							<div className="flex h-5 w-5 items-center justify-center">
								<Tag className="h-4 w-4 text-muted-foreground" />
							</div>
							<div className="flex-1 space-y-2">
								<p className="text-sm text-muted-foreground">Team</p>
								<Badge variant="secondary">{team}</Badge>
							</div>
						</div>
					)}

					{/* Tags */}
					{tags.length > 0 && (
						<div className="flex items-start gap-3">
							<div className="flex h-5 w-5 items-center justify-center">
								<Tag className="h-4 w-4 text-muted-foreground" />
							</div>
							<div className="flex-1 space-y-2">
								<p className="text-sm text-muted-foreground">Labels</p>
								<div className="flex flex-wrap gap-2">
									{tags.map((tag, index) => (
										<Badge key={index} variant="outline">
											{tag}
										</Badge>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
