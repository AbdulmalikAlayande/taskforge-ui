import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@src/lib/utils";

// List Variants
const listVariants = cva("", {
	variants: {
		type: {
			unordered: "list-disc pl-6",
			ordered: "list-decimal pl-6",
			description: "space-y-2",
		},
		orientation: {
			vertical: "flex flex-col",
			horizontal: "flex flex-row gap-4",
		},
	},
	defaultVariants: {
		type: "unordered",
		orientation: "vertical",
	},
});

// List Props
interface ListProps
	extends React.HTMLAttributes<
			HTMLUListElement | HTMLOListElement | HTMLDListElement
		>,
		VariantProps<typeof listVariants> {
	as?: "ul" | "ol" | "dl";
	selectable?: boolean;
}

// List Component
/**
 * A polymorphic List component that can render as `<ul>`, `<ol>`, or `<dl>`,
 * supporting different list types and orientations.
 *
 * @remarks
 * The `List` component uses `React.forwardRef` with a union of three element types:
 * `HTMLUListElement`, `HTMLOListElement`, and `HTMLDListElement`. This may cause type errors
 * in some cases because the ref type is not a single element type.
 *
 * @ts-expect-error The error occurs because we are joining three types of elements (ul, ol, dl) in the ref.
 *
 * @param props - The props for the List component.
 * @param props.as - The HTML tag to render as: "ul", "ol", or "dl". Defaults to "ul".
 * @param props.type - The type of list: "ordered", "unordered", or "description".
 * @param props.orientation - The orientation of the list.
 * @param props.selectable - Whether the list is selectable. Defaults to false.
 * @param props.className - Additional class names to apply.
 * @param props.children - The list items or content.
 * @param ref - The forwarded ref for the list element.
 *
 * @returns The rendered list element.
 */
const List = React.forwardRef<
	HTMLUListElement | HTMLOListElement | HTMLDListElement,
	ListProps
>(
	(
		{
			as = "ul",
			type,
			orientation,
			selectable = false,
			className,
			children,
			...props
		},
		ref
	) => {
		const Tag = as;
		const effectiveType =
			type ||
			(as === "ol" ? "ordered" : as === "dl" ? "description" : "unordered");

		return (
			<Tag
				ref={ref}
				className={cn(
					listVariants({ type: effectiveType, orientation }),
					className
				)}
				role={selectable ? "listbox" : "list"}
				{...props}
			>
				{children}
			</Tag>
		);
	}
);
List.displayName = "List";

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

// NestedList Component
type NestedListProps = Omit<ListProps, "as"> & { as?: "ul" | "ol" };

const NestedList = React.forwardRef<
	HTMLUListElement | HTMLOListElement,
	NestedListProps
>(({ className, as = "ul", ...props }, ref) => (
	<List ref={ref} as={as} className={cn("ml-4", className)} {...props} />
));
NestedList.displayName = "NestedList";

export { List, ListItem, DescriptionItem, NestedList };
export type { ListProps, ListItemProps, DescriptionItemProps, NestedListProps };
export { listVariants as listVariantsClass };
