export const dataset = [
  { london: 59, seoul: 21, month: "90-100" },
  { london: 50, seoul: 28, month: "80-89" },
  { london: 47, seoul: 41, month: "70-79" },
  { london: 54, seoul: 73, month: "60-69" },
  { london: 57, seoul: 99, month: "60<" },
];

export function valueFormatter(value: number | null) {
  return `${value}mm`;
}
