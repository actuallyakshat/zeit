import CookItemFrame from "../components/cook-item-frame";

export default function Cook() {
  return (
    <div className="h-full w-full flex flex-col flex-1 border-x border-dashed p-8">
      <h2 className="text-5xl">Cook Item</h2>
      <p className="mt-2 text-muted-foreground ">
        You can choose to select an item from your wishlist and cook it. This
        basically allows you to start a count down for the number of days it
        would take you to afford the item. Once the countdown is over, we would
        e-mail you that you can now afford the item.
      </p>

      <CookItemFrame />
    </div>
  );
}
