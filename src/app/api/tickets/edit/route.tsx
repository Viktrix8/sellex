import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

type TicketBody = {
  id: number;
  price: string;
};

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as TicketBody;

    const ticket = await prisma.ticket.findUniqueOrThrow({
      where: {
        id: body.id,
      },
    });

    if (ticket.seller !== session.user.username)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const newTicket = await prisma.ticket.update({
      where: {
        id: body.id,
      },
      data: {
        price: Number(body.price),
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
