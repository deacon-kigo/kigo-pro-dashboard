import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";
import { Providers } from "@/lib/providers";
import URLSyncProvider from "@/lib/providers/URLSyncProvider";
import { Toaster } from "@/components/molecules/Toaster";

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
        <Providers>
          <URLSyncProvider>
            <Suspense
              fallback={
                <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                      Loading Kigo PRO Dashboard...
                    </p>
                  </div>
                </div>
              }
            >
              {children}
            </Suspense>
          </URLSyncProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
