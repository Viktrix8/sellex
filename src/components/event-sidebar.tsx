"use client";

import React from "react";
import { Sidebar, SidebarContent } from "./ui/sidebar";
import Image from "next/image";
import { useTicketStore } from "@/store";

type Props = {};

export default function EventSidebar({}: Props) {
  const { ticket } = useTicketStore();

  if (!ticket) return null;

  return (
    <Sidebar side="left" className="-z-1">
      <SidebarContent className="p-4 mt-16">
        <div className="w-full flex flex-col">
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={"/o2-praha/" + ticket.section + ".png"}
              alt="view"
              fill
              className="rounded-lg"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
        <div>
          <p>Sekcia: {ticket.section}</p>
          <p>Rada: {ticket.row}</p>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
