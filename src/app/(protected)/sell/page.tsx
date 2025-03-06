export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import CreateTicketForm from "@/components/create-ticket-form";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function Page() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      name: true,
      date: true,
    },
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <CreateTicketForm events={events} />
      </div>
    </div>
  );
}
