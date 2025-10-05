import { MemberResponse } from "@src/lib/response-types";
import Image from "next/image";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@src/components/ui/popover";
import { MoreHorizontal, User } from "lucide-react";
import { Button } from "@src/components/ui/button";
import React from "react";
import { Checkbox } from "@src/components/ui/checkbox";
import { useIsMobile } from "@src/app/hooks/use-mobile";
import { Spinner } from "@src/components/ui/spinner";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@src/components/ui/command";
import { Kbd } from "@src/components/ui/kbd";

type MemberSelectorOption = {
	id: string;
	name: string;
	icon: React.ElementType | React.ReactElement;
	value: number | string;
	description?: string;
};

type MemberSelectorProps = {
	userIcon: React.ReactNode;
	label: string;
	onChange: (id: string) => void;
	members: MemberResponse[];
	isLoading: boolean;
};
export function MemberSelector({
	userIcon,
	label,
	onChange,
	members,
	isLoading,
}: MemberSelectorProps) {
	const isMobile = useIsMobile();
	const [selectedMembers, setSelectedMembers] = React.useState<
		MemberSelectorOption[]
	>([]);

	const getUserName = (member: MemberResponse): string => {
		if (member.firstName && member.lastName)
			return `${member.firstName} ${member.lastName}`;
		else if (member.firstName && !member.lastName) return member.firstName;
		else if (!member.firstName && member.lastName) return member.lastName;
		else return "No Name";
	};

	if (isLoading) {
		return (
			<div className="w-full h-full flex flex-col justify-center items-center gap-2">
				<Spinner variant="bars" className="text-accent-foreground" size={25} />
				<span className="text-sm">Loading Team Members</span>
			</div>
		);
	}

	function handleCheckChange(member: MemberResponse): void {
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
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-6 gap-2 p-0">
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
