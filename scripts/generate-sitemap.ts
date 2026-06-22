// Generates public/sitemap.xml. Runs via predev/prebuild npm scripts.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://futurproche.com";

interface Entry {
  path: string;
  changefreq?: "weekly" | "monthly" | "daily" | "yearly";
  priority?: string;
}

// Only public, indexable routes. Admin / espace-membre / auth excluded.
const entries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/communaute", changefreq: "monthly", priority: "0.9" },
  { path: "/evenements", changefreq: "weekly", priority: "0.9" },
  { path: "/ressources", changefreq: "weekly", priority: "0.8" },
  { path: "/partenaires", changefreq: "monthly", priority: "0.7" },
  { path: "/a-propos", changefreq: "monthly", priority: "0.7" },
  { path: "/candidater", changefreq: "monthly", priority: "0.9" },
  { path: "/carte", changefreq: "monthly", priority: "0.6" },
];

const today = new Date().toISOString().slice(0, 10);

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
