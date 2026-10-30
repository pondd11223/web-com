import React from "react";
import { Link } from "react-router-dom";
import { Cpu, Home, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center bg-white text-zinc-900 selection:bg-black selection:text-white">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-zinc-200 space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-black text-white flex items-center justify-center mx-auto shadow-md">
          <Cpu size={40} className="text-white" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-6xl font-black text-black tracking-tighter">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-black">ไม่พบหน้าที่ท่านต้องการ</h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
            หน้าเว็บหรือที่อยู่ URL ที่คุณกำลังค้นหาอาจถูกย้าย ลบออกไปแล้ว หรือไม่เคยมีอยู่จริงในระบบ NEXUS
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-md"
          >
            <Home size={16} />
            <span>กลับสู่หน้าแรก (Home)</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 hover:text-black text-xs font-semibold transition-all border border-zinc-300 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>ย้อนกลับ (Back)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
