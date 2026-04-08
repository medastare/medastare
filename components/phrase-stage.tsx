"use client"

import { useEffect, useState, useRef } from "react"

interface PhraseStageProps {
  show: boolean
}

const phraseSequence = [
  { text: "AI.", cls: "left", duration: 1300 },
  { text: "Fashion.", cls: "center", duration: 1300 },
  { text: "Beauty.", cls: "right", duration: 1300 },
  { text: "Power.", cls: "center power", duration: 1700 },
]

export function PhraseStage({ show }: PhraseStageProps) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (show) {
      setIsActive(true)
      intervalRef.current = setInterval(() => {
        setIsActive(false)
        setTimeout(() => {
          setPhraseIndex((prev) => (prev + 1) % phraseSequence.length)
          setIsActive(true)
        }, 100)
      }, 1600)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setPhraseIndex(0)
      setIsActive(false)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [show])

  const currentPhrase = phraseSequence[phraseIndex]

  return (
    <div className={`phrase-stage-wrap ${show ? "show" : ""}`}>
      <div className="phrase-rail relative w-[min(92vw,900px)] h-[180px] mx-auto">
        <div
          className={`phrase-word ${currentPhrase.cls} ${isActive ? "active" : ""}`}
          style={{
            position: "absolute",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "clamp(54px, 9vw, 92px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "var(--gold-soft)",
            textShadow:
              "0 0 14px rgba(240,212,122,.16), 0 0 32px rgba(212,175,55,.08)",
            whiteSpace: "nowrap",
            top: "50%",
            opacity: isActive ? 1 : 0,
            transform: isActive
              ? currentPhrase.cls.includes("center")
                ? "translate(-50%, 0) scale(1)"
                : "translateY(0) scale(1)"
              : currentPhrase.cls.includes("center")
                ? "translate(-50%, 20px) scale(0.96)"
                : "translateY(20px) scale(0.96)",
            transition: "opacity 0.42s ease, transform 0.42s ease",
            left: currentPhrase.cls.includes("center")
              ? "50%"
              : currentPhrase.cls === "left"
                ? "6%"
                : "auto",
            right: currentPhrase.cls === "right" ? "6%" : "auto",
          }}
        >
          {currentPhrase.text}
        </div>
      </div>
    </div>
  )
}
