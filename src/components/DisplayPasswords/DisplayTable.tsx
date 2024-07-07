"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Eye, EyeOff, Trash2 } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function DisplayTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 3 } },
  });

  const togglePasswordVisibility = (cellId: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cellId)) {
        newSet.delete(cellId);
      } else {
        newSet.add(cellId);
      }
      return newSet;
    });
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
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
                  {row.getVisibleCells().map((cell) => {
                    const isPasswordCell = cell.column.id === "password"; // Assuming password column id is "password"
                    const cellId = `${row.id}-${cell.id}`;
                    return (
                      <TableCell key={cell.id} className="">
                        {isPasswordCell ? (
                          <div className="flex items-center justify-between">
                            <span>
                              {visiblePasswords.has(cellId)
                                ? cell.getValue() as string
                                : "************"}
                            </span>
                            <Button
                              onClick={() => togglePasswordVisibility(cellId)}
                              className="bg-transparent rounded-full"
                              size="icon"
                              variant={"outline"}
                            >
                              {visiblePasswords.has(cellId) ? (
                                <EyeOff className="h-[1.2rem] w-[1.2rem]" />
                              ) : (
                                <Eye className="h-[1.2rem] w-[1.2rem]" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </TableCell>
                    );
                  })}
                  <Button className="rounded-full bg-transparent md:mt-[15px] hover:bg-red-600" size={"icon"} variant={"outline"}>
                    <Trash2 className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default DisplayTable;
