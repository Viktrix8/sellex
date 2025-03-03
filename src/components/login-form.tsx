"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";
import React from "react";
import { signIn } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [input, setInput] = React.useState<string>("");

  const correctPassword = process.env.NEXT_PUBLIC_PASSWORD;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Prihlás sa do platformy</CardTitle>
          <CardDescription>
            Použi svoj discord účet a heslo na prihlásenie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    id="password"
                    type="password"
                    required
                    autoFocus
                  />
                  {correctPassword == input ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <XCircle className="text-red-500" />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  disabled={input !== correctPassword}
                  onClick={() => signIn("discord")}
                  className="w-full"
                >
                  Login with Discord
                </Button>
              </div>
            </div>
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
