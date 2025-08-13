import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@src/components/ui/card";
import {
	TypographyH2,
	TypographyP,
	TypographyH3,
} from "@src/components/ui/typography";
import { TrendingUp, Users, Clock, Target, BarChart3, Zap } from "lucide-react";

export const Features = () => {
	const productivityMetrics = [
		{
			icon: <TrendingUp className="size-6 text-primary" />,
			value: "40%",
			label: "Faster Task Completion",
			description: "Average time savings reported by teams using TaskForge",
		},
		{
			icon: <Users className="size-6 text-primary" />,
			value: "10,000+",
			label: "Active Teams",
			description: "Teams worldwide trust TaskForge for their productivity",
		},
		{
			icon: <Clock className="size-6 text-primary" />,
			value: "2.5hrs",
			label: "Time Saved Daily",
			description: "Per user through intelligent task prioritization",
		},
		{
			icon: <Target className="size-6 text-primary" />,
			value: "95%",
			label: "Goal Achievement Rate",
			description: "Teams hit their targets more consistently",
		},
	];

	const keyFeatures = [
		{
			icon: <BarChart3 className="size-8 text-primary" />,
			title: "Smart Analytics Dashboard",
			description:
				"Get actionable insights into your team's productivity patterns, bottlenecks, and performance trends with real-time analytics.",
		},
		{
			icon: <Zap className="size-8 text-primary" />,
			title: "AI-Powered Automation",
			description:
				"Automate repetitive tasks, smart deadline suggestions, and priority recommendations based on your work patterns.",
		},
		{
			icon: <Users className="size-8 text-primary" />,
			title: "Team Collaboration Hub",
			description:
				"Seamlessly collaborate with comments, file sharing, real-time updates, and integrated communication tools.",
		},
	];

	return (
		<section className="w-full max-w-6xl mx-auto flex flex-col gap-16 mt-20 px-6 md:px-8">
			{/* Productivity Metrics */}
			<div className="text-center">
				<TypographyH2 className="text-4xl font-bold border-b-0 pb-0 mb-4">
					Proven Results That Matter
				</TypographyH2>
				<TypographyP className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
					Join thousands of teams who have transformed their productivity with
					TaskForge
				</TypographyP>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{productivityMetrics.map((metric, index) => (
						<Card
							key={index}
							className="border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
						>
							<CardContent className="p-6 text-center">
								<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
									{metric.icon}
								</div>
								<div className="text-3xl font-bold text-primary mb-2">
									{metric.value}
								</div>
								<CardTitle className="text-lg font-semibold mb-2">
									{metric.label}
								</CardTitle>
								<CardDescription className="text-sm">
									{metric.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Key Features */}
			<div className="text-center">
				<TypographyH2 className="text-4xl font-bold border-b-0 pb-0 mb-4">
					Everything You Need to Succeed
				</TypographyH2>
				<TypographyP className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
					Powerful features designed to help you and your team achieve more
				</TypographyP>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{keyFeatures.map((feature, index) => (
						<Card
							key={index}
							className="border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg p-6"
						>
							<CardContent className="text-center space-y-4 p-0">
								<div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
									{feature.icon}
								</div>
								<TypographyH3 className="text-xl font-semibold">
									{feature.title}
								</TypographyH3>
								<TypographyP className="text-muted-foreground">
									{feature.description}
								</TypographyP>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};
