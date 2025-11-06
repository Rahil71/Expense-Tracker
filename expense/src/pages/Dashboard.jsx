import { useState, useEffect } from "react"
import {
  LogOut,
  Plus,
  BarChart3,
  Zap,
  FileText,
  Trash2,
  Loader2,
  AlertCircle,
  TrendingUp,
  PieChart,
  ImageIcon,
  Edit2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../hooks/useToast"
import { BudgetProgressRing } from "../components/ProgressRing"
import { SkeletonExpenseRow, SkeletonStatCard } from "../components/SkeletonLoader"
import { expenseSchema } from "../hooks/useFormValidation"
import ReceiptModal from "../components/ReceiptModal"

const BASE = import.meta.env.VITE_API_BASE

export default function Dashboard() {
  const navigate = useNavigate()
  const { add: toast } = useToast()
  const [user, setUser] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showAnalyzer, setShowAnalyzer] = useState(false)
  const [error, setError] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [analyzeLoading, setAnalyzeLoading] = useState(false)
  const [analyzeError, setAnalyzeError] = useState("")
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  // Added state for budget modal and delete all loading
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [budgetLoading, setBudgetLoading] = useState(false)
  const [deleteAllLoading, setDeleteAllLoading] = useState(false)

  const token = localStorage.getItem("et_token")

  useEffect(() => {
    if (!token) {
      navigate("/auth/signin", { replace: true })
      return
    }

    const storedUser = localStorage.getItem("et_user")
    if (storedUser) setUser(JSON.parse(storedUser))
    fetchExpenses()

    const handleKeyDown = (e) => {
      if (e.key === "/" && !showAddForm) {
        e.preventDefault()
        setShowAddForm(true)
      }
      if (e.key === "Escape" && showAddForm) {
        setShowAddForm(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [token, navigate, showAddForm])

  useEffect(() => {
    const savedFilter = localStorage.getItem("et_categoryFilter")
    if (savedFilter) {
      setCategoryFilter(savedFilter)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("et_categoryFilter", categoryFilter)
  }, [categoryFilter])

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelectedReceipt(null)
    if (selectedReceipt) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedReceipt])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch expenses")
      const data = await res.json()
      setExpenses(data)
    } catch (err) {
      setError(err.message)
      toast("error", "Failed to load expenses")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("et_token")
    localStorage.removeItem("et_user")
    toast("success", "Logged out successfully")
    navigate("/")
  }

  const onExpenseAdded = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev])
    setShowAddForm(false)
    toast("success", "Expense added successfully!")
  }

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return
    try {
      const res = await fetch(`${BASE}/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Delete failed")
      setExpenses((prev) => prev.filter((e) => e._id !== id))
      toast("success", "Expense deleted")
    } catch (err) {
      setError(err.message)
      toast("error", "Failed to delete expense")
    }
  }

  // Added function to delete all expenses
  const handleDeleteAllExpenses = async () => {
    if (!window.confirm("Are you sure? This will delete ALL expenses. This action cannot be undone.")) return
    try {
      setDeleteAllLoading(true)
      const res = await fetch(`${BASE}/expenses/delete-all`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Delete all failed")
      const data = await res.json()
      setExpenses([])
      toast("success", data.message || "All expenses deleted")
    } catch (err) {
      toast("error", err.message || "Failed to delete all expenses")
    } finally {
      setDeleteAllLoading(false)
    }
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = (user?.budgetLimit || 0) - totalSpent
  const percentageUsed = user?.budgetLimit ? (totalSpent / user.budgetLimit) * 100 : 0

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})

  const filteredExpenses = categoryFilter === "all" ? expenses : expenses.filter((e) => e.category === categoryFilter)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-bold">ExpenseTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:block">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:border-red-500 hover:text-red-400 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-rose-700/50 bg-rose-900/30 text-rose-200 px-4 py-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <>
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </>
          ) : (
            <>
              <div>
                <StatCard
                  title="Total Spent"
                  value={`₹ ${totalSpent.toLocaleString()}`}
                  icon={<TrendingUp className="w-6 h-6" />}
                  color="emerald"
                />
                {/* Added delete all expenses button below total spent */}
                <button
                  onClick={handleDeleteAllExpenses}
                  disabled={deleteAllLoading || expenses.length === 0}
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-rose-700/50 hover:border-rose-500 hover:bg-rose-900/20 disabled:opacity-50 disabled:cursor-not-allowed text-rose-400 hover:text-rose-300 transition font-semibold text-sm"
                >
                  {deleteAllLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {deleteAllLoading ? "Deleting..." : "Delete All"}
                </button>
              </div>
              {/* Added edit button to budget limit card */}
              <div className="relative">
                <StatCard
                  title="Budget Limit"
                  value={`₹ ${(user?.budgetLimit || 0).toLocaleString()}`}
                  icon={<BarChart3 className="w-6 h-6" />}
                  color="cyan"
                />
                <button
                  onClick={() => setShowBudgetModal(true)}
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-cyan-700/50 hover:border-cyan-500 hover:bg-cyan-900/20 text-cyan-400 hover:text-cyan-300 transition font-semibold text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Update Budget
                </button>
              </div>
              <StatCard
                title="Remaining"
                value={`₹ ${Math.max(0, remaining).toLocaleString()}`}
                icon={<PieChart className="w-6 h-6" />}
                color={remaining < 0 ? "rose" : "lime"}
              />
            </>
          )}
        </div>

        {/* Budget Progress Ring */}
        {!loading && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 mb-8 flex items-center justify-between flex-col md:flex-row gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">Budget Progress</h3>
              <p className="text-sm text-slate-400">
                {percentageUsed > 100
                  ? "You've exceeded your budget"
                  : percentageUsed > 80
                    ? "Warning: Approaching limit"
                    : "On track!"}
              </p>
            </div>
            <div className="w-32">
              <BudgetProgressRing spent={totalSpent} limit={user?.budgetLimit} />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <ActionButton
            icon={<Plus className="w-5 h-5" />}
            label="Add Expense"
            onClick={() => {
              setEditingId(null)
              setShowAddForm(!showAddForm)
            }}
            active={showAddForm}
            hint="or press /"
          />
          <ActionButton
            icon={<Zap className="w-5 h-5" />}
            label="AI Analysis"
            onClick={() => setShowAnalyzer(!showAnalyzer)}
            active={showAnalyzer}
          />
          <ActionButton
            icon={<FileText className="w-5 h-5" />}
            label="Export PDF"
            onClick={() => handleExportPDF(token, toast)}
          />
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <AddExpenseForm
            token={token}
            onClose={() => setShowAddForm(false)}
            onSuccess={onExpenseAdded}
            toast={toast}
          />
        )}

        {/* AI Analyzer */}
        {showAnalyzer && (
          <AIAnalyzer
            token={token}
            onClose={() => setShowAnalyzer(false)}
            toast={toast}
            analyzeLoading={analyzeLoading}
            setAnalyzeLoading={setAnalyzeLoading}
            analyzeError={analyzeError}
            setAnalyzeError={setAnalyzeError}
          />
        )}

        {/* Category Filter */}
        {Object.keys(categoryTotals).length > 0 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                categoryFilter === "all"
                  ? "bg-emerald-500 text-white"
                  : "border border-slate-700 text-slate-300 hover:border-slate-600"
              }`}
            >
              All
            </button>
            {Object.keys(categoryTotals).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  categoryFilter === cat
                    ? "bg-emerald-500 text-white"
                    : "border border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Expenses List */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h3 className="font-semibold text-lg">
              {categoryFilter === "all" ? "Recent Expenses" : `${categoryFilter} Expenses`}
            </h3>
          </div>

          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/40">
                    <th className="px-6 py-3 text-left font-semibold">Title</th>
                    <th className="px-6 py-3 text-left font-semibold">Category</th>
                    <th className="px-6 py-3 text-right font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold">Date</th>
                    <th className="px-6 py-3 text-center font-semibold">Receipt</th>
                    <th className="px-6 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <SkeletonExpenseRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">
              {categoryFilter === "all"
                ? "No expenses yet. Add one to get started!"
                : `No expenses in ${categoryFilter} category.`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/40">
                    <th className="px-6 py-3 text-left font-semibold">Title</th>
                    <th className="px-6 py-3 text-left font-semibold">Category</th>
                    <th className="px-6 py-3 text-right font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold">Date</th>
                    <th className="px-6 py-3 text-center font-semibold">Receipt</th>
                    <th className="px-6 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense._id} className="border-b border-slate-800 hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">
                            {expense.title}
                            {expense.receiptURL && (
                              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                                receipt
                              </span>
                            )}
                          </p>
                          {expense.notes && <p className="text-xs text-slate-400">{expense.notes}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-800 rounded text-xs">{expense.category}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold font-display tnum">
                        ₹ {expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-400">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                        {expense.receiptURL ? (
                          <button
                            onClick={() => setSelectedReceipt(expense.receiptURL)}
                            className="inline-flex items-center justify-center p-2 rounded hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition"
                            title="View receipt"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteExpense(expense._id)}
                          className="inline-flex items-center justify-center p-2 rounded hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Breakdown Heatmap */}
        {!loading && Object.keys(categoryTotals).length > 0 && (
          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/60 p-6">
            <h3 className="font-semibold text-lg mb-4">Spending by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const percentage = (amount / totalSpent) * 100
                  const intensity = Math.min(percentage / 15, 1)
                  return (
                    <div
                      key={category}
                      className="p-4 rounded-lg border border-slate-700 transition hover:border-emerald-500/50"
                      style={{
                        backgroundColor: `rgba(16, 185, 129, ${0.1 + intensity * 0.2})`,
                      }}
                    >
                      <p className="text-sm text-slate-400">{category}</p>
                      <p className="text-lg font-semibold mt-1 font-display tnum">₹ {amount.toLocaleString()}</p>
                      <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{percentage.toFixed(1)}% of total</p>
                    </div>
                  )
                })}
            </div>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && <ReceiptModal receiptUrl={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}

      {/* Added budget limit update modal */}
      {showBudgetModal && (
        <UpdateBudgetModal
          currentBudget={user?.budgetLimit || 0}
          onClose={() => setShowBudgetModal(false)}
          token={token}
          toast={toast}
          loading={budgetLoading}
          setLoading={setBudgetLoading}
          onSuccess={(newBudget) => {
            setUser({ ...user, budgetLimit: newBudget })
            setShowBudgetModal(false)
          }}
        />
      )}
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-500/30",
    lime: "from-lime-500/20 to-lime-500/5 border-lime-500/30",
  }
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${colorMap[color] || colorMap.emerald} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2 font-display">{value}</p>
        </div>
        <div className="text-slate-500">{icon}</div>
      </div>
    </div>
  )
}

function ActionButton({ icon, label, onClick, active, hint }) {
  return (
    <button
      onClick={onClick}
      title={hint}
      className={`inline-flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-lg font-semibold transition ${
        active
          ? "bg-emerald-500 text-white"
          : "border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-emerald-400"
      }`}
    >
      {icon}
      <span className="hidden sm:inline text-xs sm:text-base">{label}</span>
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </button>
  )
}

// Added update budget modal component
function UpdateBudgetModal({ currentBudget, onClose, token, toast, loading, setLoading, onSuccess }) {
  const [newBudget, setNewBudget] = useState(currentBudget.toString())
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!newBudget || isNaN(newBudget) || Number(newBudget) <= 0) {
      setError("Please enter a valid budget amount")
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${BASE}/expenses/update-budget-limit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newLimit: Number(newBudget) }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to update budget")

      toast("success", "Budget limit updated!")
      localStorage.setItem(
        "et_user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("et_user")),
          budgetLimit: Number(newBudget),
        }),
      )
      onSuccess(Number(newBudget))
    } catch (err) {
      setError(err.message)
      toast("error", err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Update Budget Limit</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Current Budget: ₹ {currentBudget.toLocaleString()}
            </label>
            <input
              type="number"
              value={newBudget}
              onChange={(e) => {
                setNewBudget(e.target.value)
                setError("")
              }}
              placeholder="Enter new budget limit"
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white outline-none focus:border-cyan-500"
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 disabled:opacity-70 font-semibold"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 rounded-lg border border-slate-700 hover:border-slate-600 font-semibold disabled:opacity-70"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddExpenseForm({ token, onClose, onSuccess, toast }) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [errors, setErrors] = useState({})
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringFrequency, setRecurringFrequency] = useState("monthly")
  const [previewUrl, setPreviewUrl] = useState(null)

  const categories = ["Food", "Travel", "Office", "Entertainment", "Health", "Other"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setErrors({})

    try {
      const validation = expenseSchema.safeParse({
        title,
        amount,
        category,
        date,
        notes: notes || undefined,
        isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : undefined,
      })

      if (!validation.success) {
        const fieldErrors = {}
        validation.error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
        return
      }

      setLoading(true)

      const formData = new FormData()
      formData.append(
        "data",
        JSON.stringify({
          title,
          amount: Number(amount),
          category,
          date,
          notes,
          isRecurring,
          recurringFrequency: isRecurring ? recurringFrequency : undefined,
        }),
      )
      if (receipt) {
        formData.append("receipt", receipt)
      }

      const res = await fetch(`${BASE}/expenses`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to add expense")

      toast("success", isRecurring ? "Recurring expense added!" : "Expense added!")
      onSuccess(data.expense)
    } catch (err) {
      setError(err.message)
      toast("error", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceipt(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-6 mb-8">
      <h3 className="font-semibold text-lg mb-4">Add New Expense</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Expense title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setErrors({ ...errors, title: "" })
              }}
              className={`w-full px-3 py-2 rounded-lg border outline-none focus:border-emerald-500 ${
                errors.title ? "border-rose-700/50 bg-rose-900/20" : "border-slate-700 bg-slate-900/60"
              }`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          <div>
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setErrors({ ...errors, amount: "" })
              }}
              className={`w-full px-3 py-2 rounded-lg border outline-none focus:border-emerald-500 ${
                errors.amount ? "border-rose-700/50 bg-rose-900/20" : "border-slate-700 bg-slate-900/60"
              }`}
            />
            {errors.amount && <p className="text-xs text-rose-400 mt-1">{errors.amount}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setErrors({ ...errors, category: "" })
              }}
              className={`w-full px-3 py-2 rounded-lg border outline-none focus:border-emerald-500 ${
                errors.category ? "border-rose-700/50 bg-rose-900/20" : "border-slate-700 bg-slate-900/60"
              }`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-rose-400 mt-1">{errors.category}</p>}
          </div>

          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                setErrors({ ...errors, date: "" })
              }}
              className={`w-full px-3 py-2 rounded-lg border outline-none focus:border-emerald-500 ${
                errors.date ? "border-rose-700/50 bg-rose-900/20" : "border-slate-700 bg-slate-900/60"
              }`}
            />
            {errors.date && <p className="text-xs text-rose-400 mt-1">{errors.date}</p>}
          </div>
        </div>

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/60 outline-none focus:border-emerald-500 resize-none"
          rows="2"
        />

        <label className="block">
          <span className="text-sm text-slate-300">Receipt (optional)</span>
          <input
            type="file"
            onChange={handleReceiptChange}
            className="mt-1 block w-full text-sm text-slate-400"
            accept="image/*"
          />
          {previewUrl && (
            <div className="mt-3 relative inline-block">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Receipt preview"
                className="max-w-xs max-h-48 rounded-lg border border-slate-700"
              />
              <button
                type="button"
                onClick={() => {
                  setReceipt(null)
                  setPreviewUrl(null)
                }}
                className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 rounded text-xs font-semibold"
              >
                Clear
              </button>
            </div>
          )}
        </label>

        {/* Recurring Expense Toggle */}
        <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-slate-300">Make this a recurring expense</span>
        </label>

        {isRecurring && (
          <select
            value={recurringFrequency}
            onChange={(e) => setRecurringFrequency(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/60 outline-none focus:border-emerald-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        )}

        {error && (
          <div className="rounded-lg border border-rose-700/50 bg-rose-900/30 text-rose-200 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 font-semibold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? "Adding..." : "Add Expense"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-slate-700 hover:border-slate-600 font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function AIAnalyzer({ token, onClose, toast, analyzeLoading, setAnalyzeLoading, analyzeError, setAnalyzeError }) {
  const [query, setQuery] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setError("")
    if (!query) {
      setError("Please enter a question")
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${BASE}/expenses/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Analysis failed")
      setAnalysis(data.message || "No analysis available")
      toast("success", "Analysis complete!")
    } catch (err) {
      setError(err.message)
      toast("error", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setError("")
    handleAnalyze({ preventDefault: () => {} })
  }

  return (
    <div className="rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-6 mb-8">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        AI Spending Analysis
      </h3>

      <form onSubmit={handleAnalyze} className="space-y-4">
        <input
          type="text"
          placeholder="Ask AI about your spending... (e.g., 'Where can I cut spending?')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/60 outline-none focus:border-yellow-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 disabled:opacity-70 font-semibold text-slate-950"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-rose-700/50 bg-rose-900/30 text-rose-200 px-3 py-2 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={handleRetry}
            disabled={loading}
            className="ml-2 px-3 py-1 bg-rose-700 hover:bg-rose-600 disabled:opacity-70 rounded text-xs font-medium whitespace-nowrap"
          >
            Try Again
          </button>
        </div>
      )}

      {analysis && (
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-slate-200 whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
          {analysis}
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-4 w-full px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600 font-semibold"
      >
        Close
      </button>
    </div>
  )
}

async function handleExportPDF(token, toast) {
  try {
    const res = await fetch(`${BASE}/expenses/exportpdf`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Export failed")

    // Try to read filename from Content-Disposition
    const cd = res.headers.get("content-disposition") || ""
    const match = /filename\*=UTF-8''(?<utf>[^;]+)|filename="?(?<plain>[^";]+)"?/i.exec(cd)
    const headerFilename = decodeURIComponent(match?.groups?.utf || "").trim() || (match?.groups?.plain || "").trim()

    const fallbackFilename = `expenses_${new Date().toISOString().slice(0, 10)}.pdf`
    const filename = headerFilename || fallbackFilename

    const blob = await res.blob()

    // (Optional) sanity-check content type
    // if (!blob.type.includes("pdf")) throw new Error("Invalid file type");

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.rel = "noopener" // minor safety
    document.body.appendChild(a)
    a.click()

    // Give the browser a moment, then revoke & cleanup
    setTimeout(() => {
      URL.revokeObjectURL(url)
      a.remove()
    }, 100)

    toast("success", `Exported: ${filename}`)
  } catch (err) {
    toast("error", err.message || "Export failed")
  }
}
