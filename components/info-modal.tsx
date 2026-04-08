"use client"

import { useState } from "react"

interface InfoModalProps {
  open: boolean
  type: string | null
  onClose: () => void
}

const modalContent: Record<string, { title: string; content: React.ReactNode }> = {
  about: {
    title: "About Us",
    content: (
      <p className="mx-auto max-w-[640px] text-[var(--muted)] leading-[1.7] text-center text-[15px]">
        MedaStaré is a luxury AI-powered beauty and fashion ecosystem designed
        to merge intelligent personalization with elevated digital experience.
        We are building more than an app. We are shaping a refined universe
        where styling, beauty discovery, self-expression and future technology
        exist in one seamless destination. From fashion intelligence to beauty
        rituals, from premium challenges to signature experiences, MedaStaré is
        created for those who want elegance, innovation and power in the same
        space.
      </p>
    ),
  },
  blog: {
    title: "Blog",
    content: (
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-[14px]">
        <BlogItem
          title="The Future of AI Beauty"
          desc="Beauty is moving beyond product discovery into intelligent personalization. MedaStaré explores a world where AI understands taste, mood and identity with premium precision."
        />
        <BlogItem
          title="Fashion, Identity and Digital Luxury"
          desc="Style is no longer just what you wear. It is your visual language. Our ecosystem is designed to translate that language into sharper, more elevated decisions."
        />
        <BlogItem
          title="Why MedaStaré Is Building More Than an App"
          desc="We believe the future belongs to ecosystems, not isolated tools. MedaStaré connects fashion, beauty, AI and aspiration under one signature world."
        />
      </div>
    ),
  },
  contact: {
    title: "Contact",
    content: (
      <div>
        <p className="mx-auto max-w-[640px] text-[var(--muted)] leading-[1.7] text-center text-[15px] mb-5">
          Leave your details and message below.
        </p>
        <ContactForm />
      </div>
    ),
  },
}

function BlogItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[20px] p-[18px] bg-white/[0.04] border border-white/[0.08]">
      <h3 className="m-0 mb-[10px] text-[var(--gold-soft)] text-[18px] font-bold tracking-tight text-left">
        {title}
      </h3>
      <p className="text-left text-[13.5px] text-[var(--muted)] max-w-none leading-[1.5]">
        {desc}
      </p>
    </div>
  )
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 mt-5">
      <input
        type="text"
        placeholder="Name Surname"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full border-none outline-none rounded-[18px] py-[14px] px-4 bg-white/[0.05] border border-white/[0.08] text-white text-sm"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full border-none outline-none rounded-[18px] py-[14px] px-4 bg-white/[0.05] border border-white/[0.08] text-white text-sm"
      />
      <textarea
        placeholder="Your message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full border-none outline-none rounded-[18px] py-[14px] px-4 bg-white/[0.05] border border-white/[0.08] text-white text-sm min-h-[140px] resize-y"
      />
      <button
        type="submit"
        className="h-[52px] rounded-full cursor-pointer font-extrabold text-[#121212] bg-gradient-to-br from-[#fcf0ba] via-[#efcd72] via-[#c9952b] to-[#8d6a12] shadow-[0_0_22px_rgba(212,175,55,0.24),inset_0_1px_0_rgba(255,255,255,0.38)]"
      >
        Send Message
      </button>
    </form>
  )
}

export function InfoModal({ open, type, onClose }: InfoModalProps) {
  const content = type ? modalContent[type] : null

  return (
    <div
      className={`info-modal ${open ? "open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="info-card">
        <button
          className="absolute top-4 right-4 w-[34px] h-[34px] border-none rounded-full bg-gradient-to-b from-[rgba(21,21,24,0.9)] to-[rgba(8,8,10,0.76)] text-[var(--gold-soft)] cursor-pointer text-[18px] flex items-center justify-center border border-[rgba(212,175,55,0.18)] shadow-[var(--shadow-premium-soft)]"
          type="button"
          onClick={onClose}
        >
          &#10022;
        </button>
        {content && (
          <>
            <h2 className="text-[var(--gold-soft)] text-[clamp(28px,4vw,42px)] font-bold tracking-tight m-0 mb-[14px] text-center">
              {content.title}
            </h2>
            {content.content}
          </>
        )}
      </div>
    </div>
  )
}
