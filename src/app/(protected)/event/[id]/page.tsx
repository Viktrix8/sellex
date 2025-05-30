export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import TicketsList from "@/components/tickets-list";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";
import { differenceInDays } from "date-fns";
import { auth } from "@/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import EventSidebar from "@/components/event-sidebar";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      tickets: {
        orderBy: [
          {
            section: "asc",
          },
          {
            row: "asc",
          },
          {
            seatFrom: "asc",
          },
          {
            price: "asc",
          },
        ],
      },
    },
  });

  if (!event) notFound();

  return (
    <SidebarProvider defaultOpen={false}>
      <EventSidebar />
      <div className="flex-1">
        <div className="text-center">
          <h2 className="text-4xl font-bold mt-8">{event.name}</h2>
          <p className="text-xl text-muted-foreground">
            {new Date(event.date).toLocaleDateString("sk-sk")} -{" "}
            {differenceInDays(new Date(event.date), new Date()) + 1} dní do začiatku
          </p>
        </div>
        <h2 className="text-2xl mt-4">Dostupné lístky - {event.tickets.length}</h2>
        <hr className="my-4" />
        <TicketsList isMember={session!.user.isMember} tickets={event.tickets} />
      </div>
    </SidebarProvider>
  );
}
