"use client";

import {
  Play,
  Pause,
  Square,
  ZoomIn,
  ZoomOut,
  Printer,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlPanelProps {
  isSpeaking: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPrint: () => void;
  onToggleVertical?: () => void;
  isVertical?: boolean;
  disabled?: boolean;
}

/**
 * 音声読み上げ操作、文字サイズ変更、印刷ボタンをまとめたツールバーコンポーネント
 * 
 * @param isSpeaking - 読み上げ中かどうか
 * @param isPaused - 一時停止中かどうか
 * @param onPlay - 再生ボタンのクリックハンドラー
 * @param onPause - 一時停止ボタンのクリックハンドラー
 * @param onResume - 再開ボタンのクリックハンドラー
 * @param onStop - 停止ボタンのクリックハンドラー
 * @param onZoomIn - 拡大ボタンのクリックハンドラー
 * @param onZoomOut - 縮小ボタンのクリックハンドラー
 * @param onPrint - 印刷ボタンのクリックハンドラー
 * @param onToggleVertical - 縦書き/横書き切り替えボタンのクリックハンドラー
 * @param isVertical - 縦書きモードかどうか
 * @param disabled - 操作を無効化するかどうか
 */
export function ControlPanel({
  isSpeaking,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onStop,
  onZoomIn,
  onZoomOut,
  onPrint,
  onToggleVertical,
  isVertical = false,
  disabled = false,
}: ControlPanelProps) {
  const handlePrint = () => {
    window.print();
    onPrint();
  };

  return (
    <div className="print:hidden flex items-center justify-between gap-4 p-4 bg-white border rounded-lg shadow-sm">
      {/* 左側: 音声操作 */}
      <div className="flex items-center gap-2">
        {/* 再生/一時停止/再開ボタン */}
        {!isSpeaking ? (
          <button
            onClick={onPlay}
            disabled={disabled}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
              "bg-blue-500 text-white hover:bg-blue-600",
              "disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
            )}
            aria-label="再生"
          >
            <Play className="w-5 h-5" />
          </button>
        ) : isPaused ? (
          <button
            onClick={onResume}
            disabled={disabled}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
              "bg-green-500 text-white hover:bg-green-600",
              "disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
            )}
            aria-label="再開"
          >
            <Play className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onPause}
            disabled={disabled}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
              "bg-yellow-500 text-white hover:bg-yellow-600",
              "disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
            )}
            aria-label="一時停止"
          >
            <Pause className="w-5 h-5" />
          </button>
        )}

        {/* 停止ボタン */}
        <button
          onClick={onStop}
          disabled={disabled || !isSpeaking}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
            "bg-red-500 text-white hover:bg-red-600",
            "disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
          )}
          aria-label="停止"
        >
          <Square className="w-5 h-5" />
        </button>
      </div>

      {/* 右側: 表示設定（ズーム/縦横切り替え/印刷） */}
      <div className="flex items-center gap-2">
        {/* ズームアウト */}
        <button
          onClick={onZoomOut}
          disabled={disabled}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
            "bg-gray-100 text-gray-700 hover:bg-gray-200",
            "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
          )}
          aria-label="縮小"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        {/* ズームイン */}
        <button
          onClick={onZoomIn}
          disabled={disabled}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
            "bg-gray-100 text-gray-700 hover:bg-gray-200",
            "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
          )}
          aria-label="拡大"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* 区切り線 */}
        <div className="w-px h-8 bg-gray-300" />

        {/* 縦書き/横書き切り替えボタン */}
        {onToggleVertical && (
          <button
            onClick={onToggleVertical}
            disabled={disabled}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
              isVertical
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
            )}
            aria-label={isVertical ? "横書きに切り替え" : "縦書きに切り替え"}
          >
            {isVertical ? (
              <ArrowRight className="w-5 h-5" />
            ) : (
              <ArrowDown className="w-5 h-5" />
            )}
          </button>
        )}

        {/* 区切り線 */}
        <div className="w-px h-8 bg-gray-300" />

        {/* 印刷ボタン */}
        <button
          onClick={handlePrint}
          disabled={disabled}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
            "bg-gray-100 text-gray-700 hover:bg-gray-200",
            "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
          )}
          aria-label="印刷"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
