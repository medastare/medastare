"use client"

interface ProgressDotsProps {
  totalDots: number
  activeIndex: number
}

export function ProgressDots({ totalDots, activeIndex }: ProgressDotsProps) {
  return (
    <div className="progress-dots" id="progressDots">
      {Array.from({ length: totalDots }).map((_, i) => (
        <div
          key={i}
          className={`progress-dot ${i === activeIndex ? "active" : ""}`}
        />
      ))}
    </div>
  )
}
