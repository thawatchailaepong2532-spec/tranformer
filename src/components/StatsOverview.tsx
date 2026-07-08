import React from 'react';
import { InspectionReport } from '../types';
import { ShieldCheck, AlertTriangle, XCircle, Database } from 'lucide-react';

interface StatsOverviewProps {
  reports: InspectionReport[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ reports }) => {
  const total = reports.length;
  const normal = reports.filter(r => r.status === 'normal').length;
  const warning = reports.filter(r => r.status === 'warning').length;
  const critical = reports.filter(r => r.status === 'critical').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <p className="text-sm font-medium text-slate-500">รายงานทั้งหมด</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{total}</h3>
          <p className="text-xs text-slate-400 mt-1">รายการในระบบปัจจุบัน</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
          <Database className="w-6 h-6" />
        </div>
      </div>

      {/* Normal Card */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <p className="text-sm font-medium text-emerald-600">สถานะปกติ</p>
          <h3 className="text-3xl font-bold text-emerald-700 mt-1">{normal}</h3>
          <p className="text-xs text-emerald-500 mt-1">พร้อมใช้งานปลอดภัย</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </div>

      {/* Warning Card */}
      <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <p className="text-sm font-medium text-amber-600">ต้องเฝ้าระวัง</p>
          <h3 className="text-3xl font-bold text-amber-700 mt-1">{warning}</h3>
          <p className="text-xs text-amber-500 mt-1">อุณหภูมิ/น้ำมันผิดปกติ</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>

      {/* Critical Card */}
      <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <p className="text-sm font-medium text-rose-600">ต้องซ่อมด่วน (Critical)</p>
          <h3 className="text-3xl font-bold text-rose-700 mt-1">{critical}</h3>
          <p className="text-xs text-rose-500 mt-1">ความเสี่ยงสูงต้องแก้ไขทันที</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
          <XCircle className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
