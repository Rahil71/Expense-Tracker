import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  BarChart3,
  Bell,
  Cloud,
  FileText,
  Lock,
  PieChart,
  Zap,
  Shield,
  CheckCircle,
  Menu,
  X,
} from "lucide-react"

export default function Landing() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const features = [
    {
      icon: BarChart3,
      title: "Expense Tracking",
      desc: "Add, categorize, and visualize spending in real-time with clean charts.",
      accent: "from-emerald-400/20 to-cyan-400/20 border-emerald-400/30",
      iconColor: "text-emerald-400",
    },
    {
      icon: FileText,
      title: "PDF Reports",
      desc: "Export audit-ready reports for tax season and monthly reviews.",
      accent: "from-cyan-400/20 to-blue-400/20 border-cyan-400/30",
      iconColor: "text-cyan-300",
    },
    {
      icon: Lock,
      title: "Budget Limits",
      desc: "Set monthly caps and keep spending under control with guardrails.",
      accent: "from-blue-400/20 to-indigo-400/20 border-blue-400/30",
      iconColor: "text-blue-300",
    },
    {
      icon: Zap,
      title: "AI Analysis",
      desc: "Groq-powered insights reveal trends and personalized savings tips.",
      accent: "from-yellow-400/20 to-orange-400/20 border-yellow-400/30",
      iconColor: "text-yellow-300",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      desc: "Email & WhatsApp notifications for limits, spikes, and goals.",
      accent: "from-rose-400/20 to-red-400/20 border-rose-400/30",
      iconColor: "text-rose-300",
    },
    {
      icon: Cloud,
      title: "Receipt Storage",
      desc: "Secure Cloudinary uploads keep your proofs neatly organized.",
      accent: "from-purple-400/20 to-fuchsia-400/20 border-purple-400/30",
      iconColor: "text-purple-300",
    },
  ]

  const checklist = [
    "Add expenses in seconds",
    "One-tap receipt upload",
    "Realtime budget tracking",
    "AI insights in INR",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Top ribbon */}
      <div className="w-full bg-gradient-to-r from-emerald-600/20 via-cyan-600/20 to-blue-600/20 border-b border-slate-800 text-center text-sm text-slate-300 py-2">
        ✨ New: AI analysis now supports custom questions & follow-ups.
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70 bg-slate-950/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-7 h-7 text-emerald-500" aria-hidden />
            <span className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              ExpenseTrack
            </span>
          </div>
          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a href="#features" className="px-3 py-2 text-slate-300 hover:text-white transition">
              Features
            </a>
            <a href="#how" className="px-3 py-2 text-slate-300 hover:text-white transition">
              How it works
            </a>
            <a href="#pricing" className="px-3 py-2 text-slate-300 hover:text-white transition">
              Pricing
            </a>
            <a href="#faq" className="px-3 py-2 text-slate-300 hover:text-white transition">
              FAQ
            </a>
            <button
              type="button"
              onClick={() => navigate("/auth/signin")}
              className="px-4 py-2 text-slate-300 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate("/auth/signup")}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition"
            >
              Get Started
            </button>
          </div>
          {/* Mobile menu button */}
          <button
            className="sm:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-800/60 border border-slate-700"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="sm:hidden border-t border-slate-800 px-4 py-3 space-y-2 bg-slate-950/80">
            {[
              {
                label: "Features",
                href: "#features",
              },
              { label: "How it works", href: "#how" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-2 py-2 rounded hover:bg-slate-800/60 text-slate-300"
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => navigate("/auth/signin")}
                className="flex-1 px-4 py-2 text-slate-300 rounded border border-slate-700 hover:bg-slate-800/60"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/auth/signup")}
                className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_40%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.15),transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10 md:pt-24 md:pb-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Smart Expense Tracking
              </span>
              <br />
              <span className="text-slate-200">for Modern Financial Control</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl">
              Manage expenses, set budgets, get AI-powered insights, and receive real-time alerts. All in one powerful
              platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
              type="button"
              onClick={() => navigate("/auth/signup")}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold inline-flex items-center justify-center gap-2 transition transform hover:scale-105"
            >
              Start Tracking <ArrowRight className="w-5 h-5" />
            </button>
              {/* <a
                href="#demo"
                className="px-6 py-3 border border-slate-700 hover:border-slate-500 rounded-lg font-semibold inline-flex items-center justify-center gap-2 hover:bg-slate-800/50"
              >
                Watch Demo
              </a> */}
            </div>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              {checklist.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" /> {c}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-4 text-slate-400">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Your data is encrypted in transit and at rest.</span>
            </div>
          </div>

          {/* Mocked app preview card */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 blur-xl" />
            <div className="relative rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-2xl">
              <header className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                </div>
                <span className="text-xs text-slate-400">Preview</span>
              </header>
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">This month</p>
                    <p className="text-2xl font-bold">₹ 24,560</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Budget</p>
                    <p className="text-2xl font-bold text-emerald-400">₹ 25,000</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Food",
                      amt: 8450,
                    },
                    { label: "Travel", amt: 5100 },
                    { label: "Office", amt: 3100 },
                  ].map((c) => (
                    <div key={c.label} className="rounded-lg border border-slate-700 p-3 bg-slate-800/50">
                      <p className="text-xs text-slate-400">{c.label}</p>
                      <p className="text-lg font-semibold">₹ {c.amt.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-lg font-medium inline-flex items-center justify-center gap-2">
                  Export PDF <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="font-display text-4xl font-bold text-center mb-14">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, accent, iconColor }) => (
            <div
              key={title}
              className={`group p-6 rounded-xl bg-gradient-to-br ${accent} border transition hover:translate-y-[-2px] hover:shadow-emerald-500/10 hover:shadow-xl`}
            >
              <Icon className={`w-8 h-8 ${iconColor} mb-4`} />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 items-start">
          {[
            {
              step: "01",
              title: "Create an account",
              desc: "Sign up and set your monthly budget & notification preferences.",
            },
            {
              step: "02",
              title: "Track & upload receipts",
              desc: "Add expenses manually or with a photo—Cloudinary stores everything.",
            },
            {
              step: "03",
              title: "Analyze & export",
              desc: "Ask AI questions about your spend; export polished PDFs in a click.",
            },
          ].map((s) => (
            <div key={s.step} className="p-6 rounded-xl border border-slate-700 bg-slate-900/60">
              <p className="text-sm text-slate-400">Step {s.step}</p>
              <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser / CTA */}
      <section id="pricing" className="px-6 py-20 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Start free, upgrade anytime</h2>
        <p className="text-slate-400 mb-8">
          Unlimited manual entries, AI insights on demand, and secure receipt storage.
        </p>
        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <p className="text-slate-300">Starter</p>
              <p className="text-4xl font-bold mt-1">
                ₹0<span className="text-lg text-slate-400">/mo</span>
              </p>
              <ul className="mt-4 space-y-2 text-left">
                {["Up to 500 uploads/mo", "Email/WhatsApp alerts", "1-click PDF export", "Basic AI analysis"].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-emerald-400" /> {t}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => navigate("/auth/signup")}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-lg font-semibold inline-flex items-center justify-center gap-2"
            >
              Start Free Today <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <Accordion
          items={[
            {
              q: "How do I upload a receipt?",
              a: "Go to Add Expense → choose a file field named 'receipt' and include the JSON in a 'data' field. The app will parse and store it in Cloudinary.",
            },
            {
              q: "Do you support Indian Rupees?",
              a: "Yes. Budgets, charts, and AI insights are INR-first.",
            },
            {
              q: "Can I export all expenses as PDF?",
              a: "Yes. Use the Export PDF action; it downloads a structured report for any date range (current build exports all).",
            },
          ]}
        />
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="w-6 h-6 text-emerald-500" />
                <span className="text-lg font-bold">ExpenseTrack</span>
              </div>
              <p className="text-slate-400 text-sm max-w-xs">Track smarter. Spend wiser. Save faster.</p>
            </div>
            <FooterCol title="Product" links={["Features", "Pricing", "Security"]} />
            <FooterCol title="Company" links={["About", "Blog", "Contact"]} />
            <FooterCol title="Legal" links={["Privacy", "Terms"]} />
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} ExpenseTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="font-semibold text-white mb-3">{title}</h4>
      <ul className="space-y-2 text-slate-400">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="hover:text-white transition">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Accordion({ items }) {
  const [active, setActive] = useState(0)
  return (
    <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 overflow-hidden">
      {items.map((it, idx) => {
        const open = idx === active
        return (
          <div key={it.q}>
            <button
              className="w-full text-left px-5 py-4 bg-slate-900/40 hover:bg-slate-900/60 flex items-center justify-between"
              onClick={() => setActive(open ? -1 : idx)}
              aria-expanded={open}
            >
              <span className="font-medium">{it.q}</span>
              <span className="text-slate-400">{open ? "−" : "+"}</span>
            </button>
            {open && <div className="px-5 pb-5 text-slate-400">{it.a}</div>}
          </div>
        )
      })}
    </div>
  )
}
