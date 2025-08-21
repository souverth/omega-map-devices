export interface PowerDevice {
  id: string;
  name: string;
  type: 'solar' | 'mppt' | 'battery' | 'generator' | 'cabinet' | 'tower' | 'cable' | 'rectifier';
  x: number;
  y: number;
  specs: string[];
  status: 'active' | 'inactive';
  voltage?: string;
  current?: string;
  power?: string;
}

export interface PowerConnection {
  style: string;
  id: string;
  from: string;
  to: string;
  type: 'dc' | 'ac';
  powerFlow: number; // kW
  animated?: boolean;
}

export interface CardStyle {
  background: string;
  border: string;
  icon: string;
  title: string;
}
