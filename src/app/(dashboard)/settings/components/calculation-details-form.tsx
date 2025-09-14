"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthProvider";
import { updateUserCalculationDetails } from "@/service/actions/updateUserInfo";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CalculationDetailsForm() {
  const { user, refetchUser } = useAuth();

  const [details, setDetails] = useState<{
    monthlyIncome: number;
    numberOfWorkingDays: number;
    useWorkingDaysForCalculation: boolean;
  }>({
    monthlyIncome: 0,
    numberOfWorkingDays: 0,
    useWorkingDaysForCalculation: true,
  });
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // sync when user arrives — use nullish coalescing so `false` doesn't become `true`
  useEffect(() => {
    if (user) {
      setDetails({
        monthlyIncome: user.monthlyIncome ?? 0,
        numberOfWorkingDays: user.numberOfWorkingDays ?? 0,
        useWorkingDaysForCalculation: user.useWorkingDaysForCalculation ?? true,
      });
    }
  }, [user]);

  // track changes
  useEffect(() => {
    if (!user) return;
    const changed =
      details.monthlyIncome !== (user.monthlyIncome ?? 0) ||
      details.numberOfWorkingDays !== (user.numberOfWorkingDays ?? 0) ||
      details.useWorkingDaysForCalculation !==
        (user.useWorkingDaysForCalculation ?? true);
    setIsChanged(changed);
  }, [details, user]);

  async function handleSave() {
    try {
      setIsSaving(true);

      // send the correct key name expected by the server / schema
      await updateUserCalculationDetails({
        monthlyIncome: details.monthlyIncome,
        numberOfWorkingDays: details.numberOfWorkingDays,
        useWorkingDaysForCalculation: details.useWorkingDaysForCalculation,
      });

      await refetchUser();
      toast.success("Calculation details saved successfully");
    } catch (error) {
      console.error("Error saving calculation details:", error);
      toast.error("Error saving calculation details");
    } finally {
      setIsSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="mt-7 w-full flex flex-col gap-3">
        <div>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex w-full">
          <div className="flex flex-col md:flex-row gap-7 w-full">
            <Skeleton className="h-20 w-full flex-1" />
            <Skeleton className="h-20 w-full flex-1" />
          </div>
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-7 w-full flex flex-col gap-3">
      <div>
        <h2 className="text-xl tracking-tight">Calculation Details</h2>
        <p className="text-muted-foreground">
          Some details that help us tweak the calculations better.
        </p>
      </div>
      <div className="flex w-full">
        <div className="flex flex-col md:flex-row gap-7 w-full">
          {/* Monthly Income */}
          <div className="flex-1">
            <Label htmlFor="monthlyIncome" className="text-base">
              Monthly Income
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Enter your monthly income in INR
            </p>
            <Input
              id="monthlyIncome"
              value={details.monthlyIncome}
              type="number"
              placeholder="Enter your monthly income"
              className="flex-1"
              onChange={(e) =>
                setDetails({
                  ...details,
                  monthlyIncome: Number(e.target.value || 0),
                })
              }
            />
          </div>

          {/* Working Days */}
          <div className="flex-1">
            <Label htmlFor="numberOfWorkingDays" className="text-base">
              Number of Working Days
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Enter the number of working days in a month
            </p>
            <Input
              id="numberOfWorkingDays"
              value={details.numberOfWorkingDays}
              type="number"
              placeholder="Enter the number of working days"
              className="flex-1"
              onChange={(e) =>
                setDetails({
                  ...details,
                  numberOfWorkingDays: Number(e.target.value || 0),
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Label htmlFor="useWorkingDaysForCalculation" className="text-base">
          Use Working Days for Calculation
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          We will use your working days to calculate your time to afford items.
          If you prefer to use standard calendar days, uncheck this option.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Checkbox
            id="useWorkingDaysForCalculation"
            // controlled with checked prop
            checked={details.useWorkingDaysForCalculation}
            onCheckedChange={(checked) =>
              setDetails({
                ...details,
                useWorkingDaysForCalculation: !!checked,
              })
            }
            className="size-5"
          />
          <p className="text-sm text-muted-foreground">
            {details.useWorkingDaysForCalculation
              ? "Using your working days for calculations"
              : "Using standard calendar days for calculations"}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!isChanged || isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
