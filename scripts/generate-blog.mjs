// scripts/generate-blog.mjs
import fs from "fs";
import path from "path";

// --- Config ---
const OUT_DIR = path.join(process.cwd(), "content", "blog");
const TOPICS = [
  "Cash flow management for small businesses",
  "ROI vs IRR explained with examples",
  "Break-even analysis for SaaS founders",
  "Mortgage basics: APR, points, and amortization",
  "Employee total cost of ownership (TCO)",
  "Savings growth strategies and compounding",
  "Debt payoff strategies: avalanche vs snowball",
];

// Today’s date
const today = new Date();
const isoDate = today.toISOString().slice(0, 10);

// Pick a topic deterministically (one per day)
const topic = TOPICS[today.getUTCDate() % TOPICS.length];

// Use your OpenAI key from GitHub Actions secrets
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY env var");
  process.exit(1);
}

// --- Helper: Slugify title into filename ---
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// --- Helper: Generate blog content from OpenAI ---
async function generatePost(topic) {
  const prompt = `
Write a 1200–1600 word blog post for Foster Wealth Ventures about: "${topic}".
- Professional but approachable tone (affluent, trustworthy, friendly).
- Include H1, H2, H3 headings.
- Use bullet points and short paragraphs.
- Naturally include SEO keywords.
- End with a short branded note: "Written for Foster Wealth Ventures — Unlocking financial clarity."
Output only markdown body, no frontmatter.
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // you can change to gpt-4.1, gpt-4o, or gpt-3.5-turbo if you prefer
      messages: [
        { role: "system", content: "You are a senior financial writer at Foster Wealth Ventures." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const mdBody = data.choices?.[0]?.message?.content?.trim() || "# Draft\n\n(Empty)";
  return mdBody;
}

// --- Main ---
async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const slug = `${isoDate}-${slugify(topic)}`;
  const outPath = path.join(OUT_DIR, `${slug}.md`);

  // Avoid duplicates
  if (fs.existsSync(outPath)) {
    console.log("✅ Post already exists for today:", outPath);
    return;
  }

  console.log(`📝 Generating blog post about: ${topic}`);

  const body = await generatePost(topic);

  const frontmatter = [
    "---",
    `title: "${topic.replace(/"/g, '\\"')}"`,
    `date: "${isoDate}"`,
    `description: "${topic} — insights from Foster Wealth Ventures."`,
    "---",
    "",
  ].join("\n");

  fs.writeFileSync(outPath, frontmatter + body, "utf-8");
  console.log("✅ Wrote new blog post:", outPath);
}

main().catch((err) => {
  console.error("❌ Error generating blog:", err);
  process.exit(1);
});
