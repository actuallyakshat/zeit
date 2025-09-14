function getTimeToAfford(price: number, monthlyIncome: number): string {
  if (monthlyIncome <= 0) return "Cannot afford";

  const minutesPerMonth = 30 * 24 * 60; // 43,200 minutes
  const incomePerMinute = monthlyIncome / minutesPerMonth;
  const totalMinutes = Math.ceil(price / incomePerMinute);

  const timeUnits = calculateTimeUnits(totalMinutes);
  const displayParts = selectDisplayUnits(timeUnits);

  return displayParts.length > 0 ? displayParts.join(", ") : "0 minutes";
}

function calculateTimeUnits(totalMinutes: number): Record<string, number> {
  const units = [
    { key: "year", minutes: 12 * 30 * 24 * 60 },
    { key: "month", minutes: 30 * 24 * 60 },
    { key: "day", minutes: 24 * 60 },
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

export { getTimeToAfford };
