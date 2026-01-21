'use client';

import React, { useState, useEffect, useRef } from 'react';

// 読み上げ用のテキストデータ
const TEXT_DATA = {
  front: `
    へーんしん。見える世界が変われば、いつのまにかへーんしんしているかも。きっかけは、あなたの中に！
    みえウルトラプログラム。
    一人ひとりが、自分らしく学び、生きていくことを発見できるチャンスをウルトラでは大切にしています。
    お寺や自然、手しごとの現場など、リアルなフィールドに身を置きながら、見て、触れて、感じて、考えてみる。
    自分の心のコンパスをたよりに、それぞれのペースで、それぞれの学びを進めていきます。
    人や場所との出会いの中で、揺れ動く心を味わううちに、自分なりの変化が生まれているかもしれません。
    さあ、みえウルトラプログラムの中で、学びのトライアルをはじめてみましょう。
    開催概要。2月12日木曜日開催。くらしのプログラムは13時から17時。あきないのプログラムは15時から19時。
    お申し込みについて。裏面のプログラムの概要を読んで、下記のどちらのプログラムに参加したいか選んでください。1、くらしのプログラム。2、あきないのプログラム。下記のボタンからGoogleフォームで申し込んでください。
  `,
  back: `
    くらしのプログラム。
    日時、2月12日木曜日、13時から17時。12時45分集合。
    場所、高田専修寺。
    おすすめ、見えない「気」や、建築、お寺に興味がある人。
    ナビゲーター、株式会社SPACE、福本理恵。高田専修寺 宝物館 燈炬殿、大野照文。ご住職。

    お寺の気は、静かな空気で満ちていて、胸の奥ではすうっと息が整っていく。
    木に支えられた建物も、長い時間を重ねてきた場所も、そして、そこに立つ私たちも。みんな、それぞれの気を抱えて生きている。
    お堂の中の音に耳をすまし、光や匂い、足の裏の感覚に身をゆだねてみる。すると、心が少し整い、なんだか心地よくなってくるかも。
    光と音に包まれながら覗く「浄土」はどんな世界だろう？天と私と、私のいのち。それらがつながる世界を覗きに行ってみよう！

    あきないのプログラム。
    日時、2月12日木曜日、15時から19時。14時45分集合。
    場所、下津醤油、臼井織布。
    おすすめ、着るものや食べるもの、ものづくりに興味がある人。
    ナビゲーター、下津醤油株式会社、下津浩嗣。臼井織布、臼井成生。農家さん。

    畑で育った草や豆、大地に根を張る木や植物、それに向き合ってきた人たち。
    糸をつむぐ手、布を織る音、発酵を待つ時間。
    草は綿となり布へ、豆は醤油となり、身にまとう心地よさや、食べたときの満ちる感じへとつながっていく。
    手間はかかるけれど、なぜか飽きずに、何度でも向き合いたくなる。そんな営みを、人は商いと呼んできたのかもしれない。
    自然のめぐりと人の営みが重なる場で、手から生み出されるものづくりの扉をそっと開いてみよう！

    裏面のプログラムの概要を読んで、下記のどちらのプログラムに参加したいか選んでください。
    1、くらしのプログラム。
    2、あきないのプログラム。
    右のバーコードを読み取って、申し込んでください。
  `
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageScale, setImageScale] = useState(1.0);
  const [zoomCenter, setZoomCenter] = useState<{ x: number; y: number } | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [hasDragged, setHasDragged] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState<{ x: number; width: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLDivElement>(null);

  // 読み上げ機能
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      alert('お使いのブラウザは読み上げに対応していません。');
    }
  };

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [activeTab]);

  // PDFダウンロード機能
  const downloadPDF = () => {
    const pdfUrl = '/flyer.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'flyer.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 印刷機能
  const handlePrint = () => {
    window.print();
  };

  // ドラッグ開始
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageScale > 1.0) {
      e.preventDefault();
      setIsDragging(true);
      setHasDragged(false);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  // ドラッグ中
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && dragStart && imageScale > 1.0 && imageRef.current && containerRef.current) {
      e.preventDefault();
      
      // マウスの移動量を計算
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // 移動量が一定以上の場合のみドラッグとみなす（5px以上）
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setHasDragged(true);
      }
      
      // 新しい位置を計算（現在の位置に移動量を加算）
      const newX = imagePosition.x + deltaX;
      const newY = imagePosition.y + deltaY;
      
      // 移動範囲を制限
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();
      
      // 拡大後の画像サイズ
      const scaledWidth = imageRect.width * imageScale;
      const scaledHeight = imageRect.height * imageScale;
      
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // 画像がコンテナからはみ出さない範囲を計算
      const maxX = Math.max(0, (scaledWidth - containerWidth) / 2);
      const maxY = Math.max(0, (scaledHeight - containerHeight) / 2);
      
      // 位置を制限
      setImagePosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
      
      // ドラッグ開始位置を更新（累積誤差を防ぐ）
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  // ドラッグ終了
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      // 少し遅延させてからhasDraggedをリセット（クリックイベントの判定のため）
      setTimeout(() => {
        setHasDragged(false);
      }, 100);
    }
  };

  // グローバルマウスイベント（マウスが要素外に出た場合も処理）
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (dragStart && imageScale > 1.0 && imageRef.current && containerRef.current) {
          const deltaX = e.clientX - dragStart.x;
          const deltaY = e.clientY - dragStart.y;
          
          // 移動量が一定以上の場合のみドラッグとみなす（5px以上）
          if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            setHasDragged(true);
          }
          
          const newX = imagePosition.x + deltaX;
          const newY = imagePosition.y + deltaY;
          
          const containerRect = containerRef.current.getBoundingClientRect();
          const imageRect = imageRef.current.getBoundingClientRect();
          
          const scaledWidth = imageRect.width * imageScale;
          const scaledHeight = imageRect.height * imageScale;
          
          const containerWidth = containerRect.width;
          const containerHeight = containerRect.height;
          
          const maxX = Math.max(0, (scaledWidth - containerWidth) / 2);
          const maxY = Math.max(0, (scaledHeight - containerHeight) / 2);
          
          setImagePosition({
            x: Math.max(-maxX, Math.min(maxX, newX)),
            y: Math.max(-maxY, Math.min(maxY, newY)),
          });
          
          setDragStart({
            x: e.clientX,
            y: e.clientY,
          });
        }
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        setDragStart(null);
        // 少し遅延させてからhasDraggedをリセット（クリックイベントの判定のため）
        setTimeout(() => {
          setHasDragged(false);
        }, 100);
      };

      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart, imageScale, imagePosition, hasDragged]);

  // 画像クリックで拡大（ドラッグでない場合のみ）
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // ドラッグが発生した場合はクリック処理をスキップ
    if (hasDragged || isDragging) return;
    
    if (!imageRef.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();
    
    const clickX = e.clientX - containerRect.left;
    const clickY = e.clientY - containerRect.top;
    
    // 画像の範囲内かチェック
    const imageLeft = imageRect.left - containerRect.left;
    const imageTop = imageRect.top - containerRect.top;
    const imageRight = imageRect.right - containerRect.left;
    const imageBottom = imageRect.bottom - containerRect.top;
    
    if (clickX >= imageLeft && clickX <= imageRight &&
        clickY >= imageTop && clickY <= imageBottom) {
      
      // 画像上のクリック位置を計算（画像の左上を基準）
      const imageX = clickX - imageLeft;
      const imageY = clickY - imageTop;
      
      // 拡大のみ（縮小はマイナスボタンで行う）
      if (imageScale === 1.0) {
        // 拡大：クリック位置を中心に2.5倍に拡大
        setImageScale(2.5);
        setZoomCenter({ x: imageX, y: imageY });
        setImagePosition({ x: 0, y: 0 });
      }
    }
  };


  // 拡大率を手動で調整
  const zoomIn = () => {
    if (imageScale < 1.0) {
      setImageScale(1.0);
      setZoomCenter(null);
      setImagePosition({ x: 0, y: 0 });
    } else {
      const newScale = Math.min(imageScale + 0.5, 5.0);
      setImageScale(newScale);
      if (!zoomCenter && imageRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();
        setZoomCenter({
          x: (imageRect.left - containerRect.left + imageRect.width / 2),
          y: (imageRect.top - containerRect.top + imageRect.height / 2),
        });
      }
    }
  };

  const zoomOut = () => {
    if (imageScale <= 1.0) {
      setImageScale(1.0);
      setZoomCenter(null);
      setImagePosition({ x: 0, y: 0 });
    } else {
      const newScale = Math.max(imageScale - 0.5, 1.0);
      setImageScale(newScale);
      // 縮小時は常に位置を中心に戻す
      setImagePosition({ x: 0, y: 0 });
      if (newScale <= 1.0) {
        setZoomCenter(null);
      }
    }
  };

  const resetZoom = () => {
    setImageScale(1.0);
    setZoomCenter(null);
    setImagePosition({ x: 0, y: 0 });
  };

  // リサイズ開始
  const handleResizeStart = (e: React.MouseEvent) => {
    if (!isTextVisible || !textAreaRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      width: textAreaRef.current.offsetWidth,
    });
  };

  // リサイズ中
  const handleResizeMove = (e: MouseEvent) => {
    if (isResizing && resizeStart && textAreaRef.current) {
      const deltaX = resizeStart.x - e.clientX; // 左にドラッグすると正の値
      const newWidth = resizeStart.width + deltaX;
      const minWidth = 200; // 最小幅
      const maxWidth = window.innerWidth * 0.7; // 最大幅（画面の70%）
      
      if (newWidth < minWidth) {
        setIsTextVisible(false);
        setIsResizing(false);
        setResizeStart(null);
      } else if (newWidth <= maxWidth) {
        textAreaRef.current.style.width = `${newWidth}px`;
        textAreaRef.current.style.flexShrink = '0';
        textAreaRef.current.style.flexGrow = '0';
      }
    }
  };

  // リサイズ終了
  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeStart(null);
  };

  // グローバルリサイズイベント
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, resizeStart]);

  // タブ切り替え時にズームをリセット
  useEffect(() => {
    setImageScale(1.0);
    setZoomCenter(null);
    setImagePosition({ x: 0, y: 0 });
    setIsDragging(false);
    setDragStart(null);
    setHasDragged(false);
  }, [activeTab]);

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body {
            background: white !important;
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:w-full {
            width: 100% !important;
          }
          .print\\:h-auto {
            height: auto !important;
            max-height: none !important;
            min-height: auto !important;
          }
          .print\\:overflow-visible {
            overflow: visible !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          /* 印刷時にコンテナの高さ制限を解除 */
          div[class*="h-screen"],
          div[class*="h-full"],
          div[class*="h-1/2"] {
            height: auto !important;
            max-height: none !important;
          }
          /* スクロール領域を解除 */
          div[class*="overflow"] {
            overflow: visible !important;
          }
        }
      `}</style>
      <div className="flex flex-col md:flex-row h-screen w-full bg-gray-100 overflow-hidden print:flex-col print:h-auto print:overflow-visible">
        
        {/* --- 左側エリア：画像表示 --- */}
        <div className={`${isTextVisible ? 'w-full md:w-1/2' : 'w-full'} h-1/2 md:h-full bg-gray-900 flex flex-col relative shadow-xl z-10 print:hidden transition-all duration-300`}>
        <div 
          ref={containerRef}
          className="flex-1 w-full h-full p-4 flex items-center justify-center overflow-hidden relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleImageClick}
          style={{ 
            cursor: imageScale > 1.0 
              ? (isDragging ? 'grabbing' : 'grab')
              : 'zoom-in',
            userSelect: 'none',
          }}
        >
           <img
             ref={imageRef}
             src={activeTab === 'front' ? '/front.png' : '/back.png'}
             alt="フライヤー画像"
             className="max-w-full max-h-full object-contain drop-shadow-lg select-none"
             draggable={false}
             style={{
               transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
               transformOrigin: zoomCenter ? `${zoomCenter.x}px ${zoomCenter.y}px` : 'center center',
               transition: isDragging ? 'none' : 'transform 0.2s ease-out',
               cursor: imageScale > 1.0 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
             }}
           />
           
           {/* ズームコントロール */}
           <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-gray-800/90 rounded-lg p-2 z-40">
             <button
               onClick={(e) => { e.stopPropagation(); zoomIn(); }}
               disabled={imageScale >= 5.0}
               className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               title="拡大"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="12" y1="5" x2="12" y2="19"></line>
                 <line x1="5" y1="12" x2="19" y2="12"></line>
               </svg>
             </button>
             <div className="w-8 h-6 flex items-center justify-center text-white text-xs font-bold">
               {imageScale.toFixed(1)}×
             </div>
             <button
               onClick={(e) => { e.stopPropagation(); zoomOut(); }}
               disabled={imageScale <= 1.0}
               className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               title="縮小"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="5" y1="12" x2="19" y2="12"></line>
               </svg>
             </button>
             <button
               onClick={(e) => { e.stopPropagation(); resetZoom(); }}
               disabled={imageScale === 1.0}
               className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
               title="リセット"
             >
               ↺
             </button>
           </div>
        </div>
        
        {/* 切り替えタブとダウンロードボタン */}
        <div className="bg-gray-800 p-4 flex flex-col gap-3 text-white shrink-0 print:hidden">
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setActiveTab('front')}
              className={`px-6 py-2 rounded-full font-bold transition-all border ${activeTab === 'front' ? 'bg-blue-600 border-blue-500' : 'bg-transparent border-gray-600 hover:bg-gray-700'}`}
            >
              オモテ面
            </button>
            <button 
              onClick={() => setActiveTab('back')}
              className={`px-6 py-2 rounded-full font-bold transition-all border ${activeTab === 'back' ? 'bg-blue-600 border-blue-500' : 'bg-transparent border-gray-600 hover:bg-gray-700'}`}
            >
              ウラ面
            </button>
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center justify-center gap-2 px-4 py-2 mx-auto bg-gray-700 hover:bg-gray-600 rounded-full font-bold text-sm transition-all border border-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            PDFをダウンロード
          </button>
        </div>
      </div>

        {/* --- 右側エリア：テキストガイド --- */}
        {isTextVisible && (
          <>
            <div 
              ref={textAreaRef}
              className="w-full md:w-1/2 h-1/2 md:h-full bg-white flex flex-col overflow-y-auto print:w-full print:h-auto print:overflow-visible print:border-0 print:min-h-0 transition-all duration-300 relative"
            >
              {/* リサイズハンドル */}
              <div
                className="hidden md:flex absolute -left-2 top-0 bottom-0 w-4 cursor-col-resize z-20 items-center justify-center group"
                onMouseDown={handleResizeStart}
              >
                <div className="w-1 h-full bg-gray-300 hover:bg-blue-500 transition-colors rounded-full group-hover:w-1.5" />
                {/* ボタンエリア */}
                <button
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTextVisible(false);
                  }}
                  title="テキストを非表示"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              </div>
              
              {/* ヘッダー（スクロール領域内に配置・固定なし） */}
              <div className="shrink-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center print:hidden">
          <h2 className="font-bold text-gray-500 text-sm">
            {activeTab === 'front' ? '【表面】テキストガイド' : '【裏面】テキストガイド'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm bg-gray-500 text-white hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              印刷
            </button>
            <button 
              onClick={() => speak(TEXT_DATA[activeTab])}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
                isSpeaking ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isSpeaking ? (<span>■ 停止</span>) : (<span>▶ 声に出して読む</span>)}
            </button>
          </div>
        </div>

              {/* テキストコンテンツ */}
              <div className="p-6 md:p-10 text-lg md:text-xl leading-loose font-medium text-gray-800 space-y-8 pb-20 print:p-4 print:text-black print:bg-white print:space-y-6 print:pb-4">
          {activeTab === 'front' ? (
            <>
              {/* --- 表面 --- */}
              <div className="mb-8">
                <div className="text-2xl font-bold text-blue-600 mb-4 inline-block bg-yellow-100 px-3 py-1 rounded-lg">
                  へーんしん
                </div>
                <p>
                  <ruby>見<rt>み</rt></ruby>える<ruby>世界<rt>せかい</rt></ruby>が<ruby>変<rt>か</rt></ruby>われば、<br/>
                  いつのまにかへーんしんしているかも。<br/>
                  きっかけは、あなたの<ruby>中<rt>なか</rt></ruby>に！
                </p>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-500 border-b-4 border-cyan-100 pb-4 mb-8">
                みえ<ruby>ULTLA<rt>ウルトラ</rt></ruby>プログラム
              </h1>

              <div className="space-y-6">
                <p>
                  <ruby>一人<rt>ひとり</rt></ruby>ひとりが、<ruby>自分<rt>じぶん</rt></ruby>らしく<ruby>学<rt>まな</rt></ruby>び、<ruby>生<rt>い</rt></ruby>きていくことを<br/>
                  <ruby>発見<rt>はっけん</rt></ruby>できるチャンスをULTLAでは<ruby>大切<rt>たいせつ</rt></ruby>にしています。
                </p>
                <p>
                  お<ruby>寺<rt>てら</rt></ruby>や<ruby>自然<rt>しぜん</rt></ruby>、<ruby>手<rt>て</rt></ruby>しごとの<ruby>現場<rt>げんば</rt></ruby>など、<br/>
                  リアルなフィールドに<ruby>身<rt>み</rt></ruby>を<ruby>置<rt>お</rt></ruby>きながら、<br/>
                  <ruby>見<rt>み</rt></ruby>て、<ruby>触<rt>ふ</rt></ruby>れて、<ruby>感<rt>かん</rt></ruby>じて、<ruby>考<rt>かんが</rt></ruby>えてみる。
                </p>
                <p>
                  <ruby>自分<rt>じぶん</rt></ruby>の<ruby>心<rt>こころ</rt></ruby>のコンパスをたよりに、<br/>
                  それぞれのペースで、それぞれの<ruby>学<rt>まな</rt></ruby>びを<ruby>進<rt>すす</rt></ruby>めていきます。
                </p>
                <p>
                  <ruby>人<rt>ひと</rt></ruby>や<ruby>場所<rt>ばしょ</rt></ruby>との<ruby>出会<rt>であ</rt></ruby>いの<ruby>中<rt>なか</rt></ruby>で、<br/>
                  <ruby>揺<rt>ゆ</rt></ruby>れ<ruby>動<rt>うご</rt></ruby>く<ruby>心<rt>こころ</rt></ruby>を<ruby>味<rt>あじ</rt></ruby>わううちに、<br/>
                  <ruby>自分<rt>じぶん</rt></ruby>なりの<ruby>変化<rt>へんか</rt></ruby>が<ruby>生<rt>う</rt></ruby>まれているかもしれません。
                </p>
                <p className="font-bold text-blue-900 bg-blue-50 p-4 rounded-lg">
                  さあ、「みえ<ruby>ULTLA<rt>ウルトラ</rt></ruby>プログラム」の<ruby>中<rt>なか</rt></ruby>で、<br/>
                  <ruby>学<rt>まな</rt></ruby>びのトライアルをはじめてみましょう。
                </p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400 mt-8">
                <h3 className="font-bold mb-2"><ruby>開催概要<rt>かいさいがいよう</rt></ruby></h3>
                <ul className="space-y-2 text-base">
                  <li>2<ruby>月<rt>がつ</rt></ruby>12<ruby>日<rt>にち</rt></ruby>（<ruby>木<rt>もく</rt></ruby>）<ruby>開催<rt>かいさい</rt></ruby></li>
                  <li>●「くらし」のプログラム： 13<ruby>時<rt>じ</rt></ruby>〜17<ruby>時<rt>じ</rt></ruby></li>
                  <li>●「あきない」のプログラム： 15<ruby>時<rt>じ</rt></ruby>〜19<ruby>時<rt>じ</rt></ruby></li>
                  <li className="text-sm mt-2 text-gray-600">※<ruby>集合<rt>しゅうごう</rt></ruby>・<ruby>解散<rt>かいさん</rt></ruby>：<ruby>寺内町<rt>じないちょう</rt></ruby>の<ruby>館<rt>やかた</rt></ruby></li>
                </ul>
              </div>

              {/* お申し込みについて */}
              <section className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-400 font-medium mt-8">
                <p className="mb-4 text-base leading-relaxed">
                  <ruby>裏面<rt>うらめん</rt></ruby>のプログラムの<ruby>概要<rt>がいよう</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで、<ruby>下記<rt>かき</rt></ruby>のどちらのプログラムに<ruby>参加<rt>さんか</rt></ruby>したいか<ruby>選<rt>えら</rt></ruby>んでください。
                </p>
                <ul className="list-none space-y-2 ml-4 mb-4 font-bold text-lg">
                  <li>❶「くらし」のプログラム</li>
                  <li>❷「あきない」のプログラム</li>
                </ul>
                <p className="text-base leading-relaxed">
                  下記のボタンからGoogleフォームで<ruby>申<rt>もう</rt></ruby>し<ruby>込<rt>こ</rt></ruby>んでください。
                </p>
              </section>

              <div className="mt-8 text-center p-4 print:hidden">
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfnxpAfNae-yfiHefPJpagU8VDpAUWKUOlJl5Go8ZBLQ-ZK2Q/viewform?usp=header" 
                  target="_blank" 
                  className="inline-block bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                >
                  申し込む（Googleフォームへ）
                </a>
              </div>
            </>
          ) : (
            <>
               <div className="space-y-12">
                 
                 {/* プログラム1：くらし */}
                 <section>
                   <h3 className="text-2xl font-bold text-green-700 mb-4 bg-white py-2">① 「くらし」のプログラム</h3>
                   
                   <div className="bg-green-50 p-4 rounded mb-4 text-base space-y-2">
                     <p><span className="font-bold"><ruby>日時<rt>にちじ</rt></ruby>：</span>2<ruby>月<rt>がつ</rt></ruby>12<ruby>日<rt>にち</rt></ruby>（<ruby>木<rt>もく</rt></ruby>） 13:00-17:00 （12:45<ruby>集合<rt>しゅうごう</rt></ruby>）</p>
                     <p><span className="font-bold"><ruby>場所<rt>ばしょ</rt></ruby>：</span><ruby>高田専修寺<rt>たかだせんじゅじ</rt></ruby></p>
                     <p className="bg-yellow-100 p-2 rounded inline-block">
                       <span className="font-bold">おすすめ：</span><ruby>見<rt>み</rt></ruby>えない「<ruby>気<rt>き</rt></ruby>」や、<ruby>建築<rt>けんちく</rt></ruby>、お<ruby>寺<rt>てら</rt></ruby>に<ruby>興味<rt>きょうみ</rt></ruby>がある<ruby>人<rt>ひと</rt></ruby>
                     </p>
                   </div>

                   <div className="mt-4 p-4 rounded-lg bg-blue-50">
                     <h4 className="font-bold text-blue-800 mb-3 text-base">
                       <ruby>案内人<rt>あんないにん</rt></ruby>（ナビゲーター）
                     </h4>
                     <ul className="space-y-3">
                       <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                         <span className="text-gray-500 text-sm shrink-0">
                           <ruby>株式会社<rt>かぶしきがいしゃ</rt></ruby>SPACE
                         </span>
                         <span className="font-bold text-lg text-gray-800">
                           <ruby>福本<rt>ふくもと</rt></ruby> <ruby>理恵<rt>りえ</rt></ruby>
                         </span>
                       </li>
                       <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                         <span className="text-gray-500 text-sm shrink-0">
                           <ruby>高田専修寺<rt>たかだせんじゅじ</rt></ruby> <ruby>宝物館<rt>ほうもつかん</rt></ruby> <ruby>燈炬殿<rt>とうこでん</rt></ruby>
                         </span>
                         <span className="font-bold text-lg text-gray-800">
                           <ruby>大野<rt>おおの</rt></ruby> <ruby>照文<rt>てるふみ</rt></ruby>
                         </span>
                       </li>
                       <li className="flex items-center gap-2">
                         <span className="font-bold text-lg text-gray-800">ご<ruby>住職<rt>じゅうしょく</rt></ruby></span>
                       </li>
                     </ul>
                   </div>

                   <p className="mb-4">
                     お<ruby>寺<rt>てら</rt></ruby>の「<ruby>気<rt>き</rt></ruby>」は、<ruby>静<rt>しず</rt></ruby>かな<ruby>空気<rt>くうき</rt></ruby>で<ruby>満<rt>み</rt></ruby>ちていて、<ruby>胸<rt>むね</rt></ruby>の<ruby>奥<rt>おく</rt></ruby>ではすうっと<ruby>息<rt>いき</rt></ruby>が<ruby>整<rt>ととの</rt></ruby>っていく。<br/>
                     <ruby>木<rt>き</rt></ruby>に<ruby>支<rt>ささ</rt></ruby>えられた<ruby>建物<rt>たてもの</rt></ruby>も、<ruby>長<rt>なが</rt></ruby>い<ruby>時間<rt>じかん</rt></ruby>を<ruby>重<rt>かさ</rt></ruby>ねてきた<ruby>場所<rt>ばしょ</rt></ruby>も、そして、そこに<ruby>立<rt>た</rt></ruby>つ<ruby>私<rt>わたし</rt></ruby>たちも。<br/>
                     みんな、それぞれの「<ruby>気<rt>き</rt></ruby>」を<ruby>抱<rt>かか</rt></ruby>えて<ruby>生<rt>い</rt></ruby>きている。
                   </p>
                   <p>
                     お<ruby>堂<rt>どう</rt></ruby>の<ruby>中<rt>なか</rt></ruby>の<ruby>音<rt>おと</rt></ruby>に<ruby>耳<rt>みみ</rt></ruby>をすまし、<ruby>光<rt>ひかり</rt></ruby>や<ruby>匂<rt>にお</rt></ruby>い、<ruby>足<rt>あし</rt></ruby>の<ruby>裏<rt>うら</rt></ruby>の<ruby>感覚<rt>かんかく</rt></ruby>に<ruby>身<rt>み</rt></ruby>をゆだねてみる。<br/>
                     すると、<ruby>心<rt>こころ</rt></ruby>が<ruby>少<rt>すこ</rt></ruby>し<ruby>整<rt>ととの</rt></ruby>い、なんだか<ruby>心地<rt>ここち</rt></ruby>よくなってくるかも。<br/>
                     <ruby>光<rt>ひかり</rt></ruby>と<ruby>音<rt>おと</rt></ruby>に<ruby>包<rt>つつ</rt></ruby>まれながら<ruby>覗<rt>のぞ</rt></ruby>く「<ruby>浄土<rt>じょうど</rt></ruby>」はどんな<ruby>世界<rt>せかい</rt></ruby>だろう？<br/>
                     <ruby>天<rt>てん</rt></ruby>と<ruby>私<rt>わたし</rt></ruby>と、<ruby>私<rt>わたし</rt></ruby>のいのち。それらがつながる<ruby>世界<rt>せかい</rt></ruby>を<ruby>覗<rt>のぞ</rt></ruby>きに<ruby>行<rt>い</rt></ruby>ってみよう！
                   </p>
                 </section>

                 <hr className="border-gray-200" />

                 {/* プログラム2：あきない */}
                 <section>
                   <h3 className="text-2xl font-bold text-indigo-700 mb-4 bg-white py-2">② 「あきない」のプログラム</h3>
                   
                   <div className="bg-indigo-50 p-4 rounded mb-4 text-base space-y-2">
                     <p><span className="font-bold"><ruby>日時<rt>にちじ</rt></ruby>：</span>2<ruby>月<rt>がつ</rt></ruby>12<ruby>日<rt>にち</rt></ruby>（<ruby>木<rt>もく</rt></ruby>） 15:00-19:00 （14:45<ruby>集合<rt>しゅうごう</rt></ruby>）</p>
                     <p><span className="font-bold"><ruby>場所<rt>ばしょ</rt></ruby>：</span><ruby>下津醤油<rt>しもづしょうゆ</rt></ruby>、<ruby>臼井織布<rt>うすいしょくふ</rt></ruby></p>
                     <p className="bg-yellow-100 p-2 rounded inline-block">
                       <span className="font-bold">おすすめ：</span><ruby>着<rt>き</rt></ruby>るものや<ruby>食<rt>た</rt></ruby>べるもの、ものづくりに<ruby>興味<rt>きょうみ</rt></ruby>がある<ruby>人<rt>ひと</rt></ruby>
                     </p>
                   </div>

                   <div className="mt-4 p-4 rounded-lg bg-indigo-50">
                     <h4 className="font-bold text-indigo-800 mb-3 text-base">
                       <ruby>案内人<rt>あんないにん</rt></ruby>（ナビゲーター）
                     </h4>
                     <ul className="space-y-3">
                       <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                         <span className="text-gray-500 text-sm shrink-0">
                           <ruby>下津醤油株式会社<rt>しもづしょうゆかぶしきがいしゃ</rt></ruby>
                         </span>
                         <span className="font-bold text-lg text-gray-800">
                           <ruby>下津<rt>しもづ</rt></ruby> <ruby>浩嗣<rt>ひろし</rt></ruby>
                         </span>
                       </li>
                       <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                         <span className="text-gray-500 text-sm shrink-0">
                           <ruby>臼井織布<rt>うすいしょくふ</rt></ruby>
                         </span>
                         <span className="font-bold text-lg text-gray-800">
                           <ruby>臼井<rt>うすい</rt></ruby> <ruby>成生<rt>なるお</rt></ruby>
                         </span>
                       </li>
                       <li className="flex items-center gap-2">
                         <span className="font-bold text-lg text-gray-800"><ruby>農家<rt>のうか</rt></ruby>さん</span>
                       </li>
                     </ul>
                   </div>

                   <p className="mb-4">
                     <ruby>畑<rt>はた</rt></ruby>で<ruby>育<rt>そだ</rt></ruby>った<ruby>草<rt>くさ</rt></ruby>や<ruby>豆<rt>まめ</rt></ruby>、<ruby>大地<rt>だいち</rt></ruby>に<ruby>根<rt>ね</rt></ruby>を<ruby>張<rt>は</rt></ruby>る<ruby>木<rt>き</rt></ruby>や<ruby>植物<rt>しょくぶつ</rt></ruby>、それに<ruby>向<rt>む</rt></ruby>き<ruby>合<rt>あ</rt></ruby>ってきた<ruby>人<rt>ひと</rt></ruby>たち。<br/>
                     <ruby>糸<rt>いと</rt></ruby>をつむぐ<ruby>手<rt>て</rt></ruby>、<ruby>布<rt>ぬの</rt></ruby>を<ruby>織<rt>お</rt></ruby>る<ruby>音<rt>おと</rt></ruby>、<ruby>発酵<rt>はっこう</rt></ruby>を<ruby>待<rt>ま</rt></ruby>つ<ruby>時間<rt>じかん</rt></ruby>。
                   </p>
                   <p className="mb-4">
                     <ruby>草<rt>くさ</rt></ruby>は<ruby>綿<rt>わた</rt></ruby>となり<ruby>布<rt>ぬの</rt></ruby>へ、<ruby>豆<rt>まめ</rt></ruby>は<ruby>醤油<rt>しょうゆ</rt></ruby>となり、<ruby>身<rt>み</rt></ruby>にまとう<ruby>心地<rt>ここち</rt></ruby>よさや、<ruby>食<rt>た</rt></ruby>べたときの<ruby>満<rt>み</rt></ruby>ちる<ruby>感<rt>かん</rt></ruby>じへとつながっていく。<br/>
                     <ruby>手間<rt>てま</rt></ruby>はかかるけれど、なぜか<ruby>飽<rt>あ</rt></ruby>きずに、<ruby>何度<rt>なんど</rt></ruby>でも<ruby>向<rt>む</rt></ruby>き<ruby>合<rt>あ</rt></ruby>いたくなる。そんな<ruby>営<rt>いとな</rt></ruby>みを、<ruby>人<rt>ひと</rt></ruby>は「<ruby>商<rt>あきな</rt></ruby>い」と<ruby>呼<rt>よ</rt></ruby>んできたのかもしれない。
                   </p>
                   <p>
                     <ruby>自然<rt>しぜん</rt></ruby>のめぐりと<ruby>人<rt>ひと</rt></ruby>の<ruby>営<rt>いとな</rt></ruby>みが<ruby>重<rt>かさ</rt></ruby>なる<ruby>場<rt>ば</rt></ruby>で、<ruby>手<rt>て</rt></ruby>から<ruby>生<rt>う</rt></ruby>み<ruby>出<rt>だ</rt></ruby>されるものづくりの<ruby>扉<rt>とびら</rt></ruby>をそっと<ruby>開<rt>ひら</rt></ruby>いてみよう！
                   </p>
                 </section>

                 <hr className="border-gray-200" />
               </div>
            </>
          )}
              </div>
            </div>
          </>
        )}
        
        {/* テキスト非表示時の表示ボタン */}
        {!isTextVisible && (
          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30">
            <button
              onClick={() => setIsTextVisible(true)}
              className="bg-white rounded-l-full px-4 py-8 shadow-lg border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 text-gray-600 hover:text-gray-900 group"
              title="テキストを表示"
            >
              <div className="w-1 h-12 bg-gray-300 group-hover:bg-blue-500 rounded-full transition-colors mr-2" />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}