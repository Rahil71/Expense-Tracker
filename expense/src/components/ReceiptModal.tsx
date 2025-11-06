import { Download, X } from "lucide-react";

export default function ReceiptModal({ receiptUrl, onClose }) {
  const forceAttachment = (url) => {
  // Works for URLs containing /upload/…  (keeps other transformations)
  if (!url.includes('/upload/')) return url;
  // Insert fl_attachment right after /upload
  return url.replace('/upload/', '/upload/fl_attachment/');
};

const handleDownload = () => {
  const a = document.createElement('a');
  const dlUrl = forceAttachment(receiptUrl);
  a.href = dlUrl;
  a.download =
    dlUrl.split('/').pop() || `receipt_${new Date().toISOString().slice(0, 10)}.jpg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};


  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
          <h3 className="font-semibold">Receipt</h3>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 transition text-sm"
              title="Download receipt"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-300 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex items-center justify-center bg-slate-950/50">
          <img
            src={receiptUrl || "/placeholder.svg"}
            alt="Receipt"
            className="max-w-full max-h-[70vh] rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = document.createElement("div");
              fallback.className = "text-slate-400 text-sm";
              fallback.textContent = "Couldn’t load receipt.";
              e.currentTarget.parentElement.appendChild(fallback);
            }}
          />
        </div>
      </div>
    </div>
  );
}
