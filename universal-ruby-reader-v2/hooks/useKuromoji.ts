"use client";

import { useEffect, useRef, useState } from "react";
import * as kuromoji from "kuromoji";
import type { IpadicFeatures, Tokenizer } from "@/types/kuromoji";

interface UseKuromojiResult {
  tokens: IpadicFeatures[];
  convertText: (text: string) => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * Kuromojiを使用してテキストを形態素解析するカスタムフック
 * 
 * @returns { tokens: IpadicFeatures[], convertText: (text: string) => void, isLoading: boolean, error: string | null }
 * 
 * @example
 * const { tokens, convertText, isLoading, error } = useKuromoji();
 * 
 * // テキストを解析
 * convertText("こんにちは");
 * 
 * // 解析結果を取得
 * tokens.forEach(token => {
 *   console.log(token.surface_form, token.reading);
 * });
 */
export function useKuromoji(): UseKuromojiResult {
  const [tokens, setTokens] = useState<IpadicFeatures[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const tokenizerRef = useRef<Tokenizer | null>(null);

  useEffect(() => {
    // 初回マウント時にKuromojiを初期化
    const initializeKuromoji = () => {
      setIsLoading(true);
      setError(null);

      try {
        // Kuromojiビルダーを作成（辞書パスは /public/dict を指定）
        const builder = kuromoji.builder({ dicPath: "/dict/" });

        // Tokenizerをビルド
        builder.build((err, tokenizer) => {
          if (err) {
            setError(err.message || "Kuromojiの初期化に失敗しました");
            setIsLoading(false);
            console.error("Kuromoji initialization error:", err);
            return;
          }

          // tokenizerインスタンスをrefに保存（再生成を防ぐ）
          tokenizerRef.current = tokenizer;
          setIsLoading(false);
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Kuromojiの初期化に失敗しました";
        setError(errorMessage);
        setIsLoading(false);
        console.error("Kuromoji initialization error:", err);
      }
    };

    initializeKuromoji();
  }, []); // 初回マウント時のみ実行

  /**
   * テキストを形態素解析してtokens stateを更新する関数
   * 
   * @param text - 解析対象のテキスト
   */
  const convertText = (text: string) => {
    // tokenizerが準備できていない場合はエラーを設定
    if (!tokenizerRef.current) {
      setError("Kuromojiがまだ初期化されていません");
      return;
    }

    // 空文字列の場合はtokensをクリア
    if (!text.trim()) {
      setTokens([]);
      return;
    }

    try {
      // 形態素解析を実行
      const result = tokenizerRef.current.tokenize(text);
      setTokens(result);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "テキストの解析に失敗しました";
      setError(errorMessage);
      setTokens([]);
      console.error("Text conversion error:", err);
    }
  };

  return {
    tokens,
    convertText,
    isLoading,
    error,
  };
}
