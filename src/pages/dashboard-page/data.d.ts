export type TMapProps = {
  SitesName: string;
  DeviceId: string;
  State: number;
  Group: string;
  Template: string;
  Point: TPoint;
  LastCommunication: string;
};

export type TPoint = [number, number];

export interface IFilter{
  Keyword: string
  State: number
}

export type ExtendedMap = LeafletMap & {
  getAllMarkers: () => L.Marker[];
};
