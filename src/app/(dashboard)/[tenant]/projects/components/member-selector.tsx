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
	const { tenantId } = useTenant();
	let selectedMembers: MemberSelectorOption[] = [];

	const { data, isLoading } = useFetch<UserResponse[]>({
		url: `${process.env.NEXT_PUBLIC_API_URL}/organization/${tenantId}/members`,
		queryKey: [],
	});

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
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
							<Users2 />
							<span>Members</span>
						</>
					)}
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
									onCheckedChange={() => {
										if (selectedMembers.some((m) => m.id === member.publicId)) {
											selectedMembers = selectedMembers.filter(
												(m) => m.id !== member.publicId
											);
										}
										onChange(member.publicId);
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
