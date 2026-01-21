import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSSクラス名をマージするユーティリティ関数
 * clsx と tailwind-merge を組み合わせて、クラス名の競合を解決します
 * 
 * @param inputs - マージするクラス名（文字列、オブジェクト、配列など）
 * @returns マージされたクラス名の文字列
 * 
 * @example
 * cn("px-2 py-1", "px-4") // "py-1 px-4" (px-2 が px-4 で上書きされる)
 * cn({ "bg-red-500": true, "text-white": false }) // "bg-red-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
