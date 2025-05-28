import { create } from "zustand";
import { Ticket } from "@prisma/client";

interface TicketStore {
  ticket: Ticket | null;
  setTicket: (ticket: Ticket) => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
  ticket: null,
  setTicket: (ticket: Ticket) => set({ ticket }),
}));
