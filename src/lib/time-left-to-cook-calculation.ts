function getRemainingTimeToCook(
  startDate: Date,
  price: number,
  monthlyIncome: number,
  useWorkingDays: boolean = true,
  numberOfWorkingDays?: number
): string {
  if (monthlyIncome <= 0) {
    return "Set your income to see the countdown.";
  }

  // Use working days for calculation, default to 30 if not provided
  const workingDays =
    numberOfWorkingDays && numberOfWorkingDays > 0 ? numberOfWorkingDays : 30;

  // Calculate total minutes needed to afford the item
  const workingMinutesPerMonth = workingDays * 8 * 60;
  const incomePerMinute = monthlyIncome / workingMinutesPerMonth;
  const totalMinutesNeeded = Math.ceil(price / incomePerMinute);

  // Calculate elapsed time since cooking started
  const now = new Date();
  const elapsedMilliseconds = now.getTime() - startDate.getTime();
  const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));

  // Calculate remaining minutes
  const remainingMinutes = Math.max(0, totalMinutesNeeded - elapsedMinutes);

  // If already cooked
  if (remainingMinutes === 0) {
    return "Ready! You can afford this item now! 🎉";
  }

  // Convert remaining minutes to time units
  const timeUnits = calculateWorkingTimeUnits(remainingMinutes, workingDays);
  const displayParts = selectDisplayUnits(timeUnits);

  return displayParts.length > 0
    ? displayParts.join(", ")
    : "Less than a minute";
}

function calculateWorkingTimeUnits(
  totalMinutes: number,
  workingDaysPerMonth: number
): Record<string, number> {
  const workingMinutesPerDay = 8 * 60;
  const workingMinutesPerMonth = workingDaysPerMonth * workingMinutesPerDay;
  const workingMinutesPerYear = 12 * workingMinutesPerMonth;

  const units = [
    { key: "year", minutes: workingMinutesPerYear },
    { key: "month", minutes: workingMinutesPerMonth },
    { key: "day", minutes: workingMinutesPerDay },
    { key: "hour", minutes: 60 },
    { key: "minute", minutes: 1 },
  ] as const;

  const values: Record<string, number> = {};
  let remaining = totalMinutes;

  for (const unit of units) {
    values[unit.key] = Math.floor(remaining / unit.minutes);
    remaining %= unit.minutes;
  }

  return values;
}

function selectDisplayUnits(timeUnits: Record<string, number>): string[] {
  const order = ["year", "month", "day", "hour", "minute"] as const;
  const maxUnits: Record<string, string> = {
    year: "month",
    month: "day",
    day: "hour",
    hour: "minute",
    minute: "minute",
  };

  const firstNonZero = order.find((key) => timeUnits[key] > 0) ?? "minute";
  const secondAllowed = maxUnits[firstNonZero];

  return buildDisplayParts(timeUnits, order, firstNonZero, secondAllowed);
}

function buildDisplayParts(
  timeUnits: Record<string, number>,
  order: readonly string[],
  firstNonZero: string,
  secondAllowed: string
): string[] {
  const parts: string[] = [];

  for (const key of order) {
    const value = timeUnits[key];

    if (
      shouldIncludeUnit(key, value, firstNonZero, secondAllowed, parts.length)
    ) {
      parts.push(formatTimeUnit(value, key));

      if (key === secondAllowed) break;
    }
  }

  return parts;
}

function shouldIncludeUnit(
  key: string,
  value: number,
  firstNonZero: string,
  secondAllowed: string,
  partsCount: number
): boolean {
  return (
    value > 0 &&
    (key === firstNonZero || (key === secondAllowed && partsCount > 0))
  );
}

function formatTimeUnit(value: number, unit: string): string {
  return `${value} ${unit}${value > 1 ? "s" : ""}`;
}

export { getRemainingTimeToCook };
