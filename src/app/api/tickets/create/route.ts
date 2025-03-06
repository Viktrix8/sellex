import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

type TicketBody = {
  eventId: number;
  section: number;
  row: number;
  seatFrom: number;
  seatTo: number;
  price: number;
  type: boolean;
  note: string | null;
  count: number | null;
};

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as TicketBody;

    if (body.seatFrom > body.seatTo) {
      return NextResponse.json(
        { error: "Invalid seat range" },
        { status: 400 }
      );
    }

    const ticketsData = [];
    for (let seat = body.seatFrom; seat <= body.seatTo; seat++) {
      ticketsData.push({
        eventId: body.eventId,
        section: body.section,
        row: body.row,
        seat: seat,
        price: body.price,
        seller: session.user.username,
        isStanding: body.type,
        note: body.note,
        count: body.count,
      });
    }

    const newTickets = await prisma.ticket.createMany({
      data: ticketsData,
    });

    return NextResponse.json(newTickets);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
