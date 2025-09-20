import { TypographyP } from "@src/components/ui/typography";
import { Boxes } from "lucide-react";
import React from "react";
import CreateProjectPopover from "./create-project-popover";
import { Button } from "@src/components/ui/button";
import { OrganizationResponse } from "@src/lib/response-types";

export const NoAvailableProjectView: React.FC<{
	tenantId: string;
	dialogOpen: boolean;
	organization: OrganizationResponse;
	setDialogOpen: (dialogOpen: boolean) => void;
}> = ({ tenantId, dialogOpen, setDialogOpen, organization }) => {
	return (
		<div className="h-full w-full md:w-2/3 lg:1/2 flex flex-col justify-center text-muted-foreground text-sm">
			<Boxes size={32} color="currentColor" />
			<TypographyP>
				A Project is a high-level container for a larger body of work that
				drives toward a specific objective or outcome, such as a new feature you
				want to ship.
			</TypographyP>
			<TypographyP className="hidden md:block">
				They are often goal-oriented (e.g. <b>Launch v2.0</b>,
				<b>Revamp onboarding</b>) and consist of multiple tasks or issues that
				need to be completed.
			</TypographyP>
			{/* Adding mb-4 here  */}
			<TypographyP className="mb-4 hidden lg:block">
				They can be shared across multiple teams and are comprised of issues and
				optional documents. Projects are typically time-bound and may span
				across multiple teams or departments.
			</TypographyP>
			{/* Cause I took out mt-4 from here */}
			<CreateProjectPopover
				tenantId={tenantId}
				dialogOpen={dialogOpen}
				setDialogOpen={setDialogOpen}
				controller={
					<Button variant={"default"} size={"sm"}>
						Create new project
					</Button>
				}
				organization={organization}
			/>
		</div>
	);
};
