import crypto from "crypto";
import { prisma } from "./prisma";

const WINDOW_MINUTES = Number(process.env.MAGIC_LINK_WINDOW_MINUTES ?? 10);
const WINDOW_LIMIT = Number(process.env.MAGIC_LINK_WINDOW_LIMIT ?? 5);
const DAILY_LIMIT = Number(process.env.MAGIC_LINK_DAILY_LIMIT ?? 20);

export class MagicLinkRateLimitError extends Error {
  constructor(message = "TOO_MANY_MAGIC_LINK_REQUESTS") {
    super(message);
    this.name = "MagicLinkRateLimitError";
  }
}

export const hashIp = (ip?: string | null) =>
  ip ? crypto.createHash("sha256").update(ip).digest("hex") : undefined;

export async function enforceMagicLinkRateLimit({
  email,
  ip,
}: {
  email: string;
  ip?: string | null;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const now = Date.now();
  const windowStart = new Date(now - WINDOW_MINUTES * 60 * 1000);
  const dailyStart = new Date(now - 24 * 60 * 60 * 1000);

  const [windowCount, dailyCount] = await Promise.all([
    prisma.magicLinkRequest.count({
      where: { email: normalizedEmail, createdAt: { gte: windowStart } },
    }),
    prisma.magicLinkRequest.count({
      where: { email: normalizedEmail, createdAt: { gte: dailyStart } },
    }),
  ]);

  if (windowCount >= WINDOW_LIMIT || dailyCount >= DAILY_LIMIT) {
    throw new MagicLinkRateLimitError();
  }

  await prisma.magicLinkRequest.create({
    data: {
      email: normalizedEmail,
      ipHash: hashIp(ip),
    },
  });
}
