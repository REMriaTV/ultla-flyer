"use client";

import type { IpadicFeatures } from "@/types/kuromoji";
import { cn } from "@/lib/utils";

interface RubyTextDisplayProps {
  tokens: IpadicFeatures[];
  fontSize?: string;
  isVertical?: boolean;
}

/**
 * カタカナをひらがなに変換するヘルパー関数
 * Unicode値の差分（-96）を使用して変換
 * 
 * @param str - カタカナ文字列
 * @returns ひらがなに変換された文字列
 */
function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (char) => {
    // カタカナ（\u30A1-\u30F6）をひらがな（\u3041-\u3096）に変換
    return String.fromCharCode(char.charCodeAt(0) - 96);
  });
}

/**
 * 文字列に漢字が含まれているかチェックする関数
 * 
 * @param str - チェック対象の文字列
 * @returns 漢字が含まれている場合 true
 */
function containsKanji(str: string): boolean {
  // 漢字のUnicode範囲: \u4e00-\u9faf
  return /[\u4e00-\u9faf]/.test(str);
}

/**
 * Kuromojiの解析結果をルビ付きで表示するコンポーネント
 * 学校の教科書風のデザインで表示
 * 
 * @param tokens - 形態素解析結果のトークン配列
 * @param fontSize - フォントサイズクラス（例: "text-lg"）
 * @param isVertical - 縦書きモードかどうか
 */
export function RubyTextDisplay({
  tokens,
  fontSize = "text-lg",
  isVertical = false,
}: RubyTextDisplayProps) {
  if (tokens.length === 0) {
    return (
      <div className={cn("text-gray-400 italic", fontSize)}>
        テキストがありません
      </div>
    );
  }

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className={cn(
        // 基本スタイル: 白い紙の上に印字されたプリント風
        "bg-white shadow-sm p-10 md:p-16",
        "max-w-4xl mx-auto",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        // テキストスタイル: 教科書風の読みやすさ
        "whitespace-pre-wrap break-words",
        "leading-[3.5rem] tracking-wider",
        // 縦書きモード
        isVertical && "writing-vertical-rl overflow-x-auto min-h-screen",
        // 印刷時のスタイル
        "print:text-black print:border-none print:p-0 print:shadow-none",
        fontSize
      )}
      style={isVertical ? { writingMode: "vertical-rl" } : undefined}
    >
      {tokens.map((token, index) => {
        const reading = token.reading || "";
        const surfaceForm = token.surface_form || "";
        
        // 漢字が含まれているかチェック
        const hasKanji = containsKanji(surfaceForm);
        
        // ルビを表示する条件:
        // 1. 漢字が含まれている
        // 2. readingが存在する
        // 3. readingとsurface_formが異なる
        const shouldShowRuby =
          hasKanji &&
          reading &&
          reading !== surfaceForm &&
          reading.trim() !== "";

        if (shouldShowRuby) {
          // カタカナをひらがなに変換
          const hiraganaReading = katakanaToHiragana(reading);

          return (
            <ruby key={index} className="mx-0.5">
              {surfaceForm}
              <rt className="text-xs text-gray-600 print:text-black">
                {hiraganaReading}
              </rt>
            </ruby>
          );
        }

        // ルビなしの場合はそのまま表示
        return <span key={index}>{surfaceForm}</span>;
      })}
    </div>
  );
}
