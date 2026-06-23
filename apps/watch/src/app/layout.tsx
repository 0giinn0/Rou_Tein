import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rou_Tein Watch",
  description: "Quick tasks on your wrist",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col overflow-hidden">{children}</body>
    </html>
  );
}
