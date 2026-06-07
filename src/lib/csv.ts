type CsvValue = string | number | boolean | null | undefined;

function escapeCsvValue(value: CsvValue) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function toCsv(rows: Record<string, CsvValue>[]) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [headers.map(escapeCsvValue).join(",")];

  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsvValue(row[header])).join(","));
  }

  return lines.join("\n");
}
