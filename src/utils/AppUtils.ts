import type { TMapProps } from "../pages/map-page/data";

/**
 * Tạo dữ liệu giả cho bản đồ thiết bị
 * @param count Số lượng thiết bị cần tạo
 * @returns Mảng các thiết bị giả
 */
export function generateFakeData(count = 100): TMapProps[] {
  // Danh sách các trung tâm với tọa độ và trọng số phân bố
  const centers = [
    { name: "Vietnam", x: 21.0285, y: 105.8542, weight: 0.3 },  // 30% thiết bị ở Việt Nam
    { name: "Japan", x: 35.6895, y: 139.6917, weight: 0.2 },    // 20% thiết bị ở Nhật Bản
    { name: "USA", x: 40.7128, y: -74.006, weight: 0.15 },      // 15% thiết bị ở Mỹ
    { name: "Germany", x: 52.52, y: 13.405, weight: 0.1 },      // 10% thiết bị ở Đức
    { name: "France", x: 48.8566, y: 2.3522, weight: 0.1 },     // 10% thiết bị ở Pháp
    { name: "Australia", x: -33.8688, y: 151.2093, weight: 0.08 }, // 8% thiết bị ở Úc
    { name: "Brazil", x: -23.5505, y: -46.6333, weight: 0.07 }, // 7% thiết bị ở Brazil
  ];

  // Danh sách các công ty và loại thiết bị
  const companies = ["omega", "betelcom", "skytech", "techviet", "smartnet"];
  const deviceTypes = ["Router", "Switch", "Gateway", "Sensor", "Camera"];
  
  /**
   * Hàm chọn ngẫu nhiên có trọng số
   * Dùng để phân bố thiết bị theo vị trí địa lý một cách thực tế hơn
   */
  const weightedRand = <T extends { weight?: number }>(arr: T[]): T => {
    const totalWeight = arr.reduce((sum, item) => sum + (item.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const item of arr) {
      random -= item.weight || 1;
      if (random <= 0) return item;
    }
    return arr[arr.length - 1];
  };

  // Hàm chọn ngẫu nhiên đồng đều từ mảng
  const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  
  /**
   * Tạo chuỗi ký tự ngẫu nhiên
   * @param len Độ dài chuỗi cần tạo
   * @param chars Các ký tự có thể dùng
   */
  const randomStr = (len: number, chars: string) =>
    Array.from({ length: len }, () => rand(chars.split(""))).join("");
    
  /**
   * Tạo chuỗi số ngẫu nhiên có độ dài cố định
   * @param max Giá trị tối đa
   * @param padLen Độ dài chuỗi sau khi thêm số 0 phía trước
   */
  const randomNumStr = (max: number, padLen: number) =>
    Math.floor(Math.random() * max)
      .toString()
      .padStart(padLen, "0");
      
  /**
   * Tạo ngày ngẫu nhiên, ưu tiên ngày gần đây
   * Sử dụng phân phối mũ để tạo nhiều ngày gần đây hơn
   */
  const randomDate = () => {
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000); // 30 ngày trước
    // Phân phối mũ ưu tiên ngày gần đây
    const randomFactor = Math.pow(Math.random(), 2); // Bình phương để tạo độ lệch
    const timestamp = now - (randomFactor * (now - thirtyDaysAgo));
    
    return new Date(timestamp)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
  };
  
  /**
   * Tính độ lệch tọa độ dựa vào mật độ khu vực
   * Khu vực có mật độ cao sẽ có độ lệch lớn hơn
   */
  const offset = (center: { weight?: number }) => {
    const baseDensity = center.weight || 0.1;
    const maxOffset = baseDensity > 0.2 ? 2.5 : 1.0; // Khu vực mật độ cao có độ lệch tới 2.5 độ
    return (Math.random() - 0.5) * maxOffset;
  };

  /**
   * Tạo trạng thái thiết bị với phân phối thực tế hơn:
   * - 70% thiết bị Online
   * - 20% thiết bị Offline
   * - 10% thiết bị Warning
   */
  const getRandomState = (): number => {
    const stateWeights = [
      { state: 1, weight: 0.7 }, // 70% Online
      { state: 2, weight: 0.2 }, // 20% Offline  
      { state: 3, weight: 0.1 }, // 10% Warning
    ];
    return weightedRand(stateWeights).state;
  };

  // Tạo mảng thiết bị giả
  return Array.from({ length: count }, (_, i) => {
    // Chọn vị trí, công ty và loại thiết bị
    const center = weightedRand(centers);
    const company = rand(companies);
    const deviceType = rand(deviceTypes);
    
    // Tạo mã thiết bị thực tế hơn
    const regionCode = center.name.substring(0, 2).toUpperCase(); // 2 ký tự đầu của khu vực
    const typeCode = deviceType.substring(0, 2).toUpperCase();    // 2 ký tự đầu của loại thiết bị
    const code = `${regionCode}${typeCode}${randomNumStr(999, 3)}`;

    // Trả về thiết bị với các thuộc tính được tạo ngẫu nhiên
    return {
      Point: [center.x + offset(center), center.y + offset(center)],
      SitesName: `${company}-${center.name.toLowerCase()}-${String(i + 1).padStart(3, '0')}`,
      DeviceId: `${deviceType.toUpperCase()}-${randomStr(2, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")}${randomNumStr(100000, 5)}`,
      State: getRandomState(),
      Template: `TPL-${code}`,
      Group: `GRP-${regionCode}-${company.toUpperCase()}`,
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

export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}
