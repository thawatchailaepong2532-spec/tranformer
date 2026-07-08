import React, { useState } from 'react';
import { InspectionReport, InspectionStatus } from '../types';
import { X, MapPin, Camera, Zap, ShieldCheck, AlertTriangle, XCircle, RefreshCw, Upload } from 'lucide-react';

interface InspectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: Omit<InspectionReport, 'id' | 'createdAt'>) => void;
}

export const InspectionFormModal: React.FC<InspectionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [transformerNumber, setTransformerNumber] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [department, setDepartment] = useState('กฟภ. / กฟน.');
  
  // Format current date and time for datetime-local input (YYYY-MM-DDTHH:mm)
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const defaultDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  
  const [inspectionDateTime, setInspectionDateTime] = useState(defaultDateTime);
  const [status, setStatus] = useState<InspectionStatus>('normal');
  const [oilTemperature, setOilTemperature] = useState<string>('65');
  const [voltageOutput, setVoltageOutput] = useState<string>('24kV / 400V');
  const [oilLevel, setOilLevel] = useState<'normal' | 'low' | 'high'>('normal');
  const [latitude, setLatitude] = useState<number>(13.7563);
  const [longitude, setLongitude] = useState<number>(100.5018);
  const [locationAddress, setLocationAddress] = useState<string>('สถานีไฟฟ้า/จุดติดตั้ง กรุงเทพมหานคร');
  const [remarks, setRemarks] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Function to get current GPS location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์ของคุณไม่รองรับการระบุพิกัด GPS');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationAddress(`พิกัดปัจจุบัน (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error(error);
        alert('ไม่สามารถดึงพิกัด GPS ได้ กรุณาตรวจสอบการอนุญาตเข้าถึงตำแหน่ง');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotos(prev => [...prev, uploadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file as Blob);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transformerNumber.trim()) {
      alert('กรุณากรอกหมายเลขหม้อแปลง');
      return;
    }
    if (!inspectorName.trim()) {
      alert('กรุณากรอกชื่อผู้ตรวจสอบ');
      return;
    }

    onSave({
      transformerNumber: transformerNumber.trim(),
      inspectorName: inspectorName.trim(),
      department: department.trim(),
      inspectionDateTime,
      status,
      oilTemperature: oilTemperature ? parseFloat(oilTemperature) : undefined,
      voltageOutput: voltageOutput.trim(),
      oilLevel,
      latitude,
      longitude,
      locationAddress: locationAddress.trim(),
      remarks: remarks.trim(),
      photos,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden transform transition-all my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">บันทึกรายงานผลการตรวจสอบหม้อแปลง</h2>
              <p className="text-xs text-slate-400">กรอกข้อมูลรายละเอียดหน้างานและแนบภาพถ่าย</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Transformer Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                หมายเลขหม้อแปลง <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น TR-BKK-0982"
                value={transformerNumber}
                onChange={(e) => setTransformerNumber(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            {/* Inspection Date & Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                วันและเวลาในการกรอก <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={inspectionDateTime}
                onChange={(e) => setInspectionDateTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Inspector Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                ชื่อผู้ตรวจสอบ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น นายสมชาย ใจดี"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                สังกัด / หน่วยงาน
              </label>
              <input
                type="text"
                placeholder="เช่น การไฟฟ้านครหลวง / การไฟฟ้าส่วนภูมิภาค"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              ผลการตรวจสอบ (Status) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className={`flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${status === 'normal' ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                <input
                  type="radio"
                  name="status"
                  value="normal"
                  checked={status === 'normal'}
                  onChange={() => setStatus('normal')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-900">ปกติ (Normal)</span>
                </div>
              </label>

              <label className={`flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${status === 'warning' ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                <input
                  type="radio"
                  name="status"
                  value="warning"
                  checked={status === 'warning'}
                  onChange={() => setStatus('warning')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-900">เฝ้าระวัง (Warning)</span>
                </div>
              </label>

              <label className={`flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${status === 'critical' ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                <input
                  type="radio"
                  name="status"
                  value="critical"
                  checked={status === 'critical'}
                  onChange={() => setStatus('critical')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span className="text-sm font-semibold text-rose-900">ผิดปกติ/อันตราย</span>
                </div>
              </label>
            </div>
          </div>

          {/* Technical measurements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">อุณหภูมิน้ำมัน (°C)</label>
              <input
                type="number"
                step="0.1"
                placeholder="65.0"
                value={oilTemperature}
                onChange={(e) => setOilTemperature(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">แรงดันไฟฟ้า</label>
              <input
                type="text"
                placeholder="24kV / 400V"
                value={voltageOutput}
                onChange={(e) => setVoltageOutput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">ระดับน้ำมันฉนวน</label>
              <select
                value={oilLevel}
                onChange={(e) => setOilLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              >
                <option value="normal">ปกติ (Normal)</option>
                <option value="low">ต่ำกว่าเกณฑ์ (Low)</option>
                <option value="high">สูงกว่าเกณฑ์ (High)</option>
              </select>
            </div>
          </div>

          {/* Location & GPS Section */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <MapPin className="w-4 h-4 text-rose-500 mr-1.5" /> พิกัดตำแหน่ง (GPS Location)
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGettingLocation ? 'animate-spin' : ''}`} />
                <span>ดึงพิกัดปัจจุบันอัตโนมัติ</span>
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="รายละเอียดสถานที่ / ชื่อสถานี / ถนน"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm mb-2"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-500">Latitude</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-500">Longitude</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              ผลการตรวจสอบ / ข้อเสนอแนะ / อาการผิดปกติ
            </label>
            <textarea
              rows={3}
              placeholder="ระบุรายละเอียดผลการตรวจสภาพภายนอก, ขั้วต่อ, เสียงฮัม, หรือข้อเสนอแนะในการซ่อมบำรุง..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            ></textarea>
          </div>

          {/* Photo Attachment Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Camera className="w-4 h-4 text-slate-500 mr-1.5" /> แนบรูปถ่ายหน้างานจริง
              </label>
              <label className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer shadow-sm transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>เลือกรูปภาพ / ถ่ายภาพ</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative rounded-xl overflow-hidden border border-slate-200 h-28 group bg-slate-100">
                    <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1.5 right-1.5 bg-rose-600 text-white p-1 rounded-full text-xs shadow-md opacity-80 hover:opacity-100 transition-opacity"
                      title="ลบรูปนี้"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400">
                <Camera className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">ยังไม่มีรูปถ่ายแนบ สามารถคลิกปุ่มเลือกรูปภาพด้านบน</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-sm transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
            >
              บันทึกรายงาน
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
