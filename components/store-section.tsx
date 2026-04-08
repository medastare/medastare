"use client"

import Image from "next/image"

interface StoreSectionProps {
  show: boolean
}

export function StoreSection({ show }: StoreSectionProps) {
  return (
    <div
      className={`store-cta-wrap ${show ? "show" : ""}`}
      id="storeStage"
    >
      <h2 className="module-title">Get the App</h2>
      <p className="module-desc">
        Join the waitlist and be among the first to experience MedaStaré.
      </p>
      <div className="store-badges">
        <a
          href="#"
          className="store-badge-link"
          aria-label="Download on App Store"
        >
          <Image
            src="/app-store.png"
            alt="App Store"
            width={180}
            height={60}
            className="store-badge"
          />
        </a>
        <a
          href="#"
          className="store-badge-link"
          aria-label="Get it on Google Play"
        >
          <Image
            src="/google-play.png"
            alt="Google Play"
            width={180}
            height={60}
            className="store-badge"
          />
        </a>
      </div>
    </div>
  )
}
