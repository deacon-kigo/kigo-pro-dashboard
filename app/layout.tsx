import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import AIChat from "../components/shared/AIChat";
import { DemoProvider } from "../contexts/DemoContext";
import DemoSelector from "../components/demo/DemoSelector";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kigo Pro Dashboard",
  description: "Professional dashboard for Kigo Pro services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DemoProvider>
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
            <DemoSelector />
          </div>
        </DemoProvider>
      </body>
    </html>
  );
}
