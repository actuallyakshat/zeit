import CookItemFrame from "../components/cook-item-frame";

export default function Cook() {
  return (
    <div className="h-full w-full flex flex-col flex-1 border-x border-dashed p-8">
      <h2 className="text-5xl">Cook Item</h2>
      <p className="mt-2 text-muted-foreground max-w-2xl">
        Start a countdown for any wishlist item to track the time needed to
        afford it. Receive an email notification when the countdown completes.
      </p>

      <CookItemFrame />
    </div>
  );
}
