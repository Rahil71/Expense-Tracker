import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2, Lock, Mail, User, PieChart } from "lucide-react"
import { signinSchema, signupSchema } from "../hooks/useFormValidation"

const BASE = import.meta.env.VITE_API_BASE;

export default function Signin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [errors, setErrors] = useState({})

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setErrors({})

    try {
      const validation = signinSchema.safeParse({ email, password })
      if (!validation.success) {
        const fieldErrors = {}
        validation.error.issues.forEach((iss) => {
          fieldErrors[iss.path?.[0]] = iss.message
        })
        setErrors(fieldErrors)
        return
      }

      setLoading(true)
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Login failed")
      localStorage.setItem("et_token", data.token)
      localStorage.setItem("et_user", JSON.stringify(data.user))
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue tracking smartly.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <TextField
            label="Email"
            type="email"
            icon={<Mail className="w-4 h-4 text-slate-400" />}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors({ ...errors, email: "" })
            }}
            placeholder="you@example.com"
            autoFocus
            error={errors.email}
          />
          {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
        </div>

        <div>
          <PasswordField
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors({ ...errors, password: "" })
            }}
            show={showPw}
            onToggle={() => setShowPw((v) => !v)}
            error={errors.password}
          />
          {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
        </div>

        {error && <Alert msg={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 font-semibold"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <Link className="text-emerald-400 hover:text-emerald-300" to="/auth/signup">
          Create one
        </Link>
      </p>
    </AuthShell>
  )
}

export function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [budgetLimit, setBudgetLimit] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [errors, setErrors] = useState({})

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setErrors({})

    try {
      const validation = signupSchema.safeParse({
        name,
        email,
        password,
        budgetLimit: budgetLimit || undefined,
        phoneNumber: phoneNumber || undefined,
      })

      if (!validation.success) {
   const fieldErrors = {}
   validation.error.issues.forEach((iss) => {
     fieldErrors[iss.path?.[0]] = iss.message
   })
   setErrors(fieldErrors)
   return
 }

      setLoading(true)
      const payload = {
        name,
        email,
        password,
        budgetLimit: budgetLimit ? Number(budgetLimit) : undefined,
        phoneNumber: phoneNumber || undefined,
      }

      const res = await fetch(`${BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Signup failed")
      localStorage.setItem("et_token", data.token)
      localStorage.setItem("et_user", JSON.stringify(data.user))
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Set a budget and start saving in minutes.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <TextField
            label="Full name"
            icon={<User className="w-4 h-4 text-slate-400" />}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setErrors({ ...errors, name: "" })
            }}
            placeholder="Rehan Khan"
            autoFocus
            error={errors.name}
          />
          {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
        </div>

        <div>
          <TextField
            label="Email"
            type="email"
            icon={<Mail className="w-4 h-4 text-slate-400" />}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors({ ...errors, email: "" })
            }}
            placeholder="you@example.com"
            error={errors.email}
          />
          {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
        </div>

        <div>
          <PasswordField
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors({ ...errors, password: "" })
            }}
            show={showPw}
            onToggle={() => setShowPw((v) => !v)}
            error={errors.password}
          />
          {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <TextField
              label="Monthly budget (₹)"
              type="number"
              value={budgetLimit}
              onChange={(e) => {
                setBudgetLimit(e.target.value)
                setErrors({ ...errors, budgetLimit: "" })
              }}
              placeholder="25000"
              error={errors.budgetLimit}
            />
            {errors.budgetLimit && <p className="text-xs text-rose-400 mt-1">{errors.budgetLimit}</p>}
          </div>

          <div>
            <TextField
              label="WhatsApp number (optional)"
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value)
                setErrors({ ...errors, phoneNumber: "" })
              }}
              placeholder="+919876543210"
              error={errors.phoneNumber}
            />
            {errors.phoneNumber && <p className="text-xs text-rose-400 mt-1">{errors.phoneNumber}</p>}
          </div>
        </div>

        {error && <Alert msg={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 font-semibold"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link className="text-emerald-400 hover:text-emerald-300" to="/auth/signin">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}

// ---------- Shared Shell & Inputs ----------

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <nav className="px-6 h-16 border-b border-slate-800 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <PieChart className="w-6 h-6 text-emerald-500" />
          <span className="font-semibold text-lg">ExpenseTrack</span>
        </Link>
        <div className="text-sm text-slate-400 hidden sm:block">Secure • Simple • INR-first</div>
      </nav>

      <section className="px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-slate-400 mt-1">{subtitle}</p>
            <div className="mt-6">{children}</div>
            <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs">
              <Lock className="w-4 h-4" /> Your credentials are encrypted in transit.
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function TextField({ label, icon, type = "text", error, ...props }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <div
        className={`mt-1.5 flex items-center gap-2 rounded-lg border px-3 py-2 focus-within:border-emerald-500 ${
          error ? "border-rose-700/50 bg-rose-900/20" : "border-slate-700 bg-slate-900/60"
        }`}
      >
        {icon ? icon : null}
        <input className="w-full bg-transparent outline-none placeholder:text-slate-500" type={type} {...props} />
      </div>
    </label>
  )
}

function PasswordField({ label, value, onChange, show, onToggle, error }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <div
        className={`mt-1.5 flex items-center gap-2 rounded-lg border px-3 py-2 focus-within:border-emerald-500 ${
          error ? "border-rose-700/50 bg-rose-900/20" : "border-slate-700 bg-slate-900/60"
        }`}
      >
        <Lock className="w-4 h-4 text-slate-400" />
        <input
          className="w-full bg-transparent outline-none placeholder:text-slate-500"
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle password"
          className="text-slate-400 hover:text-slate-200"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </label>
  )
}

function Alert({ msg }) {
  return (
    <div className="rounded-lg border border-rose-700/50 bg-rose-900/30 text-rose-200 px-3 py-2 text-sm">{msg}</div>
  )
}
