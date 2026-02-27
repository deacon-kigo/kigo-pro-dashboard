import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RE/MAX Demo - Customer Journey",
  description:
    "Interactive AI-powered demo showcasing Jessica's new homeowner journey with RE/MAX",
};

export default function REMAXDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Hide scrollbars globally for RE/MAX demo */
          * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          *::-webkit-scrollbar {
            display: none !important;
          }
          /* Ensure content is still scrollable */
          .remax-scrollable {
            overflow-y: scroll;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .remax-scrollable::-webkit-scrollbar {
            display: none;
          }
        `,
        }}
      />
      <div className={`${inter.className} antialiased`}>
        {/* Standalone layout - no AppLayout or global providers */}
        {children}
      </div>
    </>
  );
}
