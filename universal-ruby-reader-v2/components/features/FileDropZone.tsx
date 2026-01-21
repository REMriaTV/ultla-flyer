"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

/**
 * PDFとテキストファイルを受け付けるドロップゾーンコンポーネント
 * 
 * @param onFileSelect - ファイルが選択されたときに呼ばれるコールバック
 * @param isLoading - 読み込み中かどうか
 */
export function FileDropZone({
  onFileSelect,
  isLoading = false,
}: FileDropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-64 p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
        "hover:border-gray-400 hover:bg-gray-50",
        isDragActive && "border-blue-500 bg-blue-50",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      
      {isLoading ? (
        <>
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">読み込み中...</p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            <Upload
              className={cn(
                "w-12 h-12 transition-colors",
                isDragActive ? "text-blue-500" : "text-gray-400"
              )}
            />
            <FileText
              className={cn(
                "w-12 h-12 transition-colors",
                isDragActive ? "text-blue-500" : "text-gray-400"
              )}
            />
          </div>
          
          <p className="text-gray-700 font-medium mb-2">
            {isDragActive
              ? "ここにファイルをドロップ"
              : "ファイルをドラッグ&ドロップ"}
          </p>
          
          <p className="text-sm text-gray-500">
            またはクリックしてファイルを選択
          </p>
          
          <p className="text-xs text-gray-400 mt-2">
            PDF (.pdf) または テキスト (.txt) ファイルに対応
          </p>
        </>
      )}
    </div>
  );
}
