import Navbar from "./navbar";
import Hero from "./hero";
import { ValueProposition } from "./value-proposition";
import { Features } from "./features";
import { IntegrationHub } from "./integration-hub";
import { Testimonials } from "./testimonials";
import { Pricing } from "./pricing";
import { CTA } from "./cta";
import { Footer } from "./footer";

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
