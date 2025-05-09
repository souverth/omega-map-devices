import getStateColor from "../../../utils/AppUtils";
import type { TMapProps } from "../data";

const PopupViewer = (device: TMapProps) => {
  const { SitesName, DeviceId, Template, Group, LastCommunication, State } = device;

  return `
    <div style="font-family: sans-serif; min-width: 200px;">
      <h4 style="margin: 0; font-size: 16px;">${SitesName}</h4>
      <p style="margin: 4px 0;">
        <strong>Device:</strong> ${DeviceId}<br/>
        <strong>Template:</strong> ${Template}<br/>
        <strong>Group:</strong> ${Group}<br/>
        <strong>State:</strong> <span style="color: ${getStateColor(State)}">${State}</span><br/>
        <strong>Last:</strong> ${LastCommunication}
      </p>
    </div>
  `;
};

export default PopupViewer;