import React from 'react';
import { InspectionReport } from '../types';
import { 
  X, MapPin, Calendar, User, ShieldCheck, AlertTriangle, 
  XCircle, Thermometer, Zap, Droplet, FileText, Printer, ExternalLink 
} from 'lucide-react';

interface InspectionModalProps {
  report: InspectionReport | null;
  onClose: () => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  const getStatusBadgeLarge = (status: string) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" /> ปกติ (Normal) - ปลอดภัยใช้งานได้ดี
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600" /> เฝ้าระวัง (Warning) - ควรตรวจสอบต่อเนื่อง
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-4 h-4 mr-1.5 text-rose-600" /> ผิดปกติ/อันตราย (Critical) - ต้องซ่อมด่วน
          </span>
        );
      default:
        return null;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden transform transition-all my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">รายละเอียดผลการตรวจสอบหม้อแปลง</h2>
              <p className="text-xs text-slate-400 font-mono">รหัสรายงาน: {report.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-medium transition-colors"
              title="พิมพ์รายงาน"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Status & Transformer Number */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200/80 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">หมายเลขหม้อแปลง</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{report.transformerNumber}</h3>
            </div>
            <div>{getStatusBadgeLarge(report.status)}</div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 mt-0.5">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">วันและเวลาในการกรอก</p>
                <p className="text-slate-800 font-semibold mt-0.5">
                  {new Date(report.inspectionDateTime).toLocaleString('th-TH', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 mt-0.5">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">ผู้ตรวจสอบ / สังกัด</p>
                <p className="text-slate-800 font-semibold mt-0.5">{report.inspectorName}</p>
                <p className="text-xs text-slate-500">{report.department}</p>
              </div>
            </div>
          </div>

          {/* Technical Specs if available */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">อุณหภูมิน้ำมัน</p>
                <p className="text-base font-bold text-slate-900">
                  {report.oilTemperature !== undefined ? `${report.oilTemperature} °C` : 'ไม่ระบุ'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">แรงดันไฟฟ้า (Voltage)</p>
                <p className="text-base font-bold text-slate-900">{report.voltageOutput || 'ไม่ระบุ'}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">ระดับน้ำมันฉนวน</p>
                <p className="text-base font-bold text-slate-900">
                  {report.oilLevel === 'normal' ? 'ปกติ (Normal)' : report.oilLevel === 'low' ? 'ต่ำกว่าเกณฑ์ (Low)' : report.oilLevel === 'high' ? 'สูงกว่าเกณฑ์ (High)' : 'ไม่ระบุ'}
                </p>
              </div>
            </div>
          </div>

          {/* Location & GPS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center">
                <MapPin className="w-4 h-4 text-rose-500 mr-1.5" /> พิกัดตำแหน่งหน้างาน (GPS Location)
              </h4>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>เปิดใน Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-sm text-slate-800 font-medium mb-1">
              {report.locationAddress || 'ระบุพิกัด GPS ตรงจุดติดตั้ง'}
            </p>
            <p className="text-xs font-mono text-slate-400">
              Latitude: {report.latitude}, Longitude: {report.longitude}
            </p>
          </div>

          {/* Remarks */}
          <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/60">
            <h4 className="text-sm font-semibold text-amber-900 mb-1 flex items-center">
              <FileText className="w-4 h-4 text-amber-600 mr-1.5" /> ผลการตรวจสอบ / ข้อเสนอแนะเพิ่มเติม
            </h4>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed mt-2">
              {report.remarks || 'ไม่มีหมายเหตุเพิ่มเติม'}
            </p>
          </div>

          {/* Photos Attachment */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3">
              รูปถ่ายหน้างานจริง ({report.photos?.length || 0} รูป)
            </h4>
            {report.photos && report.photos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {report.photos.map((photo, index) => (
                  <div key={index} className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 group relative">
                    <img 
                      src={photo} 
                      alt={`Transformer ${report.transformerNumber} - ${index + 1}`}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                      รูปถ่ายหน้างาน #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-sm">
                ไม่มีรูปถ่ายแนบในรายงานนี้
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
