import { Card, CardContent } from "@src/components/ui/card";
import { Label } from "@src/components/ui/label";
import { TypographyH2 } from "@src/components/ui/typography";
import React from "react";

export const IntegrationHub = () => {
	return (
		<div className="w-full flex flex-col gap-8 mt-10 items-center text-center px-6 md:px-8">
			<div className={"w-full flex flex-col items-center justify-start"}>
				<TypographyH2>Work with you favourite tools</TypographyH2>
				<Label className={"text-start"}>Connect 10+ Integrations</Label>
			</div>

			{/* Logo Grid */}
			<section>
				<Card>
					<CardContent></CardContent>
				</Card>
				<Card>
					<CardContent></CardContent>
				</Card>
				<Card>
					<CardContent></CardContent>
				</Card>
				<Card>
					<CardContent></CardContent>
				</Card>
				<Card>
					<CardContent></CardContent>
				</Card>
				<Card>
					<CardContent></CardContent>
				</Card>
				<Card>
					<CardContent></CardContent>
				</Card>
			</section>
		</div>
	);
};
