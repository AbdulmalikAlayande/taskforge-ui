import * as React from "react";

import { cn } from "@src/lib/utils";

export function TypographyH1({
	className,
	...props
}: React.ComponentProps<"h1">) {
	return (
		<h1
			data-slot="typography-h1"
			className={cn(
				"scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
				className
			)}
			{...props}
		/>
	);
}

export function TypographyH2({
	className,
	...props
}: React.ComponentProps<"h2">) {
	return (
		<h2
			data-slot="typography-h2"
			className={cn(
				"scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0",
				className
			)}
			{...props}
		/>
	);
}

export function TypographyH3({
	className,
	...props
}: React.ComponentProps<"h3">) {
	return (
		<h3
			data-slot="typography-h3"
			className={cn(
				"scroll-m-20 text-2xl font-semibold tracking-tight",
				className
			)}
			{...props}
		/>
	);
}

export function TypographyH4({
	className,
	...props
}: React.ComponentProps<"h4">) {
	return (
		<h4
			data-slot="typography-h4"
			className={cn(
				"scroll-m-20 text-xl font-semibold tracking-tight",
				className
			)}
			{...props}
		/>
	);
}

export function TypographyP({
	className,
	...props
}: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="typography-p"
			className={cn(
				"leading-7 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
				className
			)}
			{...props}
		/>
	);
}

export function TypographySmall({
	className,
	...props
}: React.ComponentProps<"small">) {
	return (
		<small
			data-slot="typography-small"
			className={cn("text-sm leading-none font-medium", className)}
			{...props}
		/>
	);
}
