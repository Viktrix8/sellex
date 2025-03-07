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
  isMember: boolean;
};

export default function TicketsList({ tickets, isMember }: Props) {
  const [sort, setSort] = React.useState<string>("asc");
  const [sit, setSit] = React.useState<string>("sta+sit");
  const [sortedTickets, setSortedTickets] = React.useState<Ticket[]>(tickets);

  React.useEffect(() => {
    let filteredTickets = tickets.filter((ticket) => {
      if (sit === "sit") return !ticket.isStanding;
      if (sit === "sta") return ticket.isStanding;
      return true;
    });

    filteredTickets = filteredTickets.sort((a, b) =>
      sort === "asc" ? a.price - b.price : b.price - a.price
    );

    setSortedTickets(filteredTickets);
  }, [sort, sit, tickets]);

  return (
    <div>
      <div className="flex gap-4">
        <Select onValueChange={(value) => setSort(value)} defaultValue={sort}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="asc">Cena vzostupne</SelectItem>
              <SelectItem value="desc">Cena zostupne</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSit(value)} defaultValue="sta+sit">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="sta+sit">Sedenie + Stánie</SelectItem>
              <SelectItem value="sit">Iba sedenie</SelectItem>
              <SelectItem value="sta">Iba stánie</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
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
                {!ticket.isStanding ? (
                  <>
                    <CardDescription>
                      Sekcia {ticket.section} · Rada {ticket.row}
                    </CardDescription>
                    {isMember ? (
                      <CardDescription>
                        Sedadlo{" "}
                        {ticket.seatFrom !== undefined &&
                          ticket.seatTo !== undefined &&
                          Array.from(
                            { length: ticket.seatTo! - ticket.seatFrom! + 1 },
                            (_, index) => ticket.seatFrom! + index
                          ).map((seatNumber, index, arr) => (
                            <span key={seatNumber}>
                              {seatNumber}
                              {index < arr.length - 1 ? ", " : ""}
                            </span>
                          ))}
                      </CardDescription>
                    ) : (
                      <CardDescription>
                        {ticket.seatTo! - ticket.seatFrom! + 1} ks pri sebe
                      </CardDescription>
                    )}
                  </>
                ) : (
                  <>
                    <CardDescription>{ticket.note}</CardDescription>
                    <CardDescription>{ticket.count} ks </CardDescription>
                  </>
                )}
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
