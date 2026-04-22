/**
 * Хуучин формоос үлдсэн «GPS 47.xxx, 106.xxx - …» эсвэл зөвхөн GPS мөрийг
 * хүний унших байршлын текстээс хасна (координат зөвхөн API `coordinates`-д явна).
 */
export function stripGpsPrefixFromLocationText(value: string): string {
  return value
    .replace(/^GPS\s+-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*-\s*/i, "")
    .replace(/^GPS\s+-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/i, "")
    .trim();
}
