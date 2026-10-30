import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export function LoadingSpinner({ text = "กำลังโหลดข้อมูล..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-12 h-12 rounded-full border-4 border-zinc-200 border-t-black animate-spin mb-4" />
      <p className="text-zinc-600 text-sm tracking-wide font-medium">{text}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-zinc-200 animate-pulse flex flex-col">
      <div className="w-full h-52 bg-zinc-100 rounded-2xl mb-4" />
      <div className="h-4 bg-zinc-100 rounded w-1/3 mb-2" />
      <div className="h-6 bg-zinc-100 rounded w-3/4 mb-3" />
      <div className="h-4 bg-zinc-100 rounded w-full mb-2" />
      <div className="h-4 bg-zinc-100 rounded w-2/3 mb-4" />
      <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
        <div className="h-6 bg-zinc-100 rounded w-20" />
        <div className="h-8 bg-zinc-100 rounded w-24" />
      </div>
    </div>
  );
}

export function ErrorState({
  message = "เกิดข้อผิดพลาดในการโหลดข้อมูล",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 text-black flex items-center justify-center mb-4">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-lg font-bold text-black mb-2">ไม่สามารถโหลดข้อมูลได้</h3>
      <p className="text-sm text-zinc-600 mb-6 leading-relaxed font-light">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors text-xs font-bold shadow-md cursor-pointer"
        >
          <RefreshCw size={14} />
          ลองใหม่อีกครั้ง
        </button>
      )}
    </div>
  );
}
