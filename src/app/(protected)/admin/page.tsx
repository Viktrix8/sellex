export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import CreateEventButton from "@/components/create-event-button";
import EventsTable from "@/components/events-table";
import TicketsTable from "@/components/tickets-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function Page() {
  const events = await prisma.event.findMany();
  const tickets = await prisma.ticket.findMany({
    include: {
      event: true,
    },
  });

  return (
    <div>
      <Tabs defaultValue="events">
        <TabsList className="w-full">
          <TabsTrigger value="tickets">Tickety</TabsTrigger>
          <TabsTrigger value="events">Eventy</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets">
          <TicketsTable hideEdit showSeller data={tickets} />
        </TabsContent>
        <TabsContent value="events">
          <CreateEventButton />
          <EventsTable data={events} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
