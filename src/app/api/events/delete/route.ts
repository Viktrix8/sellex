import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

type TicketBody = {
  id: number;
};

export async function DELETE(req: Request) {
  const session = await auth();

  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as TicketBody;

    await prisma.event.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
