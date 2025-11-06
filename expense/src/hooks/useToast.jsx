import { createContext, useContext, useState, useCallback } from "react"

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const add = useCallback(
    (type, text, duration = 3000) => {
      const id = Math.random().toString(36).substr(2, 9)
      setItems((prev) => [...prev, { id, type, text }])

      if (duration) {
        setTimeout(() => remove(id), duration)
      }
      return id
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => remove(item.id)}
            className={`cursor-pointer rounded-lg border px-4 py-3 text-sm font-medium transition animate-in fade-in slide-in-from-bottom-2 ${
              item.type === "success"
                ? "border-emerald-700/50 bg-emerald-900/50 text-emerald-200"
                : item.type === "error"
                  ? "border-rose-700/50 bg-rose-900/50 text-rose-200"
                  : "border-slate-700 bg-slate-900/80 text-slate-200"
            }`}
          >
            {item.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
