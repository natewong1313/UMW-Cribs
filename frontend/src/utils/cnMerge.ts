// https://ui.shadcn.com/docs/installation/manual
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export default function cnMerge(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
