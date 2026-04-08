"use client"

import { useEffect, useState, useCallback } from "react"
import { BackgroundLayers } from "@/components/background-layers"
import { LoadingCurtain } from "@/components/loading-curtain"
import { HeroScene } from "@/components/hero-scene"
import { EcosystemBar } from "@/components/ecosystem-bar"
import { MenuOverlay } from "@/components/menu-overlay"
import { ModuleStage } from "@/components/module-stage"
import { ProgressDots } from "@/components/progress-dots"
import { PhraseStage } from "@/components/phrase-stage"
import { NailCta } from "@/components/nail-cta"
import { StoreSection } from "@/components/store-section"
import { InfoModal } from "@/components/info-modal"
import { NailOverlay } from "@/components/nail-overlay"

const modules = [
  { title: "StarTrip: Maldives", desc: "", special: "startrip" },
  {
    title: "MedaStaré",
    desc: "The signature home of the ecosystem, where AI beauty, fashion and elevated identity live in one cinematic flow.",
    hasScreen: true,
    screen: "Home_screen.jpeg",
    notePrimary: "PRIVATE AI LUXURY",
    noteSecondary: "ELEVATED HOME FLOW",
  },
  {
    title: "FashionStaré",
    desc: "AI styling, elevated for a luxury fashion ecosystem.",
    hasScreen: true,
    screen: "FashionStare_Screen.jpeg",
    notePrimary: "CURATED BY AI",
    noteSecondary: "RUNWAY CALM",
  },
  {
    title: "MedArena",
    desc: "Challenges, visibility and momentum across the MedaStaré universe.",
    hasScreen: true,
    screen: "Medarena_screen.jpeg",
    notePrimary: "PRESTIGE IN MOTION",
    noteSecondary: "LIVE STATUS",
  },
  {
    title: "StyleTrack",
    desc: "Your style memory, visualized with intelligent tracking.",
    hasScreen: true,
    screen: "Styletrack_screen.jpeg",
    notePrimary: "MEMORY OF STYLE",
    noteSecondary: "REFINED SIGNAL",
  },
  {
    title: "StyleStaré",
    desc: "Curated identity refined by AI and premium aesthetic logic.",
    hasScreen: false,
  },
  {
    title: "MedaBeauté",
    desc: "Beauty intelligence meets luxury rituals and elevated discovery.",
    hasScreen: false,
  },
  {
    title: "PetStaré",
    desc: "Care, style and smart companionship in one elegant layer.",
    hasScreen: false,
  },
]

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeModuleIndex, setActiveModuleIndex] = useState(-1)
  const [showEcosystemBar, setShowEcosystemBar] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [infoModalType, setInfoModalType] = useState<string | null>(null)
  const [nailOverlayOpen, setNailOverlayOpen] = useState(false)

  // Stage visibility
  const [showModuleStage, setShowModuleStage] = useState(false)
  const [showNailCta, setShowNailCta] = useState(false)
  const [showPhraseStage, setShowPhraseStage] = useState(false)
  const [showStoreSection, setShowStoreSection] = useState(false)

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    const vh = window.innerHeight
    const docHeight = document.documentElement.scrollHeight

    // Hero parallax progress (0 to 1 over first 150vh)
    const heroEnd = vh * 1.5
    const heroProgress = clamp(scrollY / heroEnd, 0, 1)
    setScrollProgress(heroProgress)

    // Show ecosystem bar after hero
    setShowEcosystemBar(scrollY > vh * 0.8)

    // Module stage calculations
    const moduleStart = vh * 1.5
    const moduleStep = vh * 0.5 // Each module takes 50vh of scroll
    const modulesEnd = moduleStart + modules.length * moduleStep
    const nailStageStart = modulesEnd
    const phraseStageStart = nailStageStart + moduleStep
    const storeStageStart = phraseStageStart + moduleStep

    // Determine active stage
    if (scrollY < moduleStart) {
      setShowModuleStage(false)
      setShowNailCta(false)
      setShowPhraseStage(false)
      setShowStoreSection(false)
      setActiveModuleIndex(-1)
    } else if (scrollY < modulesEnd) {
      const moduleProgress = (scrollY - moduleStart) / moduleStep
      const currentModule = Math.floor(moduleProgress)
      setActiveModuleIndex(clamp(currentModule, 0, modules.length - 1))
      setShowModuleStage(true)
      setShowNailCta(false)
      setShowPhraseStage(false)
      setShowStoreSection(false)
    } else if (scrollY < phraseStageStart) {
      setShowModuleStage(false)
      setShowNailCta(true)
      setShowPhraseStage(false)
      setShowStoreSection(false)
      setActiveModuleIndex(modules.length)
    } else if (scrollY < storeStageStart) {
      setShowModuleStage(false)
      setShowNailCta(false)
      setShowPhraseStage(true)
      setShowStoreSection(false)
      setActiveModuleIndex(modules.length + 1)
    } else {
      setShowModuleStage(false)
      setShowNailCta(false)
      setShowPhraseStage(false)
      setShowStoreSection(true)
      setActiveModuleIndex(modules.length + 2)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const scrollToStore = useCallback(() => {
    const vh = window.innerHeight
    const moduleStep = vh * 0.5
    const modulesEnd = vh * 1.5 + modules.length * moduleStep
    const storeStageStart = modulesEnd + moduleStep * 2
    window.scrollTo({ top: storeStageStart + 8, behavior: "smooth" })
  }, [])

  const openInfoModal = (type: string) => {
    setInfoModalType(type)
    setInfoModalOpen(true)
    setMenuOpen(false)
  }

  const closeInfoModal = () => {
    setInfoModalOpen(false)
    setInfoModalType(null)
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    document.body.style.overflow = !menuOpen ? "hidden" : ""
  }

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ""
  }

  const openNailOverlay = () => {
    setNailOverlayOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeNailOverlay = () => {
    setNailOverlayOpen(false)
    document.body.style.overflow = ""
  }

  // Calculate total dots (modules + nail + phrase + store)
  const totalDots = modules.length + 3

  return (
    <>
      <BackgroundLayers />
      <LoadingCurtain />
      <HeroScene scrollProgress={scrollProgress} />

      <ProgressDots totalDots={totalDots} activeIndex={activeModuleIndex} />

      <EcosystemBar
        show={showEcosystemBar}
        activeModule={modules[activeModuleIndex]?.title || ""}
        onNailClick={openNailOverlay}
        onMenuToggle={toggleMenu}
        menuOpen={menuOpen}
      />

      <MenuOverlay
        open={menuOpen}
        onClose={closeMenu}
        onModalOpen={openInfoModal}
        onScrollToStore={() => {
          scrollToStore()
          closeMenu()
        }}
      />

      <div className="content">
        <section className="modules-stage" id="modulesStage">
          <div className="modules-layer" id="modulesLayer">
            <div className="module-viewport">
              {showModuleStage && (
                <ModuleStage
                  modules={modules}
                  activeIndex={activeModuleIndex}
                  show={showModuleStage}
                />
              )}

              <NailCta show={showNailCta} onOpen={openNailOverlay} />

              <PhraseStage show={showPhraseStage} />

              <StoreSection show={showStoreSection} />
            </div>
          </div>
        </section>
      </div>

      <InfoModal
        open={infoModalOpen}
        type={infoModalType}
        onClose={closeInfoModal}
      />

      <NailOverlay open={nailOverlayOpen} onClose={closeNailOverlay} />
    </>
  )
}
