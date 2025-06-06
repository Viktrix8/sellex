import React from "react";
import { Loader2 } from "lucide-react";

export default function loading() {
  return (
    <div className="items-center justify-center flex h-screen w-screen">
      <Loader2 size={100} className="animate-spin" />
    </div>
  );
}
