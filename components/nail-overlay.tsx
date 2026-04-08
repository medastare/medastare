"use client"

import { useState } from "react"

interface NailOverlayProps {
  open: boolean
  onClose: () => void
}

const services = [
  "Nail Extensions",
  "Nail Art",
  "Manicure",
  "Pedicure",
  "Nail Care",
  "Gel Polish",
  "Builder / Extension Services",
]

const packages = [
  {
    id: "basic",
    title: "Basic",
    desc: "Salon panel, AI Nail Analysis, Trend Radar and core visibility tools.",
  },
  {
    id: "premium",
    title: "Premium",
    desc: "Academy access, advanced reports, trend radar and exclusive collection support.",
  },
  {
    id: "vip",
    title: "VIP",
    desc: "3D Try-On, AI client analysis, Hologram Nail Workshop and VIP visibility layers.",
  },
]

export function NailOverlay({ open, onClose }: NailOverlayProps) {
  const [view, setView] = useState<"intro" | "application">("intro")
  const [salonName, setSalonName] = useState("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedPackage, setSelectedPackage] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    )
  }

  const handleSubmit = () => {
    setShowSuccess(true)
  }

  const handleClose = () => {
    setView("intro")
    setSalonName("")
    setSelectedServices([])
    setSelectedPackage("")
    setShowSuccess(false)
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="nail-overlay fixed inset-0 z-[200] bg-gradient-to-b from-[#0a0d16] to-[#05070e] overflow-auto block">
        <div className="max-w-[980px] mx-auto py-6 px-5 pb-16">
          <div className="flex items-center justify-between mb-[18px]">
            <button
              className="appearance-none border-none bg-transparent text-[var(--gold-soft)] text-base font-bold cursor-pointer py-[10px] rounded-full"
              onClick={handleClose}
            >
              &larr; Back
            </button>
            <div className="font-[var(--font-cormorant)] text-[var(--gold-soft)] text-[28px] font-bold">
              NailStaré
            </div>
          </div>

          {view === "intro" ? (
            <IntroView onContinue={() => setView("application")} />
          ) : (
            <ApplicationView
              salonName={salonName}
              setSalonName={setSalonName}
              selectedServices={selectedServices}
              toggleService={toggleService}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/50 p-5">
          <div className="w-[min(92vw,520px)] rounded-3xl bg-[#111216] border border-white/[0.12] p-[22px] shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <h3 className="m-0 mb-[10px] text-[22px] font-extrabold text-white">
              Application Received
            </h3>
            <p className="m-0 text-[var(--muted)] leading-[1.5]">
              Your application has been successfully received. Our NailStaré
              operations team will contact you after the eligibility review.
            </p>
            <div className="mt-[18px] flex justify-end">
              <button
                className="appearance-none border-none bg-transparent text-[var(--gold-soft)] text-sm font-extrabold cursor-pointer rounded-full py-2 px-[14px]"
                onClick={handleClose}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function IntroView({ onContinue }: { onContinue: () => void }) {
  return (
    <>
      <div className="glass mt-3">
        <h2 className="text-[34px] font-extrabold m-0 mb-[10px] text-center text-white">
          NailStaré
        </h2>
        <p className="text-center text-[var(--muted)] text-[15px] leading-[1.5] m-0 mx-auto mb-7 max-w-[650px]">
          NailStaré empowers premium nail salons with AI-powered tools, trend
          intelligence and an exclusive digital presence designed for the future
          of beauty.
        </p>
      </div>
      <div className="glass">
        <h3 className="text-[18px] font-extrabold m-0 mb-3 text-white">
          Partner Benefits
        </h3>
        <p className="text-[var(--muted)] leading-[1.58] text-sm m-0">
          From AI nail analysis to real-time trend tracking, NailStaré helps
          your salon deliver smarter services, build a stronger digital presence
          and connect with a premium clientele.
        </p>
        <div className="mt-[18px] grid grid-cols-1 md:grid-cols-2 gap-3">
          <FeatureCard icon="AI" title="AI Nail Analysis" desc="Instant nail health and style assessment powered by AI." />
          <FeatureCard icon="TR" title="Trend Radar" desc="Real-time trend intelligence tailored to your region." />
          <FeatureCard icon="VIP" title="VIP Visibility" desc="Exclusive positioning in the MedaStaré ecosystem." />
          <FeatureCard icon="AC" title="Academy Access" desc="Premium education and certification programs." />
        </div>
      </div>
      <div className="glass">
        <div className="flex gap-[10px] items-start text-[var(--muted)] text-[13.5px] leading-[1.45]">
          <div className="text-[var(--gold-soft)] font-extrabold mt-[1px]">
            &#10022;
          </div>
          <div>
            NailStaré is currently available by invitation only. Applications
            are reviewed by our operations team.
          </div>
        </div>
      </div>
      <div className="mt-5">
        <button className="primary-btn" onClick={onContinue}>
          Apply for Partner Access
        </button>
        <p className="text-center text-[var(--muted2)] text-[12.5px] font-semibold mt-[10px]">
          Selected salons only.
        </p>
      </div>
    </>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string
  title: string
  desc: string
}) {
  return (
    <div className="rounded-[22px] p-4 bg-white/[0.05] border border-white/[0.10] min-h-[160px]">
      <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center text-[#151515] bg-gradient-to-br from-[var(--gold-soft)] to-[#d6a93d] text-[18px] font-extrabold mb-3 shadow-[0_0_18px_rgba(212,175,55,0.22)]">
        {icon}
      </div>
      <h3 className="m-0 mb-2 text-[15px] font-extrabold text-white">{title}</h3>
      <p className="m-0 text-[var(--muted)] text-[12.5px] leading-[1.42]">
        {desc}
      </p>
    </div>
  )
}

function ApplicationView({
  salonName,
  setSalonName,
  selectedServices,
  toggleService,
  selectedPackage,
  setSelectedPackage,
  onSubmit,
}: {
  salonName: string
  setSalonName: (v: string) => void
  selectedServices: string[]
  toggleService: (s: string) => void
  selectedPackage: string
  setSelectedPackage: (v: string) => void
  onSubmit: () => void
}) {
  return (
    <>
      <div className="glass">
        <h3 className="text-[22px] font-extrabold m-0 mb-0 text-white">
          NailStaré Application
        </h3>
        <div className="text-[28px] font-black m-[2px_0_8px] leading-[1.15] text-white">
          NailStaré ×{" "}
          <span className="text-[var(--gold-soft)]">
            {salonName || "Your Salon Name"}
          </span>
        </div>
        <div className="text-[var(--muted2)] text-[12.5px] font-semibold mb-[18px]">
          Powered by MedaStaré
        </div>
        <div className="field">
          <label className="block mb-2 text-white/[0.92] text-[13px] font-bold">
            Salon Name
          </label>
          <input
            type="text"
            placeholder="Salon name"
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
            className="w-full rounded-[18px] border border-white/[0.10] bg-white/[0.05] text-white py-[14px] px-[15px] text-sm outline-none focus:border-[rgba(212,175,55,0.8)] focus:shadow-[0_0_0_1px_rgba(212,175,55,0.35)]"
          />
        </div>
      </div>

      <div className="glass">
        <h3 className="text-[18px] font-extrabold m-0 mb-3 text-white">
          Salon Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Owner / Manager Name" placeholder="Owner / manager name" />
          <FormField label="Phone" placeholder="Phone" />
          <FormField label="Email" placeholder="Email" type="email" />
          <div className="field">
            <label className="block mb-2 text-white/[0.92] text-[13px] font-bold">
              Salon Type
            </label>
            <select className="w-full rounded-[18px] border border-white/[0.10] bg-white/[0.05] text-white py-[14px] px-[15px] text-sm outline-none">
              <option value="">Select salon type</option>
              <option>Nail Bar</option>
              <option>Beauty Center</option>
              <option>Boutique Nail Studio</option>
              <option>Home Studio</option>
            </select>
          </div>
          <FormField label="Country" placeholder="Country" />
          <FormField label="City" placeholder="City" />
        </div>
      </div>

      <div className="glass">
        <h3 className="text-[18px] font-extrabold m-0 mb-3 text-white">
          Capacity & Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Number of Staff" placeholder="Number of staff" type="number" />
          <FormField label="Average Daily Clients" placeholder="Average daily clients" type="number" />
          <div className="col-span-full">
            <label className="block mb-2 text-white/[0.92] text-[13px] font-bold">
              Services Offered
            </label>
            <div className="flex flex-wrap gap-[10px] mt-[10px]">
              {services.map((service) => (
                <div
                  key={service}
                  className={`chip ${selectedServices.includes(service) ? "active" : ""}`}
                  onClick={() => toggleService(service)}
                >
                  {service}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass">
        <h3 className="text-[18px] font-extrabold m-0 mb-3 text-white">
          Social Media
        </h3>
        <FormField label="Instagram Account" placeholder="Instagram account" />
      </div>

      <div className="glass">
        <h3 className="text-[18px] font-extrabold m-0 mb-3 text-white">
          NailStaré Packages
        </h3>
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`package-card ${selectedPackage === pkg.id ? "active" : ""}`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            <div className="text-[15px] font-extrabold m-0 mb-[6px] text-white">
              {pkg.title}
            </div>
            <p className="text-[var(--muted)] text-[13px] leading-[1.45] m-0">
              {pkg.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="glass">
        <h3 className="text-[18px] font-extrabold m-0 mb-3 text-white">
          Primary Need
        </h3>
        <div className="field">
          <label className="block mb-2 text-white/[0.92] text-[13px] font-bold">
            What do you want NailStaré to help your salon with most?
          </label>
          <select className="w-full rounded-[18px] border border-white/[0.10] bg-white/[0.05] text-white py-[14px] px-[15px] text-sm outline-none">
            <option value="">Select primary need</option>
            <option>Client Acquisition</option>
            <option>Salon Management</option>
            <option>Education</option>
            <option>Trend Tracking</option>
            <option>Technology Integration</option>
          </select>
        </div>
      </div>

      <div className="glass">
        <div className="flex gap-[10px] items-start text-[var(--muted)] text-[13.5px] leading-[1.45]">
          <div className="text-[var(--gold-soft)] font-extrabold mt-[1px]">
            &#10022;
          </div>
          <div>
            Applications are reviewed by the NailStaré operations team. Suitable
            salons will be contacted.
          </div>
        </div>
      </div>

      <div className="mt-5">
        <button className="primary-btn" onClick={onSubmit}>
          Submit Application
        </button>
        <p className="text-center text-[var(--muted2)] text-[12.5px] font-semibold mt-[10px]">
          Selected salons only.
        </p>
      </div>
    </>
  )
}

function FormField({
  label,
  placeholder,
  type = "text",
}: {
  label: string
  placeholder: string
  type?: string
}) {
  return (
    <div className="field mb-3">
      <label className="block mb-2 text-white/[0.92] text-[13px] font-bold">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-[18px] border border-white/[0.10] bg-white/[0.05] text-white py-[14px] px-[15px] text-sm outline-none focus:border-[rgba(212,175,55,0.8)] focus:shadow-[0_0_0_1px_rgba(212,175,55,0.35)]"
      />
    </div>
  )
}
