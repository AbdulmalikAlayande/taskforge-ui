import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@src/lib/utils";

// Base List Variants
const baseListVariants = cva("", {
	variants: {
		orientation: {
			vertical: "flex flex-col",
			horizontal: "flex flex-row gap-4",
		},
		spacing: {
			none: "",
			sm: "space-y-1",
			md: "space-y-2",
			lg: "space-y-4",
		},
	},
	defaultVariants: {
		orientation: "vertical",
		spacing: "md",
	},
});

// Unordered List Variants
const unorderedListVariants = cva("list-disc pl-6", {
	variants: {
		marker: {
			disc: "list-disc",
			circle: "list-circle",
			square: "list-square",
			none: "list-none",
		},
	},
	defaultVariants: {
		marker: "disc",
	},
});

// Ordered List Variants
const orderedListVariants = cva("list-decimal pl-6", {
	variants: {
		marker: {
			decimal: "list-decimal",
			"lower-alpha": "list-lower-alpha",
			"upper-alpha": "list-upper-alpha",
			"lower-roman": "list-lower-roman",
			"upper-roman": "list-upper-roman",
			none: "list-none",
		},
	},
	defaultVariants: {
		marker: "decimal",
	},
});

// Description List Variants
const descriptionListVariants = cva("space-y-2", {
	variants: {
		layout: {
			stacked: "space-y-2",
			inline: "flex flex-col gap-1",
			grid: "grid grid-cols-3 gap-2",
		},
	},
	defaultVariants: {
		layout: "stacked",
	},
});

// Base Props for all lists
interface BaseListProps extends VariantProps<typeof baseListVariants> {
	selectable?: boolean;
	className?: string;
	children?: React.ReactNode;
}

// UnorderedList Props
interface UnorderedListProps
	extends React.HTMLAttributes<HTMLUListElement>,
		BaseListProps,
		VariantProps<typeof unorderedListVariants> {}

// UnorderedList Component
const UnorderedList = React.forwardRef<HTMLUListElement, UnorderedListProps>(
	(
		{
			orientation,
			spacing,
			marker,
			selectable = false,
			className,
			children,
			...props
		},
		ref
	) => {
		return (
			<ul
				ref={ref}
				className={cn(
					baseListVariants({ orientation, spacing }),
					unorderedListVariants({ marker }),
					className
				)}
				role={selectable ? "listbox" : "list"}
				{...props}
			>
				{children}
			</ul>
		);
	}
);
UnorderedList.displayName = "UnorderedList";

// OrderedList Props
interface OrderedListProps
	extends React.HTMLAttributes<HTMLOListElement>,
		BaseListProps,
		VariantProps<typeof orderedListVariants> {
	start?: number;
	reversed?: boolean;
}

// OrderedList Component
const OrderedList = React.forwardRef<HTMLOListElement, OrderedListProps>(
	(
		{
			orientation,
			spacing,
			marker,
			selectable = false,
			start,
			reversed,
			className,
			children,
			...props
		},
		ref
	) => {
		return (
			<ol
				ref={ref}
				className={cn(
					baseListVariants({ orientation, spacing }),
					orderedListVariants({ marker }),
					className
				)}
				role={selectable ? "listbox" : "list"}
				start={start}
				reversed={reversed}
				{...props}
			>
				{children}
			</ol>
		);
	}
);
OrderedList.displayName = "OrderedList";

// DescriptionList Props
interface DescriptionListProps
	extends React.HTMLAttributes<HTMLDListElement>,
		BaseListProps,
		VariantProps<typeof descriptionListVariants> {}

// DescriptionList Component
const DescriptionList = React.forwardRef<
	HTMLDListElement,
	DescriptionListProps
>(
	(
		{
			orientation,
			spacing,
			layout,
			selectable = false,
			className,
			children,
			...props
		},
		ref
	) => {
		return (
			<dl
				ref={ref}
				className={cn(
					baseListVariants({ orientation, spacing }),
					descriptionListVariants({ layout }),
					className
				)}
				role={selectable ? "listbox" : "list"}
				{...props}
			>
				{children}
			</dl>
		);
	}
);
DescriptionList.displayName = "DescriptionList";

// ListItem Props
interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
	selected?: boolean;
	disabled?: boolean;
	icon?: React.ReactNode;
	onSelect?: () => void;
}

// ListItem Component
const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
	(
		{ className, selected, disabled, icon, onSelect, children, ...props },
		ref
	) => {
		const handleClick = () => {
			if (onSelect && !disabled) {
				onSelect();
			}
		};

		return (
			<li
				ref={ref}
				className={cn(
					"flex items-center gap-2 py-2 px-3",
					onSelect &&
						!disabled &&
						"cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
					selected && "bg-gray-100 dark:bg-gray-800",
					disabled && "opacity-50 pointer-events-none",
					className
				)}
				onClick={handleClick}
				aria-selected={selected}
				aria-disabled={disabled}
				role={onSelect ? "option" : "listitem"}
				{...props}
			>
				{icon && <span className="flex-shrink-0">{icon}</span>}
				<span className="flex-1">{children}</span>
			</li>
		);
	}
);
ListItem.displayName = "ListItem";

// DescriptionItem Props
interface DescriptionItemProps {
	term: string;
	description: string | React.ReactNode;
	className?: string;
}

// DescriptionItem Component
const DescriptionItem = ({
	term,
	description,
	className,
}: DescriptionItemProps) => (
	<div className={cn("flex flex-col gap-1", className)}>
		<dt className="font-semibold">{term}</dt>
		<dd className="ml-4">{description}</dd>
	</div>
);
DescriptionItem.displayName = "DescriptionItem";

// Nested List Components
interface NestedUnorderedListProps
	extends Omit<UnorderedListProps, "className"> {
	className?: string;
}

const NestedUnorderedList = React.forwardRef<
	HTMLUListElement,
	NestedUnorderedListProps
>(({ className, ...props }, ref) => (
	<UnorderedList ref={ref} className={cn("ml-4", className)} {...props} />
));
NestedUnorderedList.displayName = "NestedUnorderedList";

interface NestedOrderedListProps extends Omit<OrderedListProps, "className"> {
	className?: string;
}

const NestedOrderedList = React.forwardRef<
	HTMLOListElement,
	NestedOrderedListProps
>(({ className, ...props }, ref) => (
	<OrderedList ref={ref} className={cn("ml-4", className)} {...props} />
));
NestedOrderedList.displayName = "NestedOrderedList";

export {
	UnorderedList,
	OrderedList,
	DescriptionList,
	ListItem,
	DescriptionItem,
	NestedUnorderedList,
	NestedOrderedList,
};

export type {
	UnorderedListProps,
	OrderedListProps,
	DescriptionListProps,
	ListItemProps,
	DescriptionItemProps,
	NestedUnorderedListProps,
	NestedOrderedListProps,
};

export {
	baseListVariants,
	unorderedListVariants,
	orderedListVariants,
	descriptionListVariants,
};
