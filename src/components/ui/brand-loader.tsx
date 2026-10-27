import { cn } from "@/lib/utils"

// Branded full-screen loader: logo inside a self-drawing ring, company name and a
// progress shimmer. Pure CSS (see globals.css "brand-loader") so it works in server
// components such as app/loading.tsx. Set `exiting` to lift it away like a curtain.
export function BrandLoader({ exiting = false, label = "Loading" }: { exiting?: boolean; label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      aria-hidden={exiting}
      className={cn("brand-loader fixed inset-0 z-[10000] flex items-center justify-center", exiting && "is-exiting")}
    >
      <div className="brand-loader__panel absolute inset-0 bg-zinc-950" />
      <div className="brand-loader__content relative flex flex-col items-center">
        <div className="relative h-24 w-24">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            <circle className="brand-loader__ring" cx="50" cy="50" r="46" fill="none" stroke="url(#brand-loader-gradient)" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="brand-loader-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3bc6c6" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt=""
            width={51}
            height={49}
            className="brand-loader__logo absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 brightness-0 invert"
          />
        </div>
        <p className="brand-loader__name mt-6 text-[11px] font-medium uppercase tracking-[0.35em] text-white/70">
          Salsabeel Al Janoob
        </p>
        <div className="mt-5 h-px w-40 overflow-hidden bg-white/10">
          <div className="brand-loader__bar h-full w-1/3 bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
        </div>
      </div>
    </div>
  )
}
