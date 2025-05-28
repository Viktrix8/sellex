"use client";

import Link from "next/link";
import React from "react";
import DropdownAvatar from "./dropdown-avatar";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data } = useSession();

  if (!data?.user) return null;
  return (
    <div className="flex items-center sticky top-0 p-2 z-10 px-6 border-b dark:bg-black bg-white">
      <Link href="/" prefetch className="font-bold flex-1 text-2xl flex items-center gap-2">
        <Image src="/logo.png" className="rounded-md" width={35} height={35} alt="logo" />
        Sellex
      </Link>

      <div className="flex items-center gap-x-4 text-sm">
        {data.user.isMember && (
          <>
            <Link href="/sell">Pridať Lístok</Link>
            <Link href="/me">Moje Lístky</Link>
          </>
        )}
        {data.user.isAdmin && <Link href="/admin">Admin</Link>}
        <DropdownAvatar user={data.user} />
      </div>
    </div>
  );
}
