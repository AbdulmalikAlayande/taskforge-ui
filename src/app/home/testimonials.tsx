"use client";

import React, { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@src/components/ui/card";
import { Button } from "@src/components/ui/button";
import { TypographyH2, TypographyP } from "@src/components/ui/typography";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

interface Testimonial {
	id: number;
	name: string;
	role: string;
	company: string;
	content: string;
	rating: number;
	avatar: string;
}

export const Testimonials = () => {
	const testimonials: Testimonial[] = [
		{
			id: 1,
			name: "Sarah Chen",
			role: "Project Manager",
			company: "TechFlow Inc",
			content:
				"TaskForge has revolutionized how our team manages projects. The AI-powered prioritization has increased our productivity by 40% in just 3 months.",
			rating: 5,
			avatar: "SC",
		},
		{
			id: 2,
			name: "Marcus Rodriguez",
			role: "Team Lead",
			company: "Digital Solutions",
			content:
				"The seamless integration with our existing tools made the transition effortless. Our team collaboration has never been stronger.",
			rating: 5,
			avatar: "MR",
		},
		{
			id: 3,
			name: "Emily Watson",
			role: "Product Owner",
			company: "StartupCo",
			content:
				"TaskForge's intelligent workflow automation has saved us countless hours. It's like having a productivity assistant for the entire team.",
			rating: 5,
			avatar: "EW",
		},
		{
			id: 4,
			name: "David Kim",
			role: "Engineering Manager",
			company: "BuildFast",
			content:
				"The analytics dashboard gives us insights we never had before. We can now identify bottlenecks and optimize our processes in real-time.",
			rating: 5,
			avatar: "DK",
		},
		{
			id: 5,
			name: "Lisa Thompson",
			role: "Operations Director",
			company: "Growth Labs",
			content:
				"TaskForge has become the central hub for all our operations. The team loves how intuitive and powerful it is.",
			rating: 5,
			avatar: "LT",
		},
	];

	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	// Auto-play functionality
	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) =>
				prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
			);
		}, 5000);

		return () => clearInterval(interval);
	}, [isAutoPlaying, testimonials.length]);

	const goToPrevious = () => {
		setIsAutoPlaying(false);
		setCurrentIndex(
			currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
		);
	};

	const goToNext = () => {
		setIsAutoPlaying(false);
		setCurrentIndex(
			currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
		);
	};

	const goToSlide = (index: number) => {
		setIsAutoPlaying(false);
		setCurrentIndex(index);
	};

	return (
		<section className="w-full max-w-6xl mx-auto flex flex-col gap-12 mt-20 px-6 md:px-8">
			<div className="text-center">
				<TypographyH2 className="text-4xl font-bold border-b-0 pb-0 mb-4">
					Trusted by Teams Worldwide
				</TypographyH2>
				<TypographyP className="text-lg text-muted-foreground max-w-3xl mx-auto">
					See what our customers have to say about their experience with
					TaskForge
				</TypographyP>
			</div>

			{/* Testimonial Carousel */}
			<div className="relative max-w-4xl mx-auto">
				<Card className="border border-border/50 overflow-hidden">
					<CardContent className="p-8 md:p-12">
						<div className="flex items-center justify-center mb-6">
							<Quote className="size-12 text-primary/30" />
						</div>

						<div className="text-center space-y-6">
							<TypographyP className="text-xl md:text-2xl leading-relaxed text-foreground">
								&ldquo;{testimonials[currentIndex].content}&rdquo;
							</TypographyP>

							{/* Star Rating */}
							<div className="flex justify-center gap-1">
								{Array.from({ length: testimonials[currentIndex].rating }).map(
									(_, i) => (
										<Star
											key={i}
											className="size-5 fill-yellow-400 text-yellow-400"
										/>
									)
								)}
							</div>

							{/* Author Info */}
							<div className="flex flex-col items-center space-y-2">
								<div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-lg font-semibold text-primary">
									{testimonials[currentIndex].avatar}
								</div>
								<div>
									<CardTitle className="text-lg font-semibold">
										{testimonials[currentIndex].name}
									</CardTitle>
									<CardDescription className="text-sm">
										{testimonials[currentIndex].role} at{" "}
										{testimonials[currentIndex].company}
									</CardDescription>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Navigation Buttons */}
				<Button
					variant="outline"
					size="icon"
					className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm border-border/50"
					onClick={goToPrevious}
				>
					<ChevronLeft className="size-4" />
				</Button>

				<Button
					variant="outline"
					size="icon"
					className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm border-border/50"
					onClick={goToNext}
				>
					<ChevronRight className="size-4" />
				</Button>
			</div>

			{/* Dots Indicator */}
			<div className="flex justify-center space-x-3">
				{testimonials.map((_, index) => (
					<button
						key={index}
						onClick={() => goToSlide(index)}
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							index === currentIndex
								? "bg-primary w-8"
								: "bg-muted-foreground/30 hover:bg-muted-foreground/50"
						}`}
					/>
				))}
			</div>
		</section>
	);
};
