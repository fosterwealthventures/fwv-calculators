// components/ContactForm.tsx
"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Message sent ✅ (demo)");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        name="name"
        required
        placeholder="Your Name"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <input
        type="email"
        name="email"
        required
        placeholder="Your Email"
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <textarea
        name="message"
        required
        placeholder="Your Message"
        className="p-2 border rounded min-h-[120px] focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded"
      >
        Send Message
      </button>
      {status && <p className="text-sm text-emerald-600 mt-2">{status}</p>}
    </form>
  );
}
