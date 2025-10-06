import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import AuthProvider from "../components/auth-provider";
import { Toaster } from "@src/components/ui/sonner";
import QueryProvider from "@src/components/query-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "TaskForge",
	description: "Your Context-Aware AI Powered Productivity App.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning
			>
				<AuthProvider>
					<QueryProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							{children}
							<Toaster
								position="top-center"
								expand={true}
								richColors={true}
								closeButton={true}
								duration={5000}
								toastOptions={{
									classNames: {
										toast: "group toast group-[.toaster]:shadow-lg",
										title: "group-[.toast]:font-semibold",
										description:
											"group-[.toast]:text-sm group-[.toast]:opacity-90",
										actionButton:
											"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
										cancelButton:
											"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
										closeButton:
											"group-[.toast]:bg-muted group-[.toast]:hover:bg-muted/80",
									},
								}}
							/>
						</ThemeProvider>
					</QueryProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
