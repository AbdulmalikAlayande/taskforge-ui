import { useFetch } from "@src/app/hooks/useFetch";
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
import React from "react";
import { List, ListItem } from "@src/components/ui/list";
import { Checkbox } from "@src/components/ui/checkbox";
import { useIsMobile } from "@src/app/hooks/use-mobile";

type MemberSelectorOption = {
	id: string;
	name: string;
	icon: React.ElementType | React.ReactElement;
	value: number | string;
	description?: string;
};

type MemberSelectorProps = {
	onChange: (id: string) => void;
};
export function MemberSelector({ onChange }: MemberSelectorProps) {
	const isMobile = useIsMobile();
	const { tenantId } = useTenant();
	const [selectedMembers, setSelectedMembers] = React.useState<
		MemberSelectorOption[]
	>([]);

	const fetchConfig = React.useMemo(
		() => ({
			url: `/organization/${tenantId}/members`,
			queryKey: [`members-${tenantId}`],
			enabled: !!tenantId,
		}),
		[tenantId]
	);

	const { data, isLoading } = useFetch<UserResponse[]>(fetchConfig);

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
				{data ? (
					<List selectable>
						{data.map((member) => (
							<ListItem
								key={member.publicId}
								onSelect={() => onChange(member.publicId)}
								icon={
									member.image ? (
										<Image
											src={member.image}
											alt={`${member.firstname} ${member.lastname}`}
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
													name: `${member.firstname} ${member.lastname}`,
													icon: member.image ? (
														<Image
															src={member.image}
															alt={`${member.firstname} ${member.lastname}`}
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
								{`${member.firstname} ${member.lastname}`}
							</ListItem>
						))}
					</List>
				) : isLoading ? (
					<div className="p-4 text-center">Loading...</div>
				) : (
					<div className="p-4 text-center">No members found</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
