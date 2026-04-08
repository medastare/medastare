"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function LoadingCurtain() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`loading-curtain ${hidden ? "hidden" : ""}`}
      aria-hidden="true"
    >
      <div className="loading-ring" />
      <Image
        className="loading-logo"
        src="/medastare-logo.PNG"
        alt=""
        width={168}
        height={168}
        priority
      />
    </div>
  )
}
