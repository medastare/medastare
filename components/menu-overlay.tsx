"use client"

import Image from "next/image"

interface MenuOverlayProps {
  open: boolean
  onClose: () => void
  onModalOpen: (type: string) => void
  onScrollToStore: () => void
}

export function MenuOverlay({
  open,
  onClose,
  onModalOpen,
  onScrollToStore,
}: MenuOverlayProps) {
  const handleLinkClick = (action: () => void) => {
    action()
    onClose()
  }

  return (
    <div className={`menu-overlay ${open ? "open" : ""}`} id="menuOverlay">
      <div className="w-[min(92vw,760px)] max-w-[760px] text-center py-[100px] px-6 relative">
        <div className="menu-links">
          <button
            type="button"
            onClick={() => handleLinkClick(onScrollToStore)}
          >
            GET THE APP
          </button>
          <button type="button" onClick={() => onModalOpen("about")}>
            ABOUT US
          </button>
          <button type="button" onClick={() => onModalOpen("blog")}>
            BLOG
          </button>
          <a href="mailto:info@medastare.com" onClick={onClose}>
            SUPPORT
          </a>
          <button type="button" onClick={() => onModalOpen("contact")}>
            CONTACT
          </button>
        </div>
        <div className="menu-social">
          <a
            href="https://www.linkedin.com/company/medastare/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Image
              src="/linkedin-logo.png"
              alt="LinkedIn"
              width={50}
              height={50}
            />
          </a>
          <a
            href="https://x.com/medastareapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <Image src="/x-logo.png" alt="X" width={50} height={50} />
          </a>
          <a
            href="https://www.instagram.com/medastare.co"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Image
              src="/instagram-logo.png"
              alt="Instagram"
              width={50}
              height={50}
            />
          </a>
        </div>
        <div className="flex flex-col items-center gap-[10px] mt-[34px]">
          <button
            type="button"
            disabled
            className="text-white/50 text-sm bg-transparent border-none cursor-default opacity-55"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            disabled
            className="text-white/50 text-sm bg-transparent border-none cursor-default opacity-55"
          >
            Terms of Use
          </button>
        </div>
        <div className="mt-[14px] text-white/40 text-[13px]">
          © 2026 MedaStaré. All Rights Reserved.
        </div>
      </div>
    </div>
  )
}
