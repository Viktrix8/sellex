import Navbar from "@/components/navbar";
import FooterSection from "@/components/sections/footer/default";
import Head from "next/head";
import Script from "next/script";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8435095568140595"
          crossOrigin="anonymous"
        ></Script>
      </Head>
      <Navbar />
      <div className="container mx-auto p-4">{children}</div>
      <FooterSection />
    </>
  );
}
