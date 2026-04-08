"use client"

interface NailCtaProps {
  show: boolean
  onOpen: () => void
}

export function NailCta({ show, onOpen }: NailCtaProps) {
  return (
    <div className={`nail-cta-wrap ${show ? "show" : ""}`}>
      <h2 className="module-title">NailStaré</h2>
      <p className="module-desc">
        Premium nail technology for elite salons. AI-powered tools, trend radar
        and a signature digital identity for your business.
      </p>
      <button
        className="mt-6 min-w-[min(88vw,560px)] py-[22px] px-9 rounded-full bg-gradient-to-b from-[rgba(18,18,22,0.94)] to-[rgba(6,6,8,0.78)] backdrop-blur-[18px] border border-white/[0.08] shadow-[var(--shadow-premium)] text-[var(--gold-soft)] font-extrabold cursor-pointer transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_24px_48px_rgba(0,0,0,0.3)]"
        onClick={onOpen}
      >
        Apply for Partner Access
      </button>
      <p className="mt-3 text-[var(--muted)] text-sm font-medium">
        Selected salons only.
      </p>
    </div>
  )
}
