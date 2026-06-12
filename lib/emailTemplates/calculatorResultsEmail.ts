type CalculatorResultsEmailInput = {
  calculatorName: string;
  calculatorType: string;
  summaryText: string;
  summaryHtml?: string;
  ctaLabel: string;
  ctaUrl: string;
  disclaimer: string;
  userName?: string;
  generatedAt?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function firstName(name?: string) {
  const cleaned = name?.trim();
  if (!cleaned) return "";
  return cleaned.split(/\s+/)[0] ?? "";
}

function resolveCtaUrl(url: string) {
  try {
    return new URL(url, process.env.SITE_URL || "https://fosterwealthventures.store").toString();
  } catch {
    return url;
  }
}

function summaryToHtml(summaryText: string) {
  const rows = summaryText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex <= 0) {
        return `<tr><td style="padding:8px 0; color:#334155; font-size:14px;" colspan="2">${escapeHtml(line)}</td></tr>`;
      }

      const label = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      return `<tr><td style="padding:8px 12px 8px 0; color:#64748b; font-size:13px; width:42%; vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 0; color:#0f172a; font-size:14px; font-weight:600; vertical-align:top;">${escapeHtml(value)}</td></tr>`;
    })
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>`;
}

export function buildCalculatorResultsEmail(input: CalculatorResultsEmailInput) {
  const generatedAt = input.generatedAt || new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const greetingName = firstName(input.userName);
  const ctaUrl = resolveCtaUrl(input.ctaUrl);
  const summaryHtml = input.summaryHtml || summaryToHtml(input.summaryText);
  const introName = greetingName ? `${escapeHtml(greetingName)},` : "";
  const subject = `${input.calculatorName} results from Foster Wealth Ventures`;

  const html = `
  <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
        <div style="background:linear-gradient(135deg,#3B1663,#10b981);padding:24px 28px;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.85;margin-bottom:8px;">Foster Wealth Ventures</div>
          <div style="font-size:26px;font-weight:700;line-height:1.2;">${escapeHtml(input.calculatorName)} results</div>
          <div style="font-size:14px;opacity:0.95;margin-top:8px;">Generated ${escapeHtml(generatedAt)}</div>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${greetingName ? `Hi ${introName}` : "Hi,"} here is your calculator summary from Foster Wealth Ventures.</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:20px;margin:20px 0;">
            <div style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;margin-bottom:12px;">Key results summary</div>
            ${summaryHtml}
          </div>
          <div style="text-align:center;margin:24px 0;">
            <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:#10b981;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:14px;font-size:14px;">${escapeHtml(input.ctaLabel)}</a>
          </div>
          <div style="font-size:13px;line-height:1.7;color:#475569;background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;padding:16px;">
            ${escapeHtml(input.disclaimer)}
          </div>
        </div>
        <div style="padding:18px 28px 28px;color:#64748b;font-size:12px;line-height:1.6;border-top:1px solid #e2e8f0;">
          Foster Wealth Ventures
        </div>
      </div>
    </div>
  </div>`;

  const text = [
    "Foster Wealth Ventures",
    `${input.calculatorName} results`,
    `Generated ${generatedAt}`,
    greetingName ? `Hi ${greetingName},` : "Hi,",
    "",
    input.summaryText,
    "",
    `${input.ctaLabel}: ${ctaUrl}`,
    "",
    input.disclaimer,
    "",
    "Foster Wealth Ventures",
  ].join("\n");

  return { subject, html, text };
}