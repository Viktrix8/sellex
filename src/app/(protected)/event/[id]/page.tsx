export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import TicketsList from "@/components/tickets-list";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
import { differenceInDays } from "date-fns";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      tickets: {
        orderBy: [
          {
            price: "asc",
          },
          {
            section: "asc",
          },
          {
            row: "asc",
          },
          {
            seat: "asc",
          },
        ],
      },
    },
  });

  if (!event) notFound();

  return (
    <div>
      <div className="text-center">
        <h2 className="text-4xl font-bold mt-8">{event.name}</h2>
        <p className="text-xl text-muted-foreground">
          {new Date(event.date).toLocaleDateString()} -{" "}
          {differenceInDays(new Date(event.date), new Date()) + 1} dní do
          začiatku
        </p>
      </div>
      <h2 className="text-2xl mt-4">
        Dostupné lístky - {event.tickets.length}
      </h2>
      <hr className="my-4" />
      <TicketsList tickets={event.tickets} />
    </div>
  );
}
