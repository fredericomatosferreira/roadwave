import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoadWave — Live Embeddable Roadmaps",
  description:
    "Create Kanban-style roadmaps that auto-update inside iframes embedded in GitBook, Notion, or any documentation site.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
