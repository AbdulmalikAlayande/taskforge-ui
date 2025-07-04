import Navbar from "./navbar";
import Hero from "./hero";
import { ValueProposition } from "./value-proposition";
import { IntegrationHub } from "./integration-hub";

export default function Home() {
	return (
		<div className="min-h-screen bg-background flex flex-col items-center justify-between gap-6 md:gap-8">
			<Navbar />
			<Hero />
			<ValueProposition />
			<IntegrationHub />
		</div>
	);
}
