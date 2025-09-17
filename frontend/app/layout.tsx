import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personalized Sales Outreach Agent",
  description: "Generate personalized sales outreach emails and voice notes",
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