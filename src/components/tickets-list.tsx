"use client";

import { Ticket } from "@prisma/client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  tickets: Ticket[];
};

export default function TicketsList({ tickets }: Props) {
  const [sort, setSort] = React.useState<string>("asc");
  const [sortedTickets, setSortedTickets] = React.useState<Ticket[]>(tickets);

  React.useEffect(() => {
    if (sort == "desc")
      setSortedTickets((prev) => prev.sort((a, b) => a.price - b.price));
    else setSortedTickets((prev) => prev.sort((a, b) => b.price - a.price));
  }, [sort, tickets]);

  return (
    <div>
      <Select onValueChange={(value) => setSort(value)} defaultValue={sort}>
        <SelectTrigger>
          <SelectValue placeholder="Cena zostupne" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="desc">Cena zostupne</SelectItem>
            <SelectItem value="asc">Cena vzostupne</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="gap-4 flex flex-wrap mt-4">
        {sortedTickets.length > 0 ? (
          sortedTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="hover:border-blue-500 hover:duration-500 hover:transition-all w-full md:max-w-xs"
            >
              <CardHeader>
                <CardTitle>
                  <span className="text-blue-500">@{ticket.seller}</span>
                </CardTitle>
                <CardDescription>
                  Sekcia {ticket.section} · Rada {ticket.row} · Sedadlo{" "}
                  {ticket.seat}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">{ticket.price} EUR</CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground text-center w-full">
            Nie sú dostupné žiadne tickety.
          </p>
        )}
      </div>
    </div>
  );
}
