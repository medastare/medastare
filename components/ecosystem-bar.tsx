"use client"

import Image from "next/image"

interface EcosystemBarProps {
  show: boolean
  activeModule: string
  onNailClick: () => void
  onMenuToggle: () => void
  menuOpen: boolean
}

const ecosystemItems = [
  "MedaStaré",
  "FashionStaré",
  "MedArena",
  "StyleTrack",
  "StyleStaré",
  "MedaBeauté",
  "PetStaré",
]

export function EcosystemBar({
  show,
  activeModule,
  onNailClick,
  onMenuToggle,
  menuOpen,
}: EcosystemBarProps) {
  return (
    <div className={`ecosystem-bar ${show ? "show" : ""}`} id="ecosystemBar">
      <div className="flex items-center gap-[18px] flex-shrink-0">
        <Image
          src="/medastare-logo.PNG"
          alt="MedaStaré"
          width={56}
          height={56}
          className="ecosystem-logo"
        />
        <div className="ecosystem-divider" />
      </div>
      <div className="ecosystem-track">
        <div className="ecosystem-marquee" id="ecosystemMarquee">
          {[...ecosystemItems, ...ecosystemItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              data-name={item}
              className={activeModule === item ? "active" : ""}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="ecosystem-nail" onClick={onNailClick}>
          NailStaré
        </button>
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={onMenuToggle}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
        </button>
      </div>
    </div>
  )
}
