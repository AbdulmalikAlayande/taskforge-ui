"use client";

import { Button } from "@src/components/ui/button";
import { ChevronRight, Play } from "lucide-react";
import Link from "next/link";

export default function Hero() {
	return (
		<div className="w-full">
			<div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
				{/* Title */}
				<div className="max-w-3xl text-center mx-auto">
					<h1 className="block font-medium text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
						Organize Work, Get Results with TaskForge
					</h1>
				</div>
				{/* End Title */}

				<div className="max-w-3xl text-center mx-auto">
					<p className="text-lg text-white/70">
						The intelligent task management platform that prioritize, accomplish
						your goals efficiently and adapts to your workflow.
					</p>
				</div>

				{/* Buttons */}
				<div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 text-center">
					<Link href="/login">
						<Button className="py-3 px-6 flex justify-center items-center gap-x-2 text-sm font-medium rounded-[var(--radius)] border border-transparent bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors">
							Start for Free
							<ChevronRight className="shrink-0 size-4" />
						</Button>
					</Link>
					<Link href="/login">
						<Button
							variant="outline"
							className="py-3 px-6 flex justify-center items-center gap-x-2 text-sm font-medium rounded-[var(--radius)] border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors"
						>
							<Play className="shrink-0 size-4" />
							See How It Works
						</Button>
					</Link>
				</div>
				{/* End Buttons */}
			</div>
		</div>
	);
}
