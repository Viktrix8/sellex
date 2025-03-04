"use client";

import Link from "next/link";
import React from "react";
import DropdownAvatar from "./dropdown-avatar";
import { useSession } from "next-auth/react";
type Props = {};

export default function Navbar({}: Props) {
  const { data } = useSession();

  if (!data?.user) return null;
  return (
    <div className="flex items-center sticky top-0 p-2 z-10 px-6 border-b dark:bg-black bg-white">
      <Link href="/" prefetch className="font-bold flex-1 text-2xl">
        Sellex
      </Link>

      <div className="flex items-center gap-x-4 text-sm">
        <Link href="/sell">Pridať Lístok</Link>
        <Link href="/me">Moje Lístky</Link>
        {data.user.isAdmin && <Link href="/admin">Admin</Link>}
        <DropdownAvatar user={data.user} />
      </div>
    </div>
  );
}
