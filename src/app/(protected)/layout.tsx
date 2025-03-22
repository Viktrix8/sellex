import Navbar from "@/components/navbar";
import FooterSection from "@/components/sections/footer/default";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">{children}</div>
      <FooterSection />
    </>
  );
}
