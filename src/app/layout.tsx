import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Philadelphia Vacant Property Finder",
  description: "Search municipal vacancy data by ZIP code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
