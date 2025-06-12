"use client";
import BottomBar from "@/components/bottomBar";
import TopBar from "@/components/topBar";
import { UserProvider } from "@/providers/UserProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body>
          <TopBar />
          <div className="flex h-screen min-h-full w-screen flex-col overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </body>
        <BottomBar />
      </UserProvider>
    </html>
  );
}
