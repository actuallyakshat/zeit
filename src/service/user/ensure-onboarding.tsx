"use client";

import CalculationDetailsForm from "@/app/(dashboard)/settings/components/calculation-details-form";
import { useAuth } from "@/context/AuthProvider";

export function EnsureOnboarding({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex-1 border-x border-dashed"></div>;

  if (!Number(user?.monthlyIncome) || isNaN(Number(user?.monthlyIncome))) {
    return <CalculationDetailsForm />;
  }

  return <>{children}</>;
}
