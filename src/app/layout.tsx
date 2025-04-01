import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/redux/provider";
import URLSyncProvider from "@/lib/providers/URLSyncProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kigo PRO Dashboard",
  description: "Enterprise customer experience management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <URLSyncProvider>
            {children}
          </URLSyncProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
