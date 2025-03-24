import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import AIChat from "../components/shared/AIChat";
import DemoSpotlight from "../components/demo/DemoSpotlight";
import { ReduxProvider } from "@/lib/redux/provider";
import AppStateProvider from "@/lib/redux/AppStateProvider";
import { DemoProvider } from "@/contexts/DemoContext";

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
          <DemoProvider>
            <AppStateProvider>
              <div className="flex min-h-screen bg-bg-light">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main 
                    className="pt-[72px] p-6 min-h-screen overflow-auto transition-all duration-300"
                    style={{ paddingLeft: 'calc(var(--sidebar-width) + 1.5rem)' }}
                  >
                    {children}
                  </main>
                </div>
                <AIChat />
                <DemoSpotlight />
              </div>
            </AppStateProvider>
          </DemoProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
