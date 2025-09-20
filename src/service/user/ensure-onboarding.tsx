"use client";

import Header from "@/app/(dashboard)/components/header";
import { StatsSkeleton } from "@/app/(dashboard)/list/page";
import CalculationDetailsForm from "@/app/(dashboard)/settings/components/calculation-details-form";
import { SeparatorBorder } from "@/components/ui/seperator";
import { useAuth } from "@/context/AuthProvider";
import { Suspense } from "react";

export function EnsureOnboarding({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex-1 border-x border-dashed">
    <Suspense>
      <Header />
      <StatsSkeleton />
      <SeparatorBorder className="h-12" />
    </Suspense>
  </div>;

  if (!Number(user?.monthlyIncome) || isNaN(Number(user?.monthlyIncome))) {
    return <CalculationDetailsForm />;
  }

  return <>{children}</>;
}
