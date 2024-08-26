"use client";
import React, { useContext, useEffect, useState } from "react";
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
import axios, { AxiosError } from "axios";
import { useToast } from "../ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { PasswordContext } from "@/store/passwordContext";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function DisplayTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set()
  );
  const [isMpinVerified, setIsMpinVerified] = useState(false);
  const { passwords, storePasswords } = useContext(PasswordContext);

  useEffect(() => {
    storePasswords();
  }, [passwords]);

  const { toast } = useToast();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 3 } },
  });

  const verifyMPin = async (pin: string) => {
    try {
      const response = await axios.post("/api/verify-mpin", { mpin: pin });
      if (!response.data.success) {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
        return;
      }
      setIsMpinVerified(true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = async (cellId: string) => {
    let pin: string | null;
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cellId)) {
        newSet.delete(cellId);
      } else {
        if (pin == null) {
          pin = window.prompt("Please enter your mPin: ");
          (async () => {
            await verifyMPin(pin!);
          })();
        }
        newSet.add(cellId);
      }
      return newSet;
    });
  };

  const handleDeletePasswords = async (passwordSelected: string) => {
    const selectedPassword = passwords.filter(
      (item) => (item as any).password === passwordSelected
    );
    const id = (selectedPassword[0] as any)._id;

    try {
      const response = await axios.delete(
        `/api/delete-application-password/${id}`
      );
      if (!response.data.success) {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }

      toast({
        title: "Password deleted successfully",
        description: "Your password has been deleted.",
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      storePasswords();
    }
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
                          <div className="flex gap-2 md:gap-0 items-center justify-between">
                            <span>
                              {visiblePasswords.has(cellId) && isMpinVerified
                                ? (cell.getValue() as string)
                                : "************"}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => togglePasswordVisibility(cellId)}
                                className="bg-transparent rounded-full"
                                size="icon"
                                variant={"outline"}
                              >
                                {visiblePasswords.has(cellId) &&
                                isMpinVerified ? (
                                  <EyeOff className="h-[1.2rem] w-[1.2rem]" />
                                ) : (
                                  <Eye className="h-[1.2rem] w-[1.2rem]" />
                                )}
                              </Button>
                              <Button
                                onClick={() =>
                                  handleDeletePasswords(
                                    cell.getValue() as string
                                  )
                                }
                                className="rounded-full bg-transparent hover:bg-red-600"
                                size={"icon"}
                                variant={"outline"}
                              >
                                <Trash2 className="h-[1.2rem] w-[1.2rem]" />
                              </Button>
                            </div>
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
