"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface HeroSceneProps {
  scrollProgress: number
}

export function HeroScene({ scrollProgress }: HeroSceneProps) {
  const logoWrapRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const logoWrap = logoWrapRef.current
    if (!logoWrap) return

    // Calculate logo transform based on scroll
    const scale = Math.max(0.2, 1 - scrollProgress * 0.8)
    const opacity = Math.max(0, 1 - scrollProgress * 1.5)

    logoWrap.style.transform = `translate(-50%, -50%) scale(${scale})`
    logoWrap.style.opacity = String(opacity)

    // Activate cinematic effect when scrolling starts
    if (scrollProgress > 0.05 && !isActive) {
      setIsActive(true)
    }
  }, [scrollProgress, isActive])

  return (
    <div className="hero-scene" id="heroScene">
      <div className="hero-ambient" aria-hidden="true">
        <div className="sky-ribbon one" />
        <div className="sky-ribbon two" />
        <div className="light-orb one" />
        <div className="light-orb two" />
        <div className="light-orb three" />
        <div className="shooting-star one" />
        <div className="shooting-star two" />
        <div className="shooting-star three" />
      </div>
      <div
        ref={logoWrapRef}
        className={`logo-wrap ${isActive ? "active" : ""}`}
        id="logoWrap"
      >
        <Image
          src="/medastare-logo.PNG"
          alt="MedaStaré logo"
          width={600}
          height={600}
          priority
        />
        <div className="logo-cinematic-layer" aria-hidden="true">
          <div className="logo-glow" />
          <div className="logo-horizon" />
          <div className="logo-dust" />
        </div>
      </div>
    </div>
  )
}
