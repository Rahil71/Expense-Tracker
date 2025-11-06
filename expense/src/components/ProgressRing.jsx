export function BudgetProgressRing({ spent, limit }) {
  const percentage = limit ? (spent / limit) * 100 : 0
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const color = percentage > 100 ? "#ef4444" : percentage > 80 ? "#eab308" : "#10b981"

  return (
    <div className="relative flex items-center justify-center">
      <svg width="120" height="120" className="transform -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.35s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold">{Math.round(percentage)}%</p>
        <p className="text-xs text-slate-400">of budget</p>
      </div>
    </div>
  )
}
