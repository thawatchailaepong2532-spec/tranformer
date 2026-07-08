import React, { useState } from 'react';
import { InspectionReport, InspectionStatus, FilterOptions } from '../types';
import { 
  Search, Filter, MapPin, Calendar, User, Eye, Trash2, 
  AlertTriangle, ShieldCheck, XCircle, Image as ImageIcon, Download, LayoutGrid, List
} from 'lucide-react';

interface InspectionListProps {
  reports: InspectionReport[];
  onSelectReport: (report: InspectionReport) => void;
  onDeleteReport: (id: string) => void;
  onExportCSV: () => void;
}

export const InspectionList: React.FC<InspectionListProps> = ({
  reports,
  onSelectReport,
  onDeleteReport,
  onExportCSV,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.transformerNumber.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      report.inspectorName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      report.department.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      report.locationAddress?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      report.remarks.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesStatus = filters.status === 'all' || report.status === filters.status;
    
    let matchesDate = true;
    if (filters.dateFrom) {
      matchesDate = matchesDate && report.inspectionDateTime >= filters.dateFrom;
    }
    if (filters.dateTo) {
      matchesDate = matchesDate && report.inspectionDateTime <= filters.dateTo + 'T23:59';
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: InspectionStatus) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> ปกติ (Normal)
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" /> เฝ้าระวัง (Warning)
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" /> ผิดปกติ/อันตราย (Critical)
          </span>
        );
    }
  };

  const formatDateThai = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Filter Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="ค้นหาหม้อแปลง, ผู้ตรวจสอบ, สถานที่..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-48">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
              className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none text-slate-700"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="normal">ปกติ (Normal)</option>
              <option value="warning">เฝ้าระวัง (Warning)</option>
              <option value="critical">ผิดปกติ/อันตราย (Critical)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* View Mode & Export */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="flex items-center bg-slate-200/70 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              title="แสดงแบบตาราง"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              title="แสดงแบบการ์ด"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onExportCSV}
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Reports Content */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">ไม่พบข้อมูลรายงานการตรวจสอบ</h3>
          <p className="text-slate-500 text-sm mt-1">ลองเปลี่ยนคำค้นหา หรือเพิ่มรายงานผลการตรวจสอบใหม่</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">หมายเลขหม้อแปลง</th>
                <th className="py-3.5 px-4">วันและเวลาตรวจสอบ</th>
                <th className="py-3.5 px-4">ผลการตรวจสอบ</th>
                <th className="py-3.5 px-4">พิกัด / สถานที่</th>
                <th className="py-3.5 px-4">ผู้ตรวจสอบ</th>
                <th className="py-3.5 px-4 text-center">รูปถ่าย</th>
                <th className="py-3.5 px-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>{report.transformerNumber}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{formatDateThai(report.inspectionDateTime)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="py-4 px-4 max-w-xs truncate">
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="truncate" title={report.locationAddress || `${report.latitude}, ${report.longitude}`}>
                        {report.locationAddress || `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-slate-900 font-medium">{report.inspectorName}</div>
                    <div className="text-xs text-slate-400">{report.department}</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {report.photos && report.photos.length > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        <ImageIcon className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        {report.photos.length} รูป
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">ไม่มีรูป</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => onSelectReport(report)}
                      className="inline-flex items-center px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-medium transition-colors"
                      title="ดูรายละเอียด"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> รายละเอียด
                    </button>
                    <button
                      onClick={() => onDeleteReport(report.id)}
                      className="inline-flex items-center p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-medium transition-colors"
                      title="ลบรายงาน"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 bg-slate-50/50">
          {filteredReports.map((report) => (
            <div 
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              {/* Card Photo Preview */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                {report.photos && report.photos.length > 0 ? (
                  <img 
                    src={report.photos[0]} 
                    alt={report.transformerNumber} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-10 h-10 mb-1 opacity-50" />
                    <span className="text-xs">ไม่มีรูปถ่ายหน้างาน</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(report.status)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{report.transformerNumber}</h3>
                    <span className="text-xs font-mono text-slate-400">{report.id}</span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{formatDateThai(report.inspectionDateTime)}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{report.locationAddress || `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{report.inspectorName} ({report.department})</span>
                    </div>
                  </div>

                  {report.remarks && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl mb-4 line-clamp-2">
                      <strong className="text-slate-700">หมายเหตุ:</strong> {report.remarks}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectReport(report)}
                    className="flex-1 mr-2 inline-flex items-center justify-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 py-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>ดูรายละเอียด</span>
                  </button>
                  <button
                    onClick={() => onDeleteReport(report.id)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                    title="ลบรายงาน"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
