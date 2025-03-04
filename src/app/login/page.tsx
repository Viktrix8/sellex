import { LoginForm } from "@/components/login-form";
import React from "react";

type Props = {};

export default function Page({}: Props) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
