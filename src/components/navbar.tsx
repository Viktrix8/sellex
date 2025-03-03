import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./theme-toggle";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <div className="flex items-center sticky top-0 z-10 p-4">
      <Link href="/" prefetch className="font-bold flex-1 text-2xl">
        Sellex
      </Link>

      <div className="flex items-center gap-x-4 text-sm">
        <Link href="#">Predat</Link>
        <Link href="#">Predat</Link>
        <ThemeToggle />
      </div>
    </div>
  );
}
