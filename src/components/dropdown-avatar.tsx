import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { User } from "next-auth";

type Props = {
  user: User;
};

export default function DropdownAvatar({ user }: Props) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        {user.image ? (
          <Image alt="profile" src={user.image} width={35} className="rounded-full" height={35} />
        ) : (
          <img
            alt="profile"
            src={"https://ui-avatars.com/api/?name=Guest"}
            width={35}
            className="rounded-full"
            height={35}
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="font-bold">@{user.username}</DropdownMenuLabel>
        {user.email && <DropdownMenuLabel>{user.email}</DropdownMenuLabel>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark Mode</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light")}>Light Mode</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="text-red-600 font-bold">
          Odhlásiť sa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
