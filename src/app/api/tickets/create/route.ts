import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

type TicketBody = {
  eventId: number;
  section: number;
  row: number;
  seat: number;
  price: number;
  type: boolean;
};

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as TicketBody;

    const newTicket = await prisma.ticket.create({
      data: {
        eventId: body.eventId,
        section: body.section,
        row: body.row,
        seat: body.seat,
        price: body.price,
        seller: session.user.username,
        isStanding: body.type,
      },
    });

    return NextResponse.json(newTicket);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
