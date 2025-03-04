import { auth } from "@/auth";
import TicketsTable from "@/components/tickets-table";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import React from "react";

type Props = {};

export default async function Page({}: Props) {
  const session = await auth();

  if (!session?.user?.username) return notFound();

  const tickets = await prisma.ticket.findMany({
    where: {
      seller: session?.user?.username,
    },
    include: {
      event: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div>
      <h2 className="text-2xl mb-2 ">Moje lístky</h2>
      <hr className="my-4" />
      <TicketsTable data={tickets} />
    </div>
  );
}
