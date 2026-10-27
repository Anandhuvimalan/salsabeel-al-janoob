import { cn } from "@/lib/utils"

// Lightweight placeholder shown while a section's data is still loading on the client.
// Sized like a real section so the page doesn't jump when content arrives.
export function SectionSkeleton({
  label,
  className,
  dark = false,
}: {
  label: string
  className?: string
  dark?: boolean
}) {
  const bar = dark ? "bg-white/10" : "bg-zinc-200"
  return (
    <section
      role="status"
      aria-label={label}
      className={cn("w-full py-24 px-4", dark ? "bg-slate-900" : "bg-white", className)}
    >
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className={cn("h-4 w-32 rounded-full mx-auto mb-5", bar)} />
        <div className={cn("h-9 w-2/3 max-w-xl rounded-lg mx-auto mb-4", bar)} />
        <div className={cn("h-4 w-1/2 max-w-md rounded-full mx-auto mb-14", bar)} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn("h-48 rounded-2xl", bar)} />
          ))}
        </div>
      </div>
    </section>
  )
}
