import React from "react";
import {
	ColumnDef,
	SortingState,
	useReactTable,
	ColumnFiltersState,
	getCoreRowModel,
	flexRender,
	getFilteredRowModel,
	getSortedRowModel,
	getPaginationRowModel,
} from "@tanstack/react-table";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "./table";
import { Button } from "./button";
import { Input } from "./input";
// import { cn } from "@src/lib/utils";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

interface DataTableOptionalProps<TData> {
	showFilter?: boolean;
	rowSize?: number;
	tableRowClassName?: string;
	tableHeaderClassName?: string;
	onRowClick?: (project: TData) => void;
}

type TDataTableProps<TData, TValue> = DataTableProps<TData, TValue> &
	DataTableOptionalProps<TData>;

export default function DataTable<TData, TValue>({
	columns,
	data,
	onRowClick,
}: TDataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const PAGE_SIZE = 10;
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			rowSelection,
		},
	});

	return (
		<div>
			<div className="overflow-hidden rounded-md">
				{data.length > 20 && (
					<div className="flex items-center py-4">
						<Input
							className="max-w-sm"
							placeholder="Filter..."
							onChange={(event) => {
								table.getColumn("name")?.setFilterValue(event.target.value);
							}}
						/>
					</div>
				)}
				<Table className="border-none border-0">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow className="border-none border-0" key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="border-none border-0"
									onClick={() => {
										if (onRowClick) onRowClick(row.original);
									}}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow className="border-none border-0">
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No data available
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="text-muted-foreground flex-1 text-sm">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				{data.length >= PAGE_SIZE && (
					<React.Fragment>
						<Button
							variant={"outline"}
							size={"sm"}
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<Button
							variant={"outline"}
							size={"sm"}
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</React.Fragment>
				)}
			</div>
		</div>
	);
}
