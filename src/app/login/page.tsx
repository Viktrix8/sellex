import LoginButton from "@/components/login-button";
import React from "react";

type Props = {};

export default function Login({}: Props) {
  return (
    <div className="justify-center items-center min-h-screen flex">
      <LoginButton />
    </div>
  );
}
