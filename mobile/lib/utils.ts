// lib/utils.js
export interface FormatDateOptions {
  year: "numeric";
  month: "long";
  day: "numeric";
}

export function formatDate(dateString: string): string {
  // Format date from "2025-10-08T00:00:00.000Z" to "October 8, 2025"
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
