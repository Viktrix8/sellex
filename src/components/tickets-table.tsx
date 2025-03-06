"use client";

import { z } from "zod";
import { Ticket } from "@prisma/client";
import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Hammer, MoreHorizontal, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  data: Ticket[];
  showSeller: boolean;
  hideEdit: boolean;
};

const FormSchema = z.object({
  price: z
    .string({ required_error: "Napíš prosím cenu." })
    .min(1, "Cena nemôže byť prázdna.")
    .regex(/^\d+(\.\d+)?$/, "Cena musí byť číslo."),
});

export default function TicketsTable({
  data,
  showSeller = false,
  hideEdit = false,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(data);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      price: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { price } = data;

    if (!selectedTicket) return;

    try {
      const res = await fetch("/api/tickets/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: price,
          id: selectedTicket.id,
        }),
      });

      if (!res.ok) throw new Error();

      form.reset();
      toast.success("Lístok úspešne upravený.");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Bol problém s upravovaním lístka.");
    }
  };

  const deleteTicket = async (id: number) => {
    try {
      const res = await fetch("/api/tickets/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error();

      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== id)
      );

      toast.success("Lístok úspešne vymazaný.");
    } catch (error) {
      console.log(error);
      toast.error("Bol problém s vymazávaním lístka.");
    }
  };

  const openDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
  };

  const baseColumns: ColumnDef<Ticket>[] = [
    { accessorKey: "event.name", header: "Meno eventu" },
    {
      accessorKey: "section",
      header: "Sekcia",
      cell: ({ row }) =>
        row.original.isStanding
          ? row.original.note || "STANIE"
          : row.getValue("section") || "-",
    },
    {
      accessorKey: "row",
      header: "Rad",
      cell: ({ row }) =>
        row.original.isStanding ? "-" : row.getValue("row") || "-",
    },
    {
      accessorKey: "seatFrom",
      header: "Sedadlo od",
      cell: ({ row }) =>
        row.original.isStanding ? "-" : row.getValue("seatFrom") || "-",
    },
    {
      accessorKey: "seatTo",
      header: "Sedadlo do",
      cell: ({ row }) =>
        row.original.isStanding ? "-" : row.getValue("seatTo") || "-",
    },
    {
      accessorKey: "count",
      header: "Počet",
      cell: ({ row }) => {
        const count = row.original.count ?? 1;

        return row.original.isStanding ? count : count > 0 ? count : 1;
      },
    },

    {
      accessorKey: "price",
      header: () => <div className="text-right">Cena</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("sk-sk", {
          style: "currency",
          currency: "EUR",
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
  ];

  const actionColumn: ColumnDef<Ticket> = {
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel asChild>
              <p className="p-2 text-sm flex items-center gap-2">
                <Hammer width={12} height={12} />
                Akcie
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!hideEdit && (
              <DropdownMenuItem asChild onClick={() => openDialog(ticket)}>
                <p className="p-2 text-sm flex items-center gap-2">
                  <Pencil width={12} height={12} />
                  Upraviť
                </p>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild onClick={() => deleteTicket(ticket.id)}>
              <p className="p-2 text-red-500 text-sm cursor-pointer flex items-center gap-2">
                <X width={12} className="text-red-500" height={12} />
                Vymazať
              </p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  const columns = [
    ...baseColumns,
    ...(showSeller ? [{ accessorKey: "seller", header: "Seller" }] : []),
    actionColumn,
  ];

  const table = useReactTable({
    data: tickets,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
                Neboli nájdene žiadne lístky.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upraviť cenu</DialogTitle>
            <DialogDescription>Zmeň cenu ticketu.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex flex-col gap-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cena</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} className="pr-10" />
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                          €
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting
                  ? "Upravuje sa..."
                  : "Uprav Ticket"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
