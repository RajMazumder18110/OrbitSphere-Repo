/** @notice Local imports */
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
/// Local imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";

type Instance = {
  id: string;
  instanceId: string;
  region: string;
  instanceType: string;
  status: "RUNNING" | "TERMINATED";
};

/// Props
interface InstancesTableProps {
  data: Instance[];
  isTerminated: boolean;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
}

export function InstancesTable({
  // columns,
  data,
  isTerminated,
  rowSelection,
  setRowSelection,
}: InstancesTableProps) {
  const columns: ColumnDef<Instance>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className={isTerminated ? "hidden" : ""}
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className={isTerminated ? "hidden" : ""}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ cell }) => (
        <div className="flex items-center gap-1">
          <MdOutlineRadioButtonChecked
            className={`${
              isTerminated ? "text-red-500" : "text-green-500"
            } text-sm`}
          />
          <h1 className="">{capitalize(cell.getValue() as string)}</h1>
        </div>
      ),
    },
    {
      accessorKey: "instanceId",
      header: "Instance ID",
      cell: ({ cell }) => (
        <Link href={`/dashboard/${cell.getValue() as string}`}>
          <Button className="cursor-pointer h-7" variant="link">
            {cell.getValue() as string}
          </Button>
        </Link>
      ),
    },

    {
      accessorKey: "id",
      header: "Sphere",
    },
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      accessorKey: "instanceType",
      header: "Type",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-2 gray-border">
      <Table className="dark text-md text-gray-300">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {!isTerminated && (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} sphere(s) selected.
        </div>
      )}
    </div>
  );
}
