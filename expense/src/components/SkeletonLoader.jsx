export function SkeletonExpenseRow() {
  return (
    <tr className="border-b border-slate-800 animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 w-32 bg-slate-700 rounded" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-20 bg-slate-700 rounded" />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="h-4 w-24 bg-slate-700 rounded ml-auto" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-20 bg-slate-700 rounded" />
      </td>
      <td className="px-6 py-4 text-center">
        <div className="h-4 w-8 bg-slate-700 rounded mx-auto" />
      </td>
      <td className="px-6 py-4 text-center">
        <div className="h-4 w-8 bg-slate-700 rounded mx-auto" />
      </td>
    </tr>
  )
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 animate-pulse">
      <div className="h-4 w-24 bg-slate-700 rounded mb-2" />
      <div className="h-8 w-32 bg-slate-700 rounded" />
    </div>
  )
}
