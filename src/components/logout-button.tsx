"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

type Props = {};

export default function LogoutButton({}: Props) {
  return <Button onClick={() => signOut()}>Sign Out</Button>;
}
