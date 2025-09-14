import React from "react";
import Navbar from "./components/navbar";

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen mx-auto flex flex-col max-w-screen-xl">
      <Navbar />
      {children}
    </main>
  );
}
