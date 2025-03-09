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
  if (!session || !session.user?.username || !session.user.isMember) {
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

    const newTicket = await prisma.ticket.create({
      data: {
        eventId: body.eventId,
        section: body.section,
        row: body.row,
        seatFrom: body.seatFrom,
        seatTo: body.seatTo,
        price: body.price,
        seller: session.user.username,
        isStanding: body.type,
        note: body.note,
        count: body.count,
      },
      include: { event: true },
    });

    await fetch(
      "https://discord.com/api/webhooks/1347955350195929088/8bOudKDzusU5LQVPllbs236I4UZVCWPhCCi6pDJvoJ9zG1YH0NXSg0zZESO5H091BJ5T",
      {
        method: "POST",
        body: JSON.stringify({
          embeds: [
            {
              id: 652627557,
              title: "Nový lístok na predaj",
              description: `👤 Meno: <@${session.user.id}>\n🎤 Akcia: ${
                newTicket.event.name
              }\n🎫 Typ lístka: ${
                newTicket.isStanding ? "Stánie" : "Sedenie"
              }\n ${
                !newTicket.isStanding ? `🪑 Sekcia: ${newTicket.section}\n` : ""
              }\nPočet kusov: ${
                newTicket.isStanding
                  ? `${newTicket.count} ks`
                  : `${
                      newTicket.seatTo! - newTicket.seatFrom! + 1
                    } ks (pri sebe)`
              }\nCena: ${newTicket.price}€`,
              color: "f26d00",
              fields: [],
            },
          ],
        }),
      }
    );

    return NextResponse.json(newTicket);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
