import type { TMapProps } from "../pages/dashboard-page/data";

const generateFakeData = (count = 100): TMapProps[] => {
  const center = { x: 10.762622, y: 106.660172 };

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

  const offset = () => (Math.random() - 10) * 0.1;

  return Array.from({ length: count }, (_, i) => {
    const code =
      randomStr(2, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") + randomNumStr(999, 3);
    return {
      Point: [center.x + offset(), center.y + offset()],
      SitesName: `${rand(["omega", "betelcom"])}-${i + 1}`,
      DeviceId:
        randomStr(3, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") + randomNumStr(1_000_000, 6),
      State: rand([1, 2, 3]),
      Template: code,
      Group: code,
      LastCommunication: randomDate(),
    };
  });
};

export default generateFakeData;
