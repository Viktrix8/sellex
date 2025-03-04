import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

type TicketBody = {
  name: string;
  date: Date;
};

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as TicketBody;

    const newEvent = await prisma.event.create({
      data: {
        name: body.name,
        date: body.date,
      },
    });

    return NextResponse.json(newEvent);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create event." },
      { status: 500 }
    );
  }
}
