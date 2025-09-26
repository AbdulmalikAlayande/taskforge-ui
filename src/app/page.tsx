import Navbar from "./home/navbar";
import Hero from "./home/hero";
import { ValueProposition } from "./home/value-proposition";
import { Features } from "./home/features";
import { IntegrationHub } from "./home/integration-hub";
import { Testimonials } from "./home/testimonials";
import { Pricing } from "./home/pricing";
import { CTA } from "./home/cta";
import { Footer } from "./home/footer";

export default function Home() {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<Navbar />
			<main className="flex-1 flex flex-col items-center gap-6 md:gap-8">
				<Hero />
				<ValueProposition />
				<Features />
				<IntegrationHub />
				<Testimonials />
				<Pricing />
				<CTA />
			</main>
			<Footer />
		</div>
	);
}
