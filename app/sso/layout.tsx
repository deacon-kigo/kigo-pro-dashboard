"use client";

import "../globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/molecules/Toaster";

const inter = Inter({ subsets: ["latin"] });

export default function SSOLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
