"use client";

import { useEffect, useState } from "react";
import * as pdfjs from "pdfjs-dist";

// PDF.js Worker設定（CDN経由）
// v3.11系では .js が正しい拡張子
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
}

interface UsePdfExtractResult {
  text: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * PDFファイルからテキストを抽出するカスタムフック
 * 
 * @param file - 抽出対象のPDFファイル（null許容）
 * @returns { text: string, isLoading: boolean, error: string | null }
 * 
 * @example
 * const { text, isLoading, error } = usePdfExtract(pdfFile);
 */
export function usePdfExtract(file: File | null): UsePdfExtractResult {
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ファイルがnullの場合はリセット
    if (!file) {
      setText("");
      setIsLoading(false);
      setError(null);
      return;
    }

    // PDFファイルの処理
    const extractText = async () => {
      setIsLoading(true);
      setError(null);
      setText("");

      try {
        // ファイルをArrayBufferとして読み込み
        const arrayBuffer = await file.arrayBuffer();

        // PDFドキュメントを取得
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        // 全ページのテキストを抽出
        const textParts: string[] = [];
        const numPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();

          // テキストアイテムを結合
          const pageText = textContent.items
            .map((item) => {
              if ("str" in item) {
                return item.str;
              }
              return "";
            })
            .join("");

          textParts.push(pageText);
        }

        // 全ページのテキストを改行区切りで結合
        const fullText = textParts.join("\n");
        setText(fullText);
      } catch (err) {
        // エラーハンドリング
        const errorMessage =
          err instanceof Error ? err.message : "PDFの読み込みに失敗しました";
        setError(errorMessage);
        setText("");
        console.error("PDF extraction error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    extractText();
  }, [file]);

  return { text, isLoading, error };
}
