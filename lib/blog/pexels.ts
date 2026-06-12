import fs from "fs";
import path from "path";

const ENDPOINT = "https://api.pexels.com/v1/search";

export function getPexelsApiKey(): string | null {
  const key = (process.env.PEXELS_API_KEY || "").trim();
  return key || null;
}

export function buildPexelsQuery(title: string): string {
  const normalized = (title || "").toLowerCase();
  const rules: Array<{ match: string[]; query: string }> = [
    { match: ["mortgage"], query: "mortgage calculator" },
    { match: ["home", "afford"], query: "home affordability" },
    { match: ["side hustle"], query: "side hustle money" },
    { match: ["car", "afford"], query: "car affordability" },
    { match: ["car", "loan"], query: "car loan" },
    { match: ["student", "loan"], query: "student loan payoff" },
    { match: ["credit", "card"], query: "credit card payoff" },
    { match: ["roi"], query: "return on investment" },
    { match: ["investment"], query: "investing money" },
    { match: ["retirement"], query: "retirement savings" },
  ];

  for (const { match, query } of rules) {
    if (match.every((m) => normalized.includes(m))) return query;
  }

  const fallback = normalized
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 6)
    .join(" ");

  return fallback || "personal finance";
}

export async function fetchPexelsImageUrl(query: string, apiKey: string): Promise<string | null> {
  if (!query || !apiKey) return null;
  const url = `${ENDPOINT}?query=${encodeURIComponent(query)}&per_page=1`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: apiKey,
    },
  });

  if (!res.ok) {
    throw new Error(`Pexels search failed with status ${res.status}`);
  }

  const data = await res.json();
  const photo = data?.photos?.[0];
  const src = photo?.src?.medium || photo?.src?.original || photo?.src?.large;
  return typeof src === "string" && src.trim() ? src : null;
}

export async function downloadImageToFile(url: string, outPath: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed with status ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
}
