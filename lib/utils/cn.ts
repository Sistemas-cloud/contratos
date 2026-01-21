/**
 * Utilidad para combinar clases de Tailwind CSS
 * Usado por componentes Shadcn
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
