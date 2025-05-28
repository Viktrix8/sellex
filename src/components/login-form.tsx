"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { signIn } from "next-auth/react";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Prihlás sa do platformy</CardTitle>
          <CardDescription>Použi svoj discord účet a heslo na prihlásenie</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-3">
                <Button
                  variant="secondary"
                  onClick={() => signIn("credentials")}
                  className="w-full"
                >
                  Pokračovať ako hosť
                </Button>
                <Button onClick={() => signIn("discord")} className="w-full">
                  Prihlásiť sa cez Discord
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              Pripoj sa k nám na{" "}
              <a
                href="https://discord.gg/gEdsWZ4D7y"
                target="_blank"
                className="underline underline-offset-4"
              >
                discord
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
