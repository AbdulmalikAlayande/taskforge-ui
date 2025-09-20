import { useTenant } from "@src/components/tenant-provider";
import { UserResponse } from "@src/lib/response-types";
import Image from "next/image";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import { MoreHorizontal, Users2 } from "lucide-react";
import { Button } from "@src/components/ui/button";
import React, { useEffect, useState } from "react";
import { UnorderedList, ListItem } from "@src/components/ui/list";
import { Checkbox } from "@src/components/ui/checkbox";
import { useIsMobile } from "@src/app/hooks/use-mobile";
import { useApiClient } from "@src/app/hooks/useApiClient";
import { Spinner } from "@src/components/ui/spinner";

type MemberSelectorOption = {
	id: string;
	name: string;
	icon: React.ElementType | React.ReactElement;
	value: number | string;
	description?: string;
};

type MemberSelectorProps = {
	onChange: (id: string) => void;
	members?: UserResponse[];
};
export function MemberSelector({ onChange, members }: MemberSelectorProps) {
	const isMobile = useIsMobile();
	const { tenantId } = useTenant();
	const [selectedMembers, setSelectedMembers] = React.useState<
		MemberSelectorOption[]
	>([]);

	const [teamMembers, setTeamMembers] = useState<UserResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const { apiClient } = useApiClient();

	const fetchMembers = React.useCallback(async () => {
		setLoading(true);
		try {
			const response = await apiClient.get<UserResponse[]>(
				`/organization/${tenantId}/members`
			);
			if (response && response.length > 0) setTeamMembers(response);
		} finally {
			setLoading(false);
		}
	}, [apiClient, tenantId]);

	useEffect(() => {
		if (members && members.length > 0) {
			setTeamMembers(members);
		} else {
			fetchMembers();
		}
	}, [members, fetchMembers]);

	if (loading || teamMembers.length === 0) {
		return (
			<div className="w-full h-full flex flex-col justify-center items-center gap-2">
				<Spinner variant="bars" className="text-accent-foreground" size={25} />
				<span className="text-sm">Loading Team Members</span>
			</div>
		);
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-6 gap-2 p-0">
					{/* className={
 
					*/}
					<span
						className={
							isMobile
								? `inline-flex items-center rounded border bg-muted px-1 py-1 text-xs font-mono font-medium text-muted-foreground`
								: `flex items-center justify-between rounded-md px-2 gap-2`
						}
					>
						{selectedMembers.length > 0 ? (
							selectedMembers.map((member) => (
								<span key={member.id} className="flex items-center gap-2">
									{React.isValidElement(member.icon)
										? member.icon
										: React.createElement(member.icon)}
									{member.name}
								</span>
							))
						) : (
							<>
								{isMobile ? (
									<Users2 />
								) : (
									<span className="w-full h-full flex items-center justify-between rounded-md gap-2">
										<Users2 /> <span>Members</span>
									</span>
								)}
							</>
						)}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={8}
				className="w-72 rounded-md border bg-popover text-popover-foreground shadow-md p-0"
			>
				{teamMembers.length > 0 ? (
					<UnorderedList selectable>
						{teamMembers.map((member) => (
							<ListItem
								key={member.publicId}
								onSelect={() => onChange(member.publicId)}
								icon={
									member.image ? (
										<Image
											src={member.image}
											alt={`${member.firstName} ${member.lastName}`}
											className="w-6 h-6 rounded-full"
										/>
									) : (
										<MoreHorizontal />
									)
								}
							>
								<Checkbox
									className="mr-2"
									checked={selectedMembers.some(
										(m) => m.id === member.publicId
									)}
									onCheckedChange={(checked) => {
										setSelectedMembers((prev) => {
											if (prev.some((m) => m.id === member.publicId)) {
												return prev.filter((m) => m.id !== member.publicId);
											} else {
												const newMember: MemberSelectorOption = {
													id: member.publicId,
													name: `${member.firstName} ${member.lastName}`,
													icon: member.image ? (
														<Image
															src={member.image}
															alt={`${member.firstName} ${member.lastName}`}
															width={24}
															height={24}
															className="rounded-full"
														/>
													) : (
														MoreHorizontal
													),
													value: member.publicId,
												};
												return [...prev, newMember];
											}
										});

										// Only call onChange when there's a change
										if (
											checked !==
											selectedMembers.some((m) => m.id === member.publicId)
										) {
											onChange(member.publicId);
										}
									}}
								/>
								{`${member.firstName} ${member.lastName}`}
							</ListItem>
						))}
					</UnorderedList>
				) : (
					<div className="p-4 text-center">No members found</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
