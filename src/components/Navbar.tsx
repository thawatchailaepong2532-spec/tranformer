import React from 'react';
import { PlusCircle, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenNewModal: () => void;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewModal, totalCount }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20">
            T
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                ระบบรายงานผลการตรวจสอบหม้อแปลงไฟฟ้า
              </h1>
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Online ({totalCount} รายการ)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              ระบบบันทึกและตรวจสอบสถานะหม้อแปลงไฟฟ้า พิกัด GPS และรูปถ่ายหน้างาน
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:block text-right">
            <p className="text-sm font-semibold text-slate-700">Somchai Engineering</p>
            <p className="text-xs text-emerald-600 font-medium">● Online | ID: 48821</p>
          </div>
          <button
            onClick={onOpenNewModal}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">บันทึกผลตรวจสอบใหม่</span>
            <span className="sm:hidden">เพิ่มรายงาน</span>
          </button>
        </div>
      </div>
    </header>
  );
};

