import CalculationDetailsForm from "./components/calculation-details-form";

export default function Settings() {
  return (
    <div className="h-full w-full flex flex-col flex-1 border-x p-8 border-dashed">
      <h1 className="text-5xl tracking-tight text-balance">Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Customise Zeit to suit your needs. Edit your monthly income, number of
        working days, and calculation parameters.
      </p>
      <CalculationDetailsForm />
    </div>
  );
}
