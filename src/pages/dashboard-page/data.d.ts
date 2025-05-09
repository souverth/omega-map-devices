export type TMapProps = {
  SitesName: string;
  DeviceId: string;
  State: string;
  Group: string;
  Template: string;
  Point: TPoint;
  LastCommunication: string;
};

export type TPoint = [number, number];

export interface IFilter{
  Keyword: string
  State: string
}

export type ExtendedMap = LeafletMap & {
  getAllMarkers: () => L.Marker[];
};
