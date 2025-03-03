"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

type Props = {};

export default function LoginButton({}: Props) {
  return (
    <Button size="lg" onClick={() => signIn("discord")}>
      Sign In with discord
    </Button>
  );
}
