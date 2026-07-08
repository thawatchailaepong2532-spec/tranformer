/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { InspectionReport } from './types';
import { INITIAL_REPORTS } from './data/sampleData';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { InspectionList } from './components/InspectionList';
import { InspectionModal } from './components/InspectionModal';
import { InspectionFormModal } from './components/InspectionFormModal';
import { Zap, Plus, ShieldAlert } from 'lucide-react';

export default function App() {
  const [reports, setReports] = useState<InspectionReport[]>(() => {
    try {
      const saved = localStorage.getItem('transformer_inspection_reports');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    return INITIAL_REPORTS;
  });

  const [selectedReport, setSelectedReport] = useState<InspectionReport | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('transformer_inspection_reports', JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [reports]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleSaveReport = (newReportData: Omit<InspectionReport, 'id' | 'createdAt'>) => {
    const newReport: InspectionReport = {
      ...newReportData,
      id: `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
    showNotification('บันทึกผลการตรวจสอบหม้อแปลงสำเร็จ');
  };

  const handleDeleteReport = (id: string) => {
    if (window.confirm('คุณต้องการลบรายงานการตรวจสอบนี้ใช่หรือไม่?')) {
      setReports(prev => prev.filter(r => r.id !== id));
      showNotification('ลบรายงานเรียบร้อยแล้ว');
    }
  };

  const handleExportCSV = () => {
    if (reports.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก');
      return;
    }

    const headers = ['ID', 'Transformer Number', 'Inspector Name', 'Department', 'Inspection Date', 'Status', 'Temperature (°C)', 'Voltage', 'Latitude', 'Longitude', 'Location Address', 'Remarks'];
    const rows = reports.map(r => [
      r.id,
      `"${r.transformerNumber}"`,
      `"${r.inspectorName}"`,
      `"${r.department}"`,
      `"${r.inspectionDateTime}"`,
      r.status,
      r.oilTemperature ?? '',
      `"${r.voltageOutput ?? ''}"`,
      r.latitude,
      r.longitude,
      `"${r.locationAddress ?? ''}"`,
      `"${r.remarks.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transformer_inspection_reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('ส่งออกไฟล์ CSV สำเร็จ');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center space-x-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar 
        onOpenNewModal={() => setIsFormOpen(true)} 
        totalCount={reports.length} 
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Banner / Protocol Intro */}
        <div className="mb-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-100 border border-white/20 mb-3">
              <ShieldAlert className="w-3.5 h-3.5" /> Reporting Protocol & Field Monitoring
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ระบบรายงานผลการตรวจสอบหม้อแปลงไฟฟ้า
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
              Please ensure all fields are verified before submission. Data is synced directly to Central Control Database with GPS location and field photo verification.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>บันทึกผลตรวจสอบใหม่</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <StatsOverview reports={reports} />

        {/* Inspection Reports List / Table */}
        <InspectionList 
          reports={reports}
          onSelectReport={(report) => setSelectedReport(report)}
          onDeleteReport={handleDeleteReport}
          onExportCSV={handleExportCSV}
        />

      </main>

      {/* Footer Status Bar */}
      <footer className="bg-slate-900 text-slate-400 py-3 px-8 flex flex-col sm:flex-row justify-between items-center text-xs uppercase tracking-[0.2em] font-medium border-t border-slate-800">
        <div className="flex gap-6 mb-2 sm:mb-0">
          <span>Status: Ready</span>
          <span>Buffer: Synced</span>
          <span>Encryption: AES-256</span>
        </div>
        <div>
          Grid Monitoring v4.2.0-STABLE
        </div>
      </footer>

      {/* Modals */}
      <InspectionModal 
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      <InspectionFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveReport}
      />

    </div>
  );
}

