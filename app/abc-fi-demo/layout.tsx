import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ABC FI Banking Demo - Customer Journey",
  description:
    "Interactive AI-powered banking demo showcasing Sarah's relocation journey",
};

export default function ABCFIDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Hide scrollbars globally for ABC FI demo */
          * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          *::-webkit-scrollbar {
            display: none !important;
          }
          /* Ensure content is still scrollable */
          .abc-fi-scrollable {
            overflow-y: scroll;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .abc-fi-scrollable::-webkit-scrollbar {
            display: none;
          }
        `,
        }}
      />
      <div className={`${inter.className} antialiased`}>
        {/* Standalone layout - no CopilotKit or global providers */}
        {children}
      </div>
    </>
  );
}
