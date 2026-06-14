// French departments centroids (lat/lng) keyed by 2-digit postal code prefix
// Used to plot member density on the France map without shipping the full INSEE dataset.
export interface DepartementInfo {
  code: string;
  nom: string;
  lat: number;
  lng: number;
}

export const FR_DEPARTEMENTS: Record<string, DepartementInfo> = {
  "01": { code: "01", nom: "Ain", lat: 46.10, lng: 5.35 },
  "02": { code: "02", nom: "Aisne", lat: 49.55, lng: 3.55 },
  "03": { code: "03", nom: "Allier", lat: 46.40, lng: 3.20 },
  "04": { code: "04", nom: "Alpes-de-Haute-Provence", lat: 44.10, lng: 6.25 },
  "05": { code: "05", nom: "Hautes-Alpes", lat: 44.65, lng: 6.50 },
  "06": { code: "06", nom: "Alpes-Maritimes", lat: 43.95, lng: 7.20 },
  "07": { code: "07", nom: "Ardèche", lat: 44.75, lng: 4.40 },
  "08": { code: "08", nom: "Ardennes", lat: 49.60, lng: 4.65 },
  "09": { code: "09", nom: "Ariège", lat: 42.95, lng: 1.55 },
  "10": { code: "10", nom: "Aube", lat: 48.30, lng: 4.15 },
  "11": { code: "11", nom: "Aude", lat: 43.10, lng: 2.45 },
  "12": { code: "12", nom: "Aveyron", lat: 44.30, lng: 2.75 },
  "13": { code: "13", nom: "Bouches-du-Rhône", lat: 43.55, lng: 5.10 },
  "14": { code: "14", nom: "Calvados", lat: 49.10, lng: -0.40 },
  "15": { code: "15", nom: "Cantal", lat: 45.05, lng: 2.65 },
  "16": { code: "16", nom: "Charente", lat: 45.70, lng: 0.20 },
  "17": { code: "17", nom: "Charente-Maritime", lat: 45.75, lng: -0.65 },
  "18": { code: "18", nom: "Cher", lat: 47.05, lng: 2.50 },
  "19": { code: "19", nom: "Corrèze", lat: 45.35, lng: 1.85 },
  "21": { code: "21", nom: "Côte-d'Or", lat: 47.45, lng: 4.75 },
  "22": { code: "22", nom: "Côtes-d'Armor", lat: 48.45, lng: -2.85 },
  "23": { code: "23", nom: "Creuse", lat: 46.05, lng: 2.05 },
  "24": { code: "24", nom: "Dordogne", lat: 45.15, lng: 0.75 },
  "25": { code: "25", nom: "Doubs", lat: 47.15, lng: 6.40 },
  "26": { code: "26", nom: "Drôme", lat: 44.70, lng: 5.20 },
  "27": { code: "27", nom: "Eure", lat: 49.10, lng: 1.10 },
  "28": { code: "28", nom: "Eure-et-Loir", lat: 48.45, lng: 1.30 },
  "29": { code: "29", nom: "Finistère", lat: 48.25, lng: -4.10 },
  "2A": { code: "2A", nom: "Corse-du-Sud", lat: 41.85, lng: 9.00 },
  "2B": { code: "2B", nom: "Haute-Corse", lat: 42.40, lng: 9.20 },
  "30": { code: "30", nom: "Gard", lat: 44.05, lng: 4.25 },
  "31": { code: "31", nom: "Haute-Garonne", lat: 43.40, lng: 1.40 },
  "32": { code: "32", nom: "Gers", lat: 43.65, lng: 0.55 },
  "33": { code: "33", nom: "Gironde", lat: 44.85, lng: -0.55 },
  "34": { code: "34", nom: "Hérault", lat: 43.60, lng: 3.40 },
  "35": { code: "35", nom: "Ille-et-Vilaine", lat: 48.15, lng: -1.55 },
  "36": { code: "36", nom: "Indre", lat: 46.75, lng: 1.55 },
  "37": { code: "37", nom: "Indre-et-Loire", lat: 47.25, lng: 0.70 },
  "38": { code: "38", nom: "Isère", lat: 45.25, lng: 5.55 },
  "39": { code: "39", nom: "Jura", lat: 46.70, lng: 5.65 },
  "40": { code: "40", nom: "Landes", lat: 43.95, lng: -0.75 },
  "41": { code: "41", nom: "Loir-et-Cher", lat: 47.60, lng: 1.45 },
  "42": { code: "42", nom: "Loire", lat: 45.75, lng: 4.30 },
  "43": { code: "43", nom: "Haute-Loire", lat: 45.10, lng: 3.80 },
  "44": { code: "44", nom: "Loire-Atlantique", lat: 47.35, lng: -1.65 },
  "45": { code: "45", nom: "Loiret", lat: 47.90, lng: 2.30 },
  "46": { code: "46", nom: "Lot", lat: 44.65, lng: 1.60 },
  "47": { code: "47", nom: "Lot-et-Garonne", lat: 44.35, lng: 0.50 },
  "48": { code: "48", nom: "Lozère", lat: 44.55, lng: 3.50 },
  "49": { code: "49", nom: "Maine-et-Loire", lat: 47.40, lng: -0.55 },
  "50": { code: "50", nom: "Manche", lat: 49.10, lng: -1.35 },
  "51": { code: "51", nom: "Marne", lat: 48.95, lng: 4.35 },
  "52": { code: "52", nom: "Haute-Marne", lat: 48.10, lng: 5.15 },
  "53": { code: "53", nom: "Mayenne", lat: 48.15, lng: -0.65 },
  "54": { code: "54", nom: "Meurthe-et-Moselle", lat: 48.80, lng: 6.15 },
  "55": { code: "55", nom: "Meuse", lat: 49.00, lng: 5.40 },
  "56": { code: "56", nom: "Morbihan", lat: 47.85, lng: -2.85 },
  "57": { code: "57", nom: "Moselle", lat: 49.05, lng: 6.65 },
  "58": { code: "58", nom: "Nièvre", lat: 47.10, lng: 3.50 },
  "59": { code: "59", nom: "Nord", lat: 50.50, lng: 3.25 },
  "60": { code: "60", nom: "Oise", lat: 49.40, lng: 2.40 },
  "61": { code: "61", nom: "Orne", lat: 48.65, lng: 0.10 },
  "62": { code: "62", nom: "Pas-de-Calais", lat: 50.50, lng: 2.30 },
  "63": { code: "63", nom: "Puy-de-Dôme", lat: 45.75, lng: 3.10 },
  "64": { code: "64", nom: "Pyrénées-Atlantiques", lat: 43.30, lng: -0.75 },
  "65": { code: "65", nom: "Hautes-Pyrénées", lat: 43.05, lng: 0.15 },
  "66": { code: "66", nom: "Pyrénées-Orientales", lat: 42.60, lng: 2.65 },
  "67": { code: "67", nom: "Bas-Rhin", lat: 48.65, lng: 7.65 },
  "68": { code: "68", nom: "Haut-Rhin", lat: 47.90, lng: 7.30 },
  "69": { code: "69", nom: "Rhône", lat: 45.85, lng: 4.60 },
  "70": { code: "70", nom: "Haute-Saône", lat: 47.65, lng: 6.10 },
  "71": { code: "71", nom: "Saône-et-Loire", lat: 46.65, lng: 4.55 },
  "72": { code: "72", nom: "Sarthe", lat: 47.95, lng: 0.20 },
  "73": { code: "73", nom: "Savoie", lat: 45.50, lng: 6.45 },
  "74": { code: "74", nom: "Haute-Savoie", lat: 46.05, lng: 6.40 },
  "75": { code: "75", nom: "Paris", lat: 48.86, lng: 2.35 },
  "76": { code: "76", nom: "Seine-Maritime", lat: 49.65, lng: 1.05 },
  "77": { code: "77", nom: "Seine-et-Marne", lat: 48.55, lng: 3.00 },
  "78": { code: "78", nom: "Yvelines", lat: 48.80, lng: 1.85 },
  "79": { code: "79", nom: "Deux-Sèvres", lat: 46.55, lng: -0.30 },
  "80": { code: "80", nom: "Somme", lat: 49.95, lng: 2.30 },
  "81": { code: "81", nom: "Tarn", lat: 43.80, lng: 2.15 },
  "82": { code: "82", nom: "Tarn-et-Garonne", lat: 44.10, lng: 1.30 },
  "83": { code: "83", nom: "Var", lat: 43.45, lng: 6.20 },
  "84": { code: "84", nom: "Vaucluse", lat: 44.00, lng: 5.15 },
  "85": { code: "85", nom: "Vendée", lat: 46.70, lng: -1.35 },
  "86": { code: "86", nom: "Vienne", lat: 46.55, lng: 0.45 },
  "87": { code: "87", nom: "Haute-Vienne", lat: 45.90, lng: 1.20 },
  "88": { code: "88", nom: "Vosges", lat: 48.20, lng: 6.45 },
  "89": { code: "89", nom: "Yonne", lat: 47.85, lng: 3.55 },
  "90": { code: "90", nom: "Territoire de Belfort", lat: 47.65, lng: 6.95 },
  "91": { code: "91", nom: "Essonne", lat: 48.55, lng: 2.30 },
  "92": { code: "92", nom: "Hauts-de-Seine", lat: 48.85, lng: 2.25 },
  "93": { code: "93", nom: "Seine-Saint-Denis", lat: 48.92, lng: 2.48 },
  "94": { code: "94", nom: "Val-de-Marne", lat: 48.78, lng: 2.47 },
  "95": { code: "95", nom: "Val-d'Oise", lat: 49.08, lng: 2.15 },
};

/** Returns the 2-char department code from a French postal code, or null. */
export function deptCodeFromCp(cp?: string | null): string | null {
  if (!cp) return null;
  const clean = cp.replace(/\s/g, "");
  if (clean.startsWith("20")) {
    const n = parseInt(clean.slice(0, 5), 10);
    if (n >= 20000 && n <= 20190) return "2A";
    if (n >= 20200 && n <= 20620) return "2B";
    return "2A";
  }
  const prefix = clean.slice(0, 2);
  return FR_DEPARTEMENTS[prefix] ? prefix : null;
}
