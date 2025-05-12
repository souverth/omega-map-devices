import type { TMapProps } from "../pages/dashboard-page/data";

export function generateFakeData(count = 100): TMapProps[] {
  const centers = [
    { name: "Vietnam", x: 21.0285, y: 105.8542 },
    { name: "Japan", x: 35.6895, y: 139.6917 },
    { name: "USA", x: 40.7128, y: -74.006 },
    { name: "Germany", x: 52.52, y: 13.405 },
    { name: "France", x: 48.8566, y: 2.3522 },
    { name: "Australia", x: -33.8688, y: 151.2093 },
    { name: "Brazil", x: -23.5505, y: -46.6333 },
  ];

  const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const randomStr = (len: number, chars: string) =>
    Array.from({ length: len }, () => rand(chars.split(""))).join("");
  const randomNumStr = (max: number, padLen: number) =>
    Math.floor(Math.random() * max)
      .toString()
      .padStart(padLen, "0");
  const randomDate = () =>
    new Date(Date.now() - Math.floor(Math.random() * 1_000_000_000))
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
  const offset = () => (Math.random() - 0.5) * 1.5; // để lệch ~ < 1.5 độ

  return Array.from({ length: count }, (_, i) => {
    const center = rand(centers);
    const code =
      randomStr(2, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") + randomNumStr(999, 3);

    return {
      Point: [center.x + offset(), center.y + offset()],
      SitesName: `${rand(["omega", "betelcom", "skytech"])}-${i + 1}`,
      DeviceId:
        randomStr(3, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") + randomNumStr(1_000_000, 6),
      State: rand([1, 2, 3]),
      Template: code,
      Group: code,
      LastCommunication: randomDate(),
    };
  });
}

export function getNameStatus(state: number): string {
  const map: Record<number, string> = {
    1: "Online",
    2: "Offline",
    3: "Warning",
  };
  return map[state];
}

export function getStateColor(state: string) {
  switch (state) {
    case "Online":
      return "green";
    case "Offline":
      return "red";
    case "Warning":
      return "orange";
    default:
      return "gray";
  }
}
