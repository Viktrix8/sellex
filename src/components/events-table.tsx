"use client";

import { Event } from "@prisma/client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { toast } from "sonner";

type Props = {
  data: Event[];
};

export default function EventsTable({ data }: Props) {
  const [events, setEvents] = React.useState(data);
  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "name",
      header: "Názov eventu",
    },
    {
      accessorKey: "date",
      header: "Dátum",
      cell: ({ row }) => (
        <div>{new Date(row.original.date).toLocaleDateString()}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          onClick={() => removeEvent(row.original.id)}
          className="bg-red-500 cursor-pointer"
          variant="destructive"
        >
          Delete
        </Button>
      ),
    },
  ];

  const removeEvent = async (id: number) => {
    try {
      const res = await fetch("/api/events/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error();

      setEvents((prev) => prev.filter((event) => event.id !== id));
      toast.success("Event úspešne vymazaný.");
    } catch (error) {
      console.log(error);
      toast.error("Nepodarilo sa vymazať event.");
    }
  };

  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
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
    </div>
  );
}
