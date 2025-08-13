"use client";

import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { Switch } from "@src/components/ui/switch";
import { Label } from "@src/components/ui/label";
import { TypographyH2, TypographyP } from "@src/components/ui/typography";
import { Check, Star } from "lucide-react";

interface PricingPlan {
	name: string;
	subtitle: string;
	monthlyPrice: number;
	yearlyPrice: number;
	description: string;
	features: string[];
	isPopular?: boolean;
	ctaText: string;
}

export const Pricing = () => {
	const [isYearly, setIsYearly] = useState(false);

	const pricingPlans: PricingPlan[] = [
		{
			name: "Starter",
			subtitle: "Everything you need to get started",
			monthlyPrice: 19,
			yearlyPrice: 15,
			description:
				"Perfect for small teams just getting started with task management",
			features: [
				"Up to 5 team members",
				"Basic task management",
				"Project templates",
				"Mobile apps",
				"Email support",
				"Basic analytics",
			],
			ctaText: "Start a free trial",
		},
		{
			name: "Growth",
			subtitle: "All the extras for your growing team",
			monthlyPrice: 49,
			yearlyPrice: 39,
			description: "Advanced features and integrations for scaling teams",
			features: [
				"Up to 25 team members",
				"AI-powered prioritization",
				"Advanced analytics",
				"Custom workflows",
				"10+ integrations",
				"Priority support",
			],
			isPopular: true,
			ctaText: "Start a free trial",
		},
		{
			name: "Scale",
			subtitle: "Added flexibility at scale",
			monthlyPrice: 99,
			yearlyPrice: 79,
			description: "Enterprise-grade features for large organizations",
			features: [
				"Unlimited team members",
				"Advanced automation",
				"Custom integrations",
				"Enterprise security",
				"Dedicated support",
				"Advanced reporting",
			],
			ctaText: "Start a free trial",
		},
	];

	const getCurrentPrice = (plan: PricingPlan) => {
		return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
	};

	return (
		<section className="w-full max-w-7xl mx-auto flex flex-col gap-16 mt-20 px-6 md:px-8">
			<div className="text-center">
				<TypographyH2 className="text-4xl font-bold border-b-0 pb-0 mb-4">
					Pricing that grows with your team size
				</TypographyH2>
				<TypographyP className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
					Choose an affordable plan that&apos;s packed with the best features
					for engaging your audience, creating customer loyalty, and driving
					sales.
				</TypographyP>

				{/* Billing Toggle */}
				<div className="flex items-center justify-center gap-4 mb-12">
					<Label
						htmlFor="billing-toggle"
						className={`text-sm ${!isYearly ? "text-primary" : "text-muted-foreground"}`}
					>
						Monthly
					</Label>
					<Switch
						id="billing-toggle"
						checked={isYearly}
						onCheckedChange={setIsYearly}
					/>
					<Label
						htmlFor="billing-toggle"
						className={`text-sm ${isYearly ? "text-primary" : "text-muted-foreground"}`}
					>
						Yearly
					</Label>
					{isYearly && (
						<span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
							Save 20%
						</span>
					)}
				</div>
			</div>

			{/* Pricing Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
				{pricingPlans.map((plan, index) => (
					<Card
						key={index}
						className={`relative border transition-all duration-300 hover:shadow-lg ${
							plan.isPopular
								? "border-primary shadow-lg scale-105"
								: "border-border/50 hover:border-primary/20"
						}`}
					>
						{plan.isPopular && (
							<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
								<div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
									<Star className="size-4" />
									Most Popular
								</div>
							</div>
						)}

						<CardContent className="p-8">
							{/* Plan Header */}
							<div className="text-center mb-6">
								<CardTitle className="text-xl font-bold mb-2">
									{plan.name}
								</CardTitle>
								<CardDescription className="text-sm text-muted-foreground mb-4">
									{plan.subtitle}
								</CardDescription>

								<div className="flex items-center justify-center gap-2">
									<span className="text-4xl font-bold text-primary">
										${getCurrentPrice(plan)}
									</span>
									<div className="text-left">
										<div className="text-sm text-muted-foreground">USD</div>
										<div className="text-sm text-muted-foreground">
											per month
										</div>
									</div>
								</div>

								{isYearly && (
									<div className="text-xs text-muted-foreground mt-2">
										Billed annually at ${getCurrentPrice(plan) * 12}
									</div>
								)}
							</div>

							{/* CTA Button */}
							<Button
								className={`w-full mb-6 ${
									plan.isPopular ? "bg-primary hover:bg-primary/90" : ""
								}`}
								variant={plan.isPopular ? "default" : "outline"}
							>
								{plan.ctaText}
							</Button>

							{/* Features List */}
							<div className="space-y-3">
								<div className="text-sm font-medium text-foreground mb-3">
									What&apos;s included:
								</div>
								{plan.features.map((feature, featureIndex) => (
									<div key={featureIndex} className="flex items-center gap-3">
										<Check className="size-4 text-green-500 shrink-0" />
										<span className="text-sm text-muted-foreground">
											{feature}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Trust Indicators */}
			<div className="flex items-center justify-center gap-8 opacity-60 mt-12">
				<div className="text-lg font-semibold">Transistor</div>
				<div className="text-lg font-semibold">Laravel</div>
				<div className="text-lg font-semibold">Tuple</div>
				<div className="text-lg font-semibold">SavvyCal</div>
				<div className="text-lg font-semibold">Statamic</div>
			</div>
		</section>
	);
};
