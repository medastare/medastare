"use client"

import { useEffect, useRef } from "react"

export function BackgroundLayers() {
  return (
    <>
      <div className="lux-noise" aria-hidden="true" />
      <div className="section-aurora" aria-hidden="true" />
      <div className="velvet-vignette" aria-hidden="true" />
      <BackgroundStars />
    </>
  )
}

function BackgroundStars() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = document.body
    for (let i = 0; i < 120; i++) {
      const s = document.createElement("div")
      s.className = "bg-star"
      s.style.left = Math.random() * 100 + "vw"
      s.style.top = Math.random() * 100 + "vh"
      s.style.animationDelay = (Math.random() * 2.8).toFixed(2) + "s"
      s.style.width = s.style.height = 1 + Math.random() * 2.2 + "px"
      container.appendChild(s)
    }

    return () => {
      const stars = container.querySelectorAll(".bg-star")
      stars.forEach((star) => star.remove())
    }
  }, [])

  return null
}
