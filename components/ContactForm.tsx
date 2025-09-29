// components/ContactForm.tsx
"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      // Replace with your own endpoint or Formspree form ID
      const res = await fetch("https://formspree.io/f/your-form-id", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Your Email Address</span>
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-green"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Your Message</span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="How can we help?"
          className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-green"
        />
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand-green px-4 py-2 font-semibold text-white hover:opacity-90"
      >
        Send Message
      </button>

      {status === "success" && <p className="text-green-600">✅ Message sent successfully!</p>}
      {status === "error" && <p className="text-red-600">❌ Something went wrong. Please try again.</p>}
    </form>
  );
}
