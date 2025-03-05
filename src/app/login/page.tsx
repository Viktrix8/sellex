import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import React from "react";

export default function Page() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative bg-[#2F2F2F] hidden brightness-90 lg:flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Image"
          height={400}
          width={400}
          className="object-cover"
        />
      </div>
    </div>
  );
}
