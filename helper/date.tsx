import { format, isValid, parseISO } from "date-fns";
import { z } from "zod";

export function formatDate(
  date?: string,
  pattern: string = "PPP"
) {
  if (!date) return "—";

  const parsed = parseISO(date);

  if (!isValid(parsed)) return "—";

  return format(parsed, pattern);
}




export const dateFromJson = z.preprocess((value) => {
  if (typeof value === 'string') {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : value;
  }
  return value;
}, z.date());
