"use client";

import { useState, useEffect, useRef } from "react";
import { usePdfExtract } from "@/hooks/usePdfExtract";
import { useKuromoji } from "@/hooks/useKuromoji";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { FileDropZone } from "@/components/features/FileDropZone";
import { RubyTextDisplay } from "@/components/features/RubyTextDisplay";
import { ControlPanel } from "@/components/features/ControlPanel";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(2);
  const [isVertical, setIsVertical] = useState<boolean>(false);
  const prevPdfTextRef = useRef<string>("");

  // フォントサイズのマッピング
  const fontSizeMap = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];
  const currentFontSize = fontSizeMap[fontSizeLevel] || fontSizeMap[2];

  // Hooksの初期化
  const { text: pdfText, isLoading: isPdfLoading, error: pdfError } =
    usePdfExtract(file);
  const { tokens, convertText, isLoading: isKuromojiLoading, error: kuromojiError } =
    useKuromoji();
  const { isSpeaking, isPaused, speak, pause, resume, cancel } =
    useSpeechSynthesis();

  // PDFテキストが変更されたら自動的に形態素解析を実行
  useEffect(() => {
    if (
      pdfText &&
      pdfText.trim() !== "" &&
      pdfText !== prevPdfTextRef.current &&
      !isKuromojiLoading
    ) {
      prevPdfTextRef.current = pdfText;
      convertText(pdfText);
    }
  }, [pdfText, convertText, isKuromojiLoading]);

  // ファイル選択ハンドラー
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    prevPdfTextRef.current = "";
  };

  // ズームイン
  const handleZoomIn = () => {
    setFontSizeLevel((prev) => Math.min(prev + 1, fontSizeMap.length - 1));
  };

  // ズームアウト
  const handleZoomOut = () => {
    setFontSizeLevel((prev) => Math.max(prev - 1, 0));
  };

  // 読み上げ開始
  const handlePlay = () => {
    if (pdfText && pdfText.trim() !== "") {
      speak(pdfText);
    }
  };

  // 印刷ハンドラー
  const handlePrint = () => {
    // 印刷処理はControlPanel内でwindow.print()が実行される
    console.log("印刷を開始します");
  };

  // 縦書き/横書き切り替えハンドラー
  const handleToggleVertical = () => {
    setIsVertical((prev) => !prev);
  };

  // ローディング状態の判定
  const isLoading = isPdfLoading || isKuromojiLoading;
  const hasError = pdfError || kuromojiError;
  const hasContent = tokens.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* ヘッダー */}
      <header className="print:hidden bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Universal Ruby Reader V2
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            PDF・テキストファイルからルビ付きテキストを生成
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        <div className="md:flex gap-6">
          {/* 左カラム: ファイル選択とコントロールパネル */}
          <aside className="print:hidden md:w-1/3 lg:w-1/4 mb-6 md:mb-0">
            <div className="sticky top-4 space-y-4">
              {/* ファイルドロップゾーン */}
              <FileDropZone
                onFileSelect={handleFileSelect}
                isLoading={isPdfLoading}
              />

              {/* コントロールパネル */}
              <ControlPanel
                isSpeaking={isSpeaking}
                isPaused={isPaused}
                onPlay={handlePlay}
                onPause={pause}
                onResume={resume}
                onStop={cancel}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onPrint={handlePrint}
                onToggleVertical={handleToggleVertical}
                isVertical={isVertical}
                disabled={!hasContent || isLoading}
              />
            </div>
          </aside>

          {/* 右カラム: ルビ付きテキスト表示 */}
          <section className="flex-1 min-w-0">
            <div className="bg-white shadow-lg p-8 min-h-[500px] rounded-lg">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" />
                  <p className="text-lg font-medium">
                    {isPdfLoading
                      ? "PDFファイルを読み込み中..."
                      : "テキストを解析中..."}
                  </p>
                </div>
              ) : hasError ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-red-600">
                  <p className="text-lg font-medium mb-2">エラーが発生しました</p>
                  <p className="text-sm text-gray-600">
                    {pdfError || kuromojiError}
                  </p>
                </div>
              ) : hasContent ? (
                <RubyTextDisplay
                  tokens={tokens}
                  fontSize={currentFontSize}
                  isVertical={isVertical}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-gray-400">
                  <p className="text-lg font-medium mb-2">
                    ファイルを選択してください
                  </p>
                  <p className="text-sm">
                    PDFまたはテキストファイルをドラッグ&ドロップするか、クリックして選択してください
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
