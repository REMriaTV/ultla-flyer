"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface UseSpeechSynthesisResult {
  isSpeaking: boolean;
  isPaused: boolean;
  voice: SpeechSynthesisVoice | null;
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
}

/**
 * Web Speech APIを使用した音声読み上げカスタムフック
 * 
 * @returns { isSpeaking: boolean, isPaused: boolean, voice: SpeechSynthesisVoice | null, speak: (text: string) => void, pause: () => void, resume: () => void, cancel: () => void }
 * 
 * @example
 * const { isSpeaking, speak, pause, resume, cancel } = useSpeechSynthesis();
 * 
 * // テキストを読み上げ
 * speak("こんにちは、世界！");
 * 
 * // 一時停止
 * pause();
 * 
 * // 再開
 * resume();
 * 
 * // 停止
 * cancel();
 */
export function useSpeechSynthesis(): UseSpeechSynthesisResult {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 日本語音声を自動選択する関数
  const selectJapaneseVoice = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    
    // 日本語音声を探す（優先順位: ja-JP > ja）
    const japaneseVoice =
      voices.find((v) => v.lang.startsWith("ja-JP")) ||
      voices.find((v) => v.lang.startsWith("ja"));

    if (japaneseVoice) {
      setVoice(japaneseVoice);
    } else if (voices.length > 0) {
      // 日本語音声が見つからない場合はデフォルト音声を使用
      setVoice(voices[0]);
    }
  }, []);

  // 音声リストの読み込みを監視
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    // 初回読み込み時に音声を選択
    selectJapaneseVoice();

    // onvoiceschangedイベントを監視（音声リストが非同期でロードされるため）
    const handleVoicesChanged = () => {
      selectJapaneseVoice();
    };

    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
    };
  }, [selectJapaneseVoice]);

  // クリーンアップ関数：ページ遷移や再レンダリング時に読み上げを停止
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /**
   * テキストを読み上げる
   * 実行前に必ずcancel()を呼んで既存の読み上げを停止する
   */
  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        console.warn("SpeechSynthesis is not supported in this browser");
        return;
      }

      // 既存の読み上げを停止
      window.speechSynthesis.cancel();

      if (!text.trim()) {
        return;
      }

      // 新しいUtteranceを作成
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 音声を設定（日本語音声が選択されている場合）
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        // フォールバック: 日本語を指定
        utterance.lang = "ja-JP";
      }

      // イベントハンドラーを設定
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error("SpeechSynthesis error:", event);
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      // Utteranceをrefに保存
      utteranceRef.current = utterance;

      // 読み上げを開始
      window.speechSynthesis.speak(utterance);
    },
    [voice]
  );

  /**
   * 読み上げを一時停止
   */
  const pause = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  /**
   * 読み上げを再開
   */
  const resume = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  /**
   * 読み上げを停止
   */
  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }, []);

  return {
    isSpeaking,
    isPaused,
    voice,
    speak,
    pause,
    resume,
    cancel,
  };
}
