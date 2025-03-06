"use client";

import { Event } from "@prisma/client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import Link from "next/link";

type Props = {
  events: ExtendedEvent[];
};

type ExtendedEvent = {
  tickets: {
    id: number;
  }[];
} & Event;

export default function EventsList({ events }: Props) {
  const [input, setInput] = React.useState<string>("");
  const [filteredEvents, setEvents] = React.useState<ExtendedEvent[]>(events);

  React.useEffect(() => {
    if (input) {
      const filtered = events.filter((event) =>
        event.name.toLowerCase().includes(input.toLowerCase())
      );
      setEvents(filtered);
    } else {
      setEvents(events);
    }
  }, [input, events]);

  return (
    <div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Hľadaj event..."
        className="mb-4 mt-1"
      />
      <hr className="my-2 mb-4" />
      <div className="gap-4 flex flex-wrap">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Link
              href={`/event/${event.id}`}
              key={event.id}
              className="w-full md:max-w-xs "
            >
              <Card className="hover:border-blue-500 hover:duration-500 hover:transition-all">
                <CardHeader>
                  <CardTitle className="text-blue-500">{event.name}</CardTitle>
                  <CardDescription>
                    {event.tickets.length} dostupných ticketov
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  {new Date(event.date).toLocaleDateString("sk-sk")}
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p className="text-muted-foreground text-center w-full">
            Žiadne eventy sa nenašli.
          </p>
        )}
      </div>
    </div>
  );
}
