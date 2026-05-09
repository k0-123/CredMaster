"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  auditId: string;
}

export default function PDFExportButton({ auditId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    trackEvent('pdf_exported', { auditId });
    setLoading(true);
    try {
      // In a real app, this would call a PDF generation service
      // For now, we'll simulate a download or use window.print()
      window.print();
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-black font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm disabled:opacity-50"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {loading ? "Exporting..." : "Export PDF"}
    </button>
  );
}
