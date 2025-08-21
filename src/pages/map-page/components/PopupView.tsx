import { Button, Modal } from 'antd';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getNameStatus, getStateColor } from '../../../utils/AppUtils';
import type { TMapProps } from '../data';
import styles from './component.module.css';
import { PowerDiagram, powerDevices, powerConnections } from './power-diagram';

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
          <strong>Device Id:</strong> {DeviceId}
          <br />
          <strong>Template:</strong> {Template}
          <br />
          <strong>Group:</strong> {Group}
          <br />
          <strong>State:</strong>{' '}
          <span style={{ color: getStateColor(getNameStatus(State)) }}>{getNameStatus(State)}</span>
          <br />
          <strong>Last:</strong> {LastCommunication}
        </div>
        <Button type="link" size="small" onClick={() => setShowModal(true)} style={{ padding: 0, height: 'auto' }}>
          View Details
        </Button>
      </div>

      <DeviceDetailModal open={showModal} onClose={() => setShowModal(false)} deviceName={SitesName} />
    </>
  );
};

const DeviceDetailModal = ({ open, onClose, deviceName }: { open: boolean; onClose: () => void; deviceName: string }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="100vw"
      style={{ top: 0, padding: 0, margin: 0 }}
      destroyOnHidden
      wrapClassName="custom-modal-fullscreen"
      modalRender={(modal) => <div className={styles.modalContainer}>{modal}</div>}
      className={styles.modalBody}
      title={deviceName}
    >
      <PowerDiagram
        devices={powerDevices}
        connections={powerConnections}
        onDeviceClick={(deviceId) => {
          console.log('Device clicked:', deviceId);
        }}
      />
    </Modal>
  );
};

const PopupViewer = (device: TMapProps) => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(<PopupContent device={device} />);

  container.addEventListener('remove', () => {
    root.unmount();
  });

  return container;
};

export default PopupViewer;
