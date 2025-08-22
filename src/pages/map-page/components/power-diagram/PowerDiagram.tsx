import { useCallback, useMemo } from 'react';
import styles from './PowerDiagram.module.css';
import type { PowerDevice, PowerConnection } from './types';
import { DEVICE_STYLES } from './diagram-data';
import {
  SolarPanelIcon,
  MPPTControllerIcon,
  BatteryIcon,
  CabinetIcon,
  GeneratorIcon,
  TowerIcon,
  ThreePhaseIcon
} from './device-icons';

type Props = {
  devices: PowerDevice[];
  connections: PowerConnection[];
  onDeviceClick?: (deviceId: string) => void;
};

export const PowerDiagram = ({ devices, connections, onDeviceClick }: Props) => {
  // Tính toán kích thước khung nhìn SVG dựa trên vị trí các thiết bị
  const dimensions = useMemo(() => {
    const maxX = Math.max(...devices.map(d => d.x)) + 200;
    const maxY = Math.max(...devices.map(d => d.y)) + 100;
    return { width: maxX, height: maxY };
  }, [devices]);

  // Tính toán đường dẫn cho các kết nối giữa các thiết bị
  const getConnectionPath = useCallback((from: PowerDevice, to: PowerDevice) => {
    const fromWidth = from.type === 'cable' ? 160 : 280;
    const startX = from.x + fromWidth;
    const startY = from.y + 40; // Center of the card
    const endX = to.x;
    const endY = to.y + 40;

    // Tính toán điểm điều khiển cho đường cong mượt hơn
    const dx = endX - startX;
    // const dy = endY - startY;
    const controlX1 = startX + dx * 0.25;
    const controlX2 = startX + dx * 0.75;

    return `M ${startX} ${startY}
            C ${controlX1} ${startY},
              ${controlX2} ${endY},
              ${endX} ${endY}`;
  }, []);  // Xử lý sự kiện click vào thiết bị
  const handleDeviceClick = useCallback((deviceId: string) => {
    onDeviceClick?.(deviceId);
  }, [onDeviceClick]);

  const getDeviceStyle = useCallback((type: PowerDevice['type']) => {
    // Sử dụng trực tiếp kiểu thiết bị hoặc dùng kiểu tower làm mặc định
    const style = DEVICE_STYLES[type];
    return style || DEVICE_STYLES.tower;
  }, []);

  return (
    <div className={styles.container}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className={styles.connections}
      >
        {/* Hiển thị các kết nối */}
        {connections.map(conn => {
          const fromDevice = devices.find(d => d.id === conn.from);
          const toDevice = devices.find(d => d.id === conn.to);
          if (!fromDevice || !toDevice) return null;

          return (
            <g key={conn.id}>
              <path
                id={conn.id}
                d={getConnectionPath(fromDevice, toDevice)}
                className={`${styles.connection} ${styles[conn.type]} ${conn.animated ? styles.animated : ''} ${conn.style === 'dashed' ? styles.dashed : ''}`}
                strokeDasharray={conn.style === 'dashed' ? "10,10" : undefined}
              />
              {conn.powerFlow != null && (
                <text
                  className={styles.powerFlow}
                  dy={-10}
                >
                  <textPath
                    href={`#${conn.id}`}
                    startOffset="50%"
                  >
                    {conn.powerFlow} kW
                  </textPath>
                </text>
              )}
            </g>
          );
        })}

        {/* Định nghĩa mũi tên */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
        </defs>
      </svg>

      {/* Hiển thị các thẻ thiết bị */}
      {devices.map(device => {
        const style = getDeviceStyle(device.type);

        return (
          <div
            key={device.id}
            className={styles.deviceCard}
            data-type={device.type}
            style={{
              left: device.x,
              top: device.y,
              background: style.background,
              borderColor: style.border
            }}
            onClick={() => handleDeviceClick(device.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleDeviceClick(device.id);
              }
            }}
            aria-label={`${device.name} - ${device.status}`}
          >
            <header className={styles.cardHeader}>
              <span className={styles.icon}>
                {device.type === 'solar' && <SolarPanelIcon color={style.border} />}
                {device.type === 'mppt' && <MPPTControllerIcon color={style.border} />}
                {device.type === 'battery' && <BatteryIcon color={style.border} />}
                {device.type === 'cabinet' && <CabinetIcon color={style.border} />}
                {device.type === 'generator' && <GeneratorIcon color={style.border} />}
                {device.type === 'tower' && <TowerIcon color={style.border} />}
                {device.type === 'cable' && <ThreePhaseIcon color={style.border} />}
              </span>
              <h3 className={styles.name}>{device.name}</h3>
              <span className={`${styles.status} ${styles[device.status]}`} />
            </header>

            <div className={styles.specs}>
              <ul className={styles.specsList}>
                {device.specs.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};
