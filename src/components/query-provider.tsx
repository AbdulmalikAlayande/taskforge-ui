"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 60 * 1000,
						retry: (failureCount: number, error: unknown) => {
							if (
								typeof error === "object" &&
								error !== null &&
								"status" in error &&
								typeof (error as { status?: number }).status === "number" &&
								(error as { status: number }).status >= 400 &&
								(error as { status: number }).status < 500
							) {
								return false;
							}
							return failureCount < 3;
						},
					},
					mutations: {
						retry: false,
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
