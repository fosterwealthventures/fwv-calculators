// Legacy auth configuration retained only so older imports do not break during migration.
// The refocused calculator site no longer creates Stripe customers or gates calculators by plan.

import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import nodemailer from "nodemailer";
import { enforceMagicLinkRateLimit } from "./email-rate-limit";

const emailProvider = EmailProvider({
  server: {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT ? parseInt(process.env.EMAIL_SERVER_PORT, 10) : 587,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  },
  from: process.env.EMAIL_FROM,
  async sendVerificationRequest({ identifier, url, provider }) {
    await enforceMagicLinkRateLimit({ email: identifier });
    const { host } = new URL(url);
    const transport = nodemailer.createTransport(provider.server);
    await transport.sendMail({
      to: identifier,
      from: provider.from,
      subject: `Sign in to ${host}`,
      text: textMagicLink({ url, host }),
      html: htmlMagicLink({ url, host }),
    });
  },
});

export const authOptions: NextAuthOptions = {
  providers: [emailProvider],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub;
        (session.user as any).plan = "free";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = (user as any).id;
      token.plan = "free";
      return token;
    },
  },
};

function textMagicLink({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\nThis link expires in 10 minutes.\nIf you did not request it, you can ignore this email.`;
}

function htmlMagicLink({ url, host }: { url: string; host: string }) {
  const escapedHost = host.replace(/\./g, "&#8203;.");
  return `
  <body style="background: #f5f5f5; padding: 32px; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <table cellpadding="0" cellspacing="0" style="max-width: 480px; width: 100%; background: #ffffff; border-radius: 12px; padding: 32px;">
        <tr><td>
          <h1 style="margin: 0; font-size: 20px; color: #111827;">Sign in to ${escapedHost}</h1>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">Tap the secure button below to continue. The link expires in 10 minutes.</p>
          <div style="margin: 24px 0;"><a href="${url}" style="display: inline-block; background: #047857; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600;">Sign in</a></div>
          <p style="color: #6b7280; font-size: 12px; line-height: 1.4;">If you did not request this email, you can safely ignore it.</p>
        </td></tr>
      </table>
    </td></tr></table>
  </body>`;
}
