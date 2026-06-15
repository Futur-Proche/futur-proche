/**
 * Strip HTML tags from a string and decode common entities.
 * Returns plain text suitable for previews / line-clamped descriptions.
 */
export function stripHtml(html: string | null | undefined, maxLen?: number): string {
  if (!html) return "";
  const text = String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (maxLen && text.length > maxLen) return text.slice(0, maxLen - 1).trimEnd() + "…";
  return text;
}
