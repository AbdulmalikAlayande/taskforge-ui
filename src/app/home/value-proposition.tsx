import React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@src/components/ui/card";
import { TypographyH3, TypographyP } from "@src/components/ui/typography";

export const ValueProposition = () => {
	return (
		<main className="w-5/6 max-w-5xl flex flex-col gap-8 mt-10 items-center text-center">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
				<Card className="backdrop-blur-sm rounded-lg p-6 border border-secondary/10 shadow-sm">
					<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
						{/* w-12 h-12 bg-primary/10 rounded-lg justify-center mb-4 */}
						<GalleryVerticalEnd className="size-6 text-primary" />
					</div>
					<CardContent className="px-0">
						<CardTitle className="">
							<TypographyH3 className="w-full h-full text-primary-foreground mb-2">
								Smart Prioritization
							</TypographyH3>
						</CardTitle>
						<CardDescription className="">
							<TypographyP>
								AI-powered suggestions help you focus on what matters most
							</TypographyP>
						</CardDescription>
					</CardContent>
				</Card>
				<Card className="backdrop-blur-sm rounded-lg p-6 border border-secondary/10 shadow-sm">
					<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
						{/* w-12 h-12 bg-primary/10 rounded-lg justify-center mb-4 */}
						<GalleryVerticalEnd className="size-6 text-primary" />
					</div>
					<CardContent className="px-0">
						<CardTitle className="">
							<TypographyH3 className="w-full h-full text-primary-foreground mb-2">
								Context-Aware Workflows
							</TypographyH3>
						</CardTitle>
						<CardDescription className="">
							<TypographyP>
								Tasks automatically reorganize based on deadlines, focus level,
								and project phase
							</TypographyP>
						</CardDescription>
					</CardContent>
				</Card>

				<Card className="backdrop-blur-sm rounded-lg p-6 border border-secondary/10 shadow-sm">
					<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
						<GalleryVerticalEnd className="size-6 text-primary" />
					</div>
					<CardContent className="px-0">
						<CardTitle className="">
							<TypographyH3 className="w-full h-full text-primary-foreground mb-2">
								Real Collaboration{" "}
							</TypographyH3>
						</CardTitle>
						<CardDescription className="">
							<TypographyP>
								Comment, assign, and track progress in real-time with your team
							</TypographyP>
						</CardDescription>
					</CardContent>
				</Card>

				<Card className="backdrop-blur-sm rounded-lg p-6 border border-secondary/10 shadow-sm">
					<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
						{/* w-12 h-12 bg-primary/10 rounded-lg justify-center mb-4 */}
						<GalleryVerticalEnd className="size-6 text-primary" />
					</div>
					<CardContent className="px-0">
						<CardTitle className="">
							<TypographyH3 className="w-full h-full text-primary-foreground mb-2">
								Organize Tasks
							</TypographyH3>
						</CardTitle>
						<CardDescription className="">
							<TypographyP>
								Structure your work with intuitive task management tools
							</TypographyP>
						</CardDescription>
					</CardContent>
				</Card>
				<Card className="backdrop-blur-sm rounded-lg p-6 border border-secondary/10 shadow-sm">
					<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
						<GalleryVerticalEnd className="size-6 text-primary" />
					</div>
					<CardContent className="px-0">
						<CardTitle className="">
							<TypographyH3 className="w-full h-full text-primary-foreground mb-2">
								Track Progress
							</TypographyH3>
						</CardTitle>
						<CardDescription className="">
							<TypographyP>
								Monitor your productivity with detailed analytics and insights
							</TypographyP>
						</CardDescription>
					</CardContent>
				</Card>
				<Card className="backdrop-blur-sm rounded-lg p-6 border border-secondary/10 shadow-sm">
					<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
						<GalleryVerticalEnd className="size-6 text-primary" />
					</div>
					<CardContent className="px-0">
						<CardTitle className="">
							<TypographyH3 className="w-full h-full text-primary-foreground mb-2">
								Collaborate
							</TypographyH3>
						</CardTitle>
						<CardDescription className="">
							<TypographyP>
								Work seamlessly with your team on shared projects
							</TypographyP>
						</CardDescription>
					</CardContent>
				</Card>
			</div>
		</main>
	);
};
