// lib/utils.js
export interface FormatDateOptions {
  year: "numeric";
  month: "long";
  day: "numeric";
}

export function formatDate(dateString: string): string {
  // format date nicely
  // example: from this 👉 2025-05-20 to this 👉 May 20, 2025
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as FormatDateOptions);
}
