import React from 'react';

interface IconProps {
  color?: string;
  size?: number;
}

export const SolarPanelIcon: React.FC<IconProps> = ({ color = '#4CAF50', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="4" y="8" width="32" height="24" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M4 16h32M4 24h32M14 8v24M26 8v24" stroke={color} strokeWidth="2"/>
    <path d="M6 4l4 4M30 4l4 4M20 4l4 4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const MPPTControllerIcon: React.FC<IconProps> = ({ color = '#2196F3', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="8" y="4" width="24" height="32" rx="2" stroke={color} strokeWidth="2"/>
    <rect x="12" y="8" width="16" height="8" rx="1" stroke={color} strokeWidth="2"/>
    <path d="M16 22h2M16 28h2M22 22h2M22 28h2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const BatteryIcon: React.FC<IconProps> = ({ color = '#FF9800', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="6" y="12" width="24" height="16" rx="2" stroke={color} strokeWidth="2"/>
    <rect x="30" y="16" width="4" height="8" fill={color}/>
    <path d="M10 16h16v8H10z" stroke={color} strokeWidth="2"/>
    <path d="M14 12v-4h8v4" stroke={color} strokeWidth="2"/>
  </svg>
);

export const CabinetIcon: React.FC<IconProps> = ({ color = '#9C27B0', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="8" y="4" width="24" height="32" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M12 8h16M12 32h16" stroke={color} strokeWidth="2"/>
    <path d="M12 12h16M12 16h16M12 20h16M12 24h16M12 28h16" stroke={color} strokeWidth="1"/>
    <circle cx="28" cy="8" r="1" fill={color}/>
    <circle cx="28" cy="32" r="1" fill={color}/>
  </svg>
);

export const ThreePhaseIcon: React.FC<IconProps> = ({ color = '#F44336', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M4 20h32" stroke={color} strokeWidth="2"/>
    <path d="M10 12c4 0 4 16 8 16s4-16 8-16 4 16 8 16" stroke={color} strokeWidth="2"/>
    <circle cx="6" cy="20" r="2" fill={color}/>
    <circle cx="34" cy="20" r="2" fill={color}/>
  </svg>
);

export const TowerIcon: React.FC<IconProps> = ({ color = '#607D8B', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M20 4v32" stroke={color} strokeWidth="2"/>
    <path d="M12 8h16M14 16h12M16 24h8M18 32h4" stroke={color} strokeWidth="2"/>
    <path d="M12 8l8-4 8 4M14 16l6-4 6 4M16 24l4-4 4 4" stroke={color} strokeWidth="2"/>
  </svg>
);

export const GeneratorIcon: React.FC<IconProps> = ({ color = '#795548', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="8" y="8" width="24" height="24" rx="2" stroke={color} strokeWidth="2"/>
    <circle cx="20" cy="20" r="8" stroke={color} strokeWidth="2"/>
    <path d="M20 12v8M20 20l5 5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 14h-4v12h4M32 14h4v12h-4" stroke={color} strokeWidth="2"/>
  </svg>
);
