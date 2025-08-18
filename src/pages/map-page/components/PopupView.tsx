import { Button, Modal, Tag } from 'antd';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ClockCircleOutlined } from '@ant-design/icons';
import { getNameStatus, getStateColor } from "../../../utils/AppUtils";
import type { TMapProps } from "../data";
import styles from './component.module.css';


interface PopupContentProps {
  device: TMapProps;
}

const PopupContent = ({ device }: PopupContentProps) => {
  const [showModal, setShowModal] = useState(false);
  const { SitesName, DeviceId, Template, Group, LastCommunication, State } = device;

  return (
    <>
      <div style={{ fontFamily: 'sans-serif', minWidth: '220px' }}>
        <h4 style={{ margin: 0, fontSize: '16px' }}>{SitesName}</h4>
        <div style={{ margin: '4px 0' }}>
          <strong>Device Id:</strong> {DeviceId}<br/>
          <strong>Template:</strong> {Template}<br/>
          <strong>Group:</strong> {Group}<br/>
          <strong>State:</strong> <span style={{ color: getStateColor(getNameStatus(State)) }}>{getNameStatus(State)}</span><br/>
          <strong>Last:</strong> {LastCommunication}
        </div>
        <Button 
          type="link" 
          size="small" 
          onClick={() => setShowModal(true)}
          style={{ padding: 0, height: 'auto' }}
        >
          View Details
        </Button>
      </div>
      <DeviceDetailModal 
        device={device} 
        open={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};

const DeviceDetailModal = ({ device, open, onClose }: { device: TMapProps; open: boolean; onClose: () => void }) => {
  const {  DeviceId, Template, Group, LastCommunication, State, Point } = device;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="100vw"
      destroyOnHidden
      wrapClassName="custom-modal-fullscreen"
      modalRender={(modal) => (
        <div className={styles.modalContainer}>
          {modal}
        </div>
      )}
      styles={{
        body: {
          margin: 0,
          padding: 0
        }
      }}
      className={styles.modalBody}
    >
      <div className={styles.dashboardContainer}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>INFORMATION</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Device ID</span>
              <span className={styles.infoValue}>{DeviceId}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Template</span>
              <span className={styles.infoValue}>{Template}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Group</span>
              <span className={styles.infoValue}>{Group}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>STATUS</h2>
          <div className={styles.statusSection}>
            <Tag color={getStateColor(getNameStatus(State))} className={styles.statusTag}>
              {getNameStatus(State)}
            </Tag>
            <div className={styles.lastCommunication}>
              <ClockCircleOutlined className={styles.clockIcon} />
              <span className={styles.communicationTime}>{LastCommunication}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>WEATHER</h2>
          <div className={styles.weatherInfo}>
            <div className={styles.weatherItem}>
              <span className={styles.temperature}>50°F</span>
              <span className={styles.weatherDesc}>currently</span>
            </div>
            <div className={styles.weatherItem}>
              <span className={styles.temperature}>54°F</span>
              <span className={styles.weatherDesc}>tomorrow</span>
            </div>
            <div className={styles.weatherCondition}>
              Heavy cloud or overcast
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>CO₂ AVOIDANCE</h2>
          <div className={styles.co2Info}>
            <div className={styles.co2Item}>
              <span className={styles.co2Value}>108</span>
              <span className={styles.co2Label}>lb today</span>
            </div>
            <div className={styles.co2Item}>
              <span className={styles.co2Value}>302.9</span>
              <span className={styles.co2Label}>lb total</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>LOCATION</h2>
          <div className={styles.locationInfo}>
            <div className={styles.locationItem}>
              <span className={styles.locationLabel}>Latitude</span>
              <span className={styles.locationValue}>{Point[0]}</span>
            </div>
            <div className={styles.locationItem}>
              <span className={styles.locationLabel}>Longitude</span>
              <span className={styles.locationValue}>{Point[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const PopupViewer = (device: TMapProps) => {
  // Tạo container cho popup content
  const container = document.createElement('div');
  
  // Render React component vào container
  const root = createRoot(container);
  root.render(<PopupContent device={device} />);
  
  // Clean up khi popup đóng
  container.addEventListener('remove', () => {
    root.unmount();
  });

  return container;
};

export default PopupViewer;
