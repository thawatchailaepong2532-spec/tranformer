import { InspectionReport } from '../types';

export const INITIAL_REPORTS: InspectionReport[] = [
  {
    id: 'REP-2026-001',
    transformerNumber: 'TR-BKK-0842',
    inspectorName: 'นายสมชาย ใจดี',
    department: 'แผนกบำรุงรักษาระบบส่งไฟฟ้า กฟน.',
    inspectionDateTime: '2026-07-07T09:30',
    status: 'normal',
    oilTemperature: 62.5,
    voltageOutput: '24kV / 400V',
    oilLevel: 'normal',
    latitude: 13.7563,
    longitude: 100.5018,
    locationAddress: 'สถานีไฟฟ้าย่อยสาทร กรุงเทพมหานคร',
    remarks: 'หม้อแปลงทำงานปกติ อุณหภูมิน้ำมันอยู่ในเกณฑ์มาตรฐาน ไม่พบรอยรั่วซึมของน้ำมัน',
    photos: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'REP-2026-002',
    transformerNumber: 'TR-NON-1102',
    inspectorName: 'นายวิชัย มั่นคง',
    department: 'ทีมตรวจสอบภาคสนามเขต 2',
    inspectionDateTime: '2026-07-06T14:15',
    status: 'warning',
    oilTemperature: 78.2,
    voltageOutput: '22kV / 380V',
    oilLevel: 'low',
    latitude: 13.8615,
    longitude: 100.5158,
    locationAddress: 'นิคมอุตสาหกรรมบางกระสอ นนทบุรี',
    remarks: 'พบนํ้ามันฉนวนลดลงเล็กน้อย และอุณหภูมิสูงกว่าปกติ ควรวางแผนเติมนํ้ามันและตรวจเช็คโหลด',
    photos: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'REP-2026-003',
    transformerNumber: 'TR-CMI-0419',
    inspectorName: 'นายกิตติ ภูวดล',
    department: 'ฝ่ายวิศวกรรมไฟฟ้าภูมิภาค',
    inspectionDateTime: '2026-07-05T11:00',
    status: 'critical',
    oilTemperature: 91.0,
    voltageOutput: '11kV / 400V',
    oilLevel: 'low',
    latitude: 18.7883,
    longitude: 98.9853,
    locationAddress: 'ถนนช้างคลาน อ.เมือง เชียงใหม่',
    remarks: 'มีคราบน้ำมันรั่วซึมบริเวณปะเก็นขั้วต่อด้านแรงต่ำ อุณหภูมิสูงผิดปกติ เร่งด่วนต้องส่งทีมซ่อมบำรุง',
    photos: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];
