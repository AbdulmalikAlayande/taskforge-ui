"use client";

import { Card, CardContent } from "@src/components/ui/card";
import { Label } from "@src/components/ui/label";
import { Button } from "@src/components/ui/button";
import { TypographyH2, TypographyP } from "@src/components/ui/typography";
import React from "react";
import {
	FaSlack,
	FaGithub,
	FaFigma,
	FaGoogle,
	FaTrello,
	FaMicrosoft,
} from "react-icons/fa";
import {
	SiNotion,
	SiZoom,
	SiAsana,
	SiZendesk,
	SiClickup,
	SiAirtable,
} from "react-icons/si";

export const IntegrationHub = () => {
	// Top row integrations - will slide left
	const topRowIntegrations = [
		{ name: "Slack", icon: FaSlack, color: "text-[#4A154B]" },
		{ name: "GitHub", icon: FaGithub, color: "text-[#181717]" },
		{ name: "Figma", icon: FaFigma, color: "text-[#F24E1E]" },
		{ name: "Notion", icon: SiNotion, color: "text-[#000000]" },
		{ name: "Google", icon: FaGoogle, color: "text-[#4285F4]" },
		{ name: "Microsoft", icon: FaMicrosoft, color: "text-[#00BCF2]" },
	];

	// Bottom row integrations - will slide right
	const bottomRowIntegrations = [
		{ name: "Zoom", icon: SiZoom, color: "text-[#2D8CFF]" },
		{ name: "Trello", icon: FaTrello, color: "text-[#0079BF]" },
		{ name: "Asana", icon: SiAsana, color: "text-[#F06A6A]" },
		{ name: "Zendesk", icon: SiZendesk, color: "text-[#03363D]" },
		{ name: "ClickUp", icon: SiClickup, color: "text-[#7B68EE]" },
		{ name: "Airtable", icon: SiAirtable, color: "text-[#18BFFF]" },
	];

	return (
		<section className="w-full max-w-6xl mx-auto flex flex-col gap-12 mt-16 items-center text-center px-6 md:px-8 overflow-hidden">
			<div className="flex flex-col items-center justify-start gap-4">
				<TypographyH2 className="text-4xl font-bold border-b-0 pb-0">
					Connect over 300+ integrations
				</TypographyH2>
				<TypographyP className="text-lg text-muted-foreground max-w-2xl">
					TaskForge connects with the enterprise tools your organization already
					uses, right out of the box.
				</TypographyP>
			</div>

			{/* Integration Grid with Sliding Animation */}
			<div className="w-full space-y-8">
				{/* Top Row - Slides Left */}
				<div className="flex gap-6 animate-slide-left">
					{/* Duplicate the array for seamless loop */}
					{[
						...topRowIntegrations,
						...topRowIntegrations,
						...topRowIntegrations,
					].map((integration, index) => (
						<Card
							key={index}
							className="group hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20 cursor-pointer bg-background/80 backdrop-blur-sm flex-shrink-0 min-w-[120px]"
						>
							<CardContent className="p-6 flex flex-col items-center justify-center gap-3">
								<div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<integration.icon
										className={`text-3xl ${integration.color} dark:text-white`}
									/>
								</div>
								<h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors text-center">
									{integration.name}
								</h3>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Bottom Row - Slides Right */}
				<div className="flex gap-6 animate-slide-right">
					{/* Duplicate the array for seamless loop */}
					{[
						...bottomRowIntegrations,
						...bottomRowIntegrations,
						...bottomRowIntegrations,
					].map((integration, index) => (
						<Card
							key={index}
							className="group hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20 cursor-pointer bg-background/80 backdrop-blur-sm flex-shrink-0 min-w-[120px]"
						>
							<CardContent className="p-6 flex flex-col items-center justify-center gap-3">
								<div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<integration.icon
										className={`text-3xl ${integration.color} dark:text-white`}
									/>
								</div>
								<h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors text-center">
									{integration.name}
								</h3>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			<div className="flex flex-col items-center gap-4 mt-8">
				<Button className="px-8 py-3 bg-primary hover:bg-primary/90">
					See all integrations
				</Button>
				<Label className="text-sm text-muted-foreground">
					And 290+ more integrations available
				</Label>
			</div>
		</section>
	);
};
