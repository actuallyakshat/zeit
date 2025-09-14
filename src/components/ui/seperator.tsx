import { cn } from "@/lib/utils";

export function SeparatorBorder({
  className,
}: {
  readonly className?: string;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 2px,
            currentColor 4px,
            currentColor 4px
          )`,
        }}
      />
    </div>
  );
}
