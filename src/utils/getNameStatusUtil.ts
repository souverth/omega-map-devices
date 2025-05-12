
export function getNameStatus(state: number): string {
  const map: Record<number, string> = {
    1: "Online",
    2: "Offline",
    3: "Warning",
  };
  return map[state];
}
