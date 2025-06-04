"use client";
import BottomBar from "@/components/bottomBar";
import { UserProvider } from "@/providers/UserProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen min-h-full w-screen flex-col overflow-y-auto overflow-x-hidden">
          <UserProvider>{children}</UserProvider>
        </div>
        <BottomBar />
      </body>
    </html>
  );
}
