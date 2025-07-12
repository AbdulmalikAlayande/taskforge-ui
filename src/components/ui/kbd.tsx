import React from "react";
import { cn } from "@src/lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
	return (
		<kbd
			data-slot="kbd"
			className={cn(
				"inline-flex items-center rounded border border-accent-foreground bg-muted px-1.5 py-0.5 text-xs font-mono font-medium text-muted-foreground",
				className
			)}
			{...props}
		/>
	);
}
Kbd.displayName = "Kbd";

export { Kbd };
