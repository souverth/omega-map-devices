import type { PowerDevice, PowerConnection } from './types';

export const DEVICE_STYLES = {
  solar: { background: '#f3fbe7', border: '#6a9b41', title: 'Solar Panel' },
  mppt: { background: '#ecf8f8', border: '#5cbcb7', title: 'MPPT Controller' },
  battery: { background: '#f0f6ff', border: '#5d87d0', title: 'Battery Bank' },
  generator: { background: '#fff7e6', border: '#e6a23c', title: 'Generator' },
  cabinet: { background: '#f0f0f0', border: '#909399', title: 'Cabinet' },
  tower: { background: '#f9f0f9', border: '#a77caf', title: 'Tower' },
  cable: { background: '#f0f0f0', border: '#909399', title: 'Cable' },
  rectifier: { background: '#f5f5f5', border: '#607d8b', title: 'Rectifier' }
};

// Sample data cho các thiết bị trong hệ thống
// Thiết bị trong hệ thống điện
export const powerDevices: PowerDevice[] = [
  {
    id: 'solar1',
    name: 'Solar Panel Array',
    type: 'solar',
    x: 50,
    y: 180,
    specs: [
      'V solar: null',
      'kW solar: null',
      'kWh solar: null',
      'chưa nắm thông tin về thiết bị này'
    ],
    status: 'active'
  },
  {
    id: 'mppt1',
    name: 'MPPT Controller',
    type: 'mppt',
    x: 450,
    y: 180,
    specs: [
      'I solar: null',
      'chưa nắm thông tin về thiết bị này'
    ],
    status: 'active',
    voltage: '48V DC',
    power: '5.1 kW'
  },
  {
    id: 'battery1',
    name: 'Battery Cabinet',
    type: 'battery',
    x: 850,
    y: 180,
    specs: [
      'Grid parameter (P, Q, V, I, f, cosφ, …) ',
      'Type: Lithium Ion',
      'chưa nắm thông tin về thiết bị này',
    ],
    status: 'active',
    voltage: '48V DC',
    power: '4.8 kW'
  },
  {
    id: 'generator1',
    name: 'Backup Generator',
    type: 'generator',
    x: 50,
    y: 500,
    specs: [
      'Power: 10 kW',
      'Fuel: Diesel',
      'Tank: 200L',
      'Runtime: 72h',
      'chưa nắm thông tin về thiết bị này'
    ],
    status: 'inactive',
    voltage: '230V AC',
    power: '8 kW'
  },
  {
    id: 'cable1',
    name: '3-Phase Power Cable',
    type: 'cable',
    x: 500,
    y: 500,
    specs: [
      'Type: 3-Phase',
      'Rating: 6kW',
      'Voltage: 48V DC',
      'chưa nắm thông tin về thiết bị này'
    ],
    status: 'active',
  },
  {
    id: 'rectifier1',
    name: 'Rec',
    type: 'rectifier',
    x: 800,
    y: 500,
    specs: [
      'chưa nắm thông tin về thiết bị này'
    ],
    status: 'active',
    voltage: '230V AC',
    power: '5 kW'
  },
  {
    id: 'cabinet1',
    name: 'Main Cabinet',
    type: 'cabinet',
    x: 1250,
    y: 180,
    specs: [
      'Thông số SOC (%): null',
      'dung lượng (Ah/kWh): null',
      'trạng thái sạc/xả: null',
    ],
    status: 'active',
    voltage: '230V AC',
    power: '10 kW'
  },

  {
    id: 'tower1',
    name: 'Radio Tower',
    type: 'tower',
    x: 1650,
    y: 180,
    specs: [
      'Công suất tiêu thụ thực tế (P_load, kW)',
      'Năng lượng tiêu thụ (kWh)',
      'chưa nắm thông tin về thiết bị này'
    ],
    status: 'active',
  }

];

// Kết nối giữa các thiết bị
export const powerConnections: PowerConnection[] = [
  // Nhánh chính
  {
    id: 'solar-mppt',
    from: 'solar1',
    to: 'mppt1',
    type: 'dc',
    powerFlow: 5.2,
    animated: true,
    style: 'solid'
  },
  {
    id: 'mppt-battery',
    from: 'mppt1',
    to: 'battery1',
    type: 'dc',
    powerFlow: 5.1,
    animated: true,
    style: 'solid'
  },
  {
    id: 'battery-cabinet',
    from: 'battery1',
    to: 'cabinet1',
    type: 'dc',
    powerFlow: 4.8,
    animated: true,
    style: 'solid'
  },
  {
    id: 'cabinet-tower',
    from: 'cabinet1',
    to: 'tower1',
    type: 'ac',
    powerFlow: 4.5,
    animated: true,
    style: 'solid'
  },
  // Nhánh phụ
  {
    id: 'generator-cable',
    from: 'generator1',
    to: 'cable1',
    type: 'ac',
    powerFlow: 8.0,
    animated: true,
    style: 'dashed'
  },
  {
    id: 'cable-rectifier',
    from: 'cable1',
    to: 'rectifier1',
    type: 'ac',
    powerFlow: 8.0,
    animated: true,
    style: 'dashed'
  },
  {
    id: 'rectifier-battery',
    from: 'rectifier1',
    to: 'battery1',
    type: 'dc',
    powerFlow: 5.0,
    animated: true,
    style: 'dashed'
  }
];
