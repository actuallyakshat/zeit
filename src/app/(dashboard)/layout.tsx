import React from "react";
import Navbar from "./components/navbar";

export default function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen mx-auto flex flex-col px-5 max-w-screen-lg">
      <Navbar />
      {children}
    </main>
  );
}
