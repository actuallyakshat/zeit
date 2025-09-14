import CalculationDetailsForm from "../settings/components/calculation-details-form";

export default function OnboardUser() {
  return (
    <div className="flex-1 border-x border-dashed p-8 flex flex-col gap-4">
      <h1 className="text-6xl tracking-tight">Hey there!</h1>
      <p className="text-muted-foreground">
        Welcome to Zeit, your wishlist app. Let's get started by setting up your
        monthly income and working days.
      </p>
      <CalculationDetailsForm />
    </div>
  );
}
