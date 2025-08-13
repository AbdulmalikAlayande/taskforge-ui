import React from "react";
import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import { TypographyH2, TypographyP } from "@src/components/ui/typography";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const CTA = () => {
	return (
		<section className="w-full max-w-6xl mx-auto mt-20 px-6 md:px-8">
			<Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 overflow-hidden">
				<CardContent className="relative p-12 text-center">
					{/* Background decoration */}
					<div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
					<div className="absolute top-6 right-6">
						<Sparkles className="size-8 text-primary/30" />
					</div>
					<div className="absolute bottom-6 left-6">
						<Sparkles className="size-6 text-primary/20" />
					</div>

					<div className="relative max-w-3xl mx-auto">
						<TypographyH2 className="text-4xl font-bold border-b-0 pb-0 mb-4">
							Ready to Transform Your Productivity?
						</TypographyH2>
						<TypographyP className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
							Join over 10,000 teams who have already revolutionized their
							workflow with TaskForge. Start your free trial today and
							experience the future of task management.
						</TypographyP>

						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
							<Button
								size="lg"
								className="px-8 py-4 text-lg font-semibold group"
								asChild
							>
								<Link href="/signup">
									Start Free Trial
									<ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
								</Link>
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="px-8 py-4 text-lg"
								asChild
							>
								<Link href="/demo">Schedule a Demo</Link>
							</Button>
						</div>

						<div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								No credit card required
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								14-day free trial
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								Setup in 2 minutes
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
};
