"use client"

import Image from "next/image"
import { useRef, useEffect } from "react"

interface Module {
  title: string
  desc: string
  hasScreen?: boolean
  screen?: string
  notePrimary?: string
  noteSecondary?: string
  special?: string
}

interface ModuleStageProps {
  modules: Module[]
  activeIndex: number
  show: boolean
}

export function ModuleStage({ modules, activeIndex, show }: ModuleStageProps) {
  const deviceRef = useRef<HTMLDivElement>(null)
  const currentModule = modules[activeIndex] || modules[0]

  useEffect(() => {
    const device = deviceRef.current
    if (!device) return

    const handlePointerMove = (event: PointerEvent) => {
      if (!currentModule?.hasScreen) return
      const rect = device.getBoundingClientRect()
      const x = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width)
      )
      const y = Math.max(
        0,
        Math.min(1, (event.clientY - rect.top) / rect.height)
      )
      const rotateX = ((y - 0.5) * -16).toFixed(2)
      const rotateY = ((x - 0.5) * 20).toFixed(2)
      device.style.setProperty("--tilt-x", `${rotateX}deg`)
      device.style.setProperty("--tilt-y", `${rotateY}deg`)
      device.style.setProperty("--gloss-x", `${(x * 100).toFixed(2)}%`)
      device.style.setProperty("--gloss-y", `${(y * 100).toFixed(2)}%`)
    }

    const handlePointerLeave = () => {
      device.style.setProperty("--tilt-x", "0deg")
      device.style.setProperty("--tilt-y", "0deg")
      device.style.setProperty("--gloss-x", "50%")
      device.style.setProperty("--gloss-y", "18%")
      device.classList.remove("interacting")
    }

    device.addEventListener("pointermove", handlePointerMove)
    device.addEventListener("pointerleave", handlePointerLeave)

    return () => {
      device.removeEventListener("pointermove", handlePointerMove)
      device.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [currentModule?.hasScreen])

  if (currentModule?.special === "startrip") {
    return (
      <div className={`module-stack ${show ? "show" : ""}`}>
        <StarTripModule />
      </div>
    )
  }

  return (
    <div className={`module-stack ${show ? "show" : ""}`}>
      <div className="normal-module flex flex-col items-center max-w-[min(94vw,1040px)] mx-auto">
        <h2 className="module-title">{currentModule?.title}</h2>
        {currentModule?.desc && (
          <p className="module-desc">{currentModule.desc}</p>
        )}
        {currentModule?.hasScreen && currentModule?.screen && (
          <div className="module-screen-stage">
            <div className="module-screen-glow" />
            <div ref={deviceRef} className="module-device-shell">
              <div className="module-screen-shell">
                <div className="device-island" />
                <Image
                  src={`/${currentModule.screen}`}
                  alt={currentModule.title}
                  fill
                  className="object-cover object-top"
                />
                <div className="screen-sheen" />
              </div>
            </div>
            <div className="module-note-rail">
              {currentModule.notePrimary && (
                <div className="module-note primary">
                  {currentModule.notePrimary}
                </div>
              )}
              {currentModule.noteSecondary && (
                <div className="module-note secondary">
                  {currentModule.noteSecondary}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StarTripModule() {
  return (
    <div className="flex flex-col items-center gap-[18px] relative min-h-[240px]">
      <h2 className="module-title">
        StarTrip:{" "}
        <span className="startrip-maldives inline-block">Maldives</span>
      </h2>
      <p className="module-desc">
        First-class escapes curated by AI taste intelligence.
      </p>
      <div className="startrip-plane">
        <svg viewBox="0 0 220 80" aria-hidden="true">
          <defs>
            <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(240,212,122,0)" />
              <stop offset="40%" stopColor="rgba(240,212,122,.22)" />
              <stop offset="100%" stopColor="rgba(240,212,122,.64)" />
            </linearGradient>
          </defs>
          <path
            d="M0 40 Q55 38 100 40 T200 40"
            stroke="url(#planeGrad)"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          <polygon
            points="200,40 185,32 185,48"
            fill="rgba(240,212,122,.88)"
          />
        </svg>
      </div>
      <div className="startrip-coming">
        <span>COMING SOON</span>
      </div>
    </div>
  )
}
