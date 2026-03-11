import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promotion",
};

export default function PublicLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
