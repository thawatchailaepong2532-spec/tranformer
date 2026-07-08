export type InspectionStatus = 'normal' | 'warning' | 'critical';

export interface InspectionReport {
  id: string;
  transformerNumber: string;
  inspectorName: string;
  department: string;
  inspectionDateTime: string;
  status: InspectionStatus;
  oilTemperature?: number;
  voltageOutput?: string;
  oilLevel?: 'normal' | 'low' | 'high';
  latitude: number;
  longitude: number;
  locationAddress?: string;
  remarks: string;
  photos: string[]; // Base64 or image URLs
  createdAt: string;
}

export interface FilterOptions {
  searchQuery: string;
  status: 'all' | InspectionStatus;
  dateFrom: string;
  dateTo: string;
}
