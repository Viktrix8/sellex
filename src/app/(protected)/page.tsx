export const dynamic = "force-dynamic";

import EventsList from "@/components/events-list";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const events = await prisma.event.findMany({
    include: {
      tickets: {
        select: {
          id: true,
        },
      },
    },
    orderBy: [
      {
        date: "asc",
      },
    ],
  });

  return (
    <div>
      <h2 className="text-2xl">Aktuálne eventy</h2>
      <EventsList events={events} />
    </div>
  );
}
