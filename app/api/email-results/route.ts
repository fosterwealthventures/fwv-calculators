import { buildCalculatorResultsEmail } from "@/lib/emailTemplates/calculatorResultsEmail";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EmailResultsPayload = {
  calculatorName?: string;
  calculatorType?: string;
  summaryText?: string;
  summaryHtml?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  disclaimer?: string;
  userName?: string;
  userEmail?: string;
};

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  if (!RESEND_API_KEY || !FROM_EMAIL) {
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  let payload: EmailResultsPayload;

  try {
    payload = (await request.json()) as EmailResultsPayload;
  } catch {
    return badRequest("Invalid request body.");
  }

  const calculatorName = payload.calculatorName?.trim();
  const summaryText = payload.summaryText?.trim();
  const summaryHtml = payload.summaryHtml?.trim();
  const ctaLabel = payload.ctaLabel?.trim();
  const ctaUrl = payload.ctaUrl?.trim();
  const disclaimer = payload.disclaimer?.trim();
  const userEmail = payload.userEmail?.trim();
  const userName = payload.userName?.trim();

  if (!calculatorName) return badRequest("Missing calculatorName.");
  if (!summaryText && !summaryHtml) return badRequest("Missing summary content.");
  if (!ctaLabel) return badRequest("Missing ctaLabel.");
  if (!ctaUrl) return badRequest("Missing ctaUrl.");
  if (!disclaimer) return badRequest("Missing disclaimer.");
  if (!userEmail) return badRequest("Missing email address.");
  if (!EMAIL_RE.test(userEmail)) return badRequest("Invalid email address.");

  const resend = new Resend(RESEND_API_KEY);
  const email = buildCalculatorResultsEmail({
    calculatorName,
    calculatorType: payload.calculatorType || "utility",
    summaryText: summaryText || "",
    summaryHtml,
    ctaLabel,
    ctaUrl,
    disclaimer,
    userName,
  });

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });

    return NextResponse.json({ ok: true, id: result.data?.id ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}