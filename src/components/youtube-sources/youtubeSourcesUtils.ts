export function getVerdictClass(verdict: string) {
  if (verdict === "Nên tham khảo") return "bg-emerald-100 text-emerald-700";
  if (verdict === "Cần kiểm tra") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export function getScoreClass(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

export function getTrendSuggestionClass(suggestion: string) {
  if (suggestion === "Nên tham khảo" || suggestion === "Nên khai thác") {
    return "bg-emerald-100 text-emerald-700";
  }

  return "bg-amber-100 text-amber-700";
}
