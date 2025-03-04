import CreateTicketForm from "@/components/create-ticket-form";
import { prisma } from "@/lib/prisma";
import React from "react";

type Props = {};

export default async function Page({}: Props) {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <CreateTicketForm events={events} />
      </div>
    </div>
  );
}
