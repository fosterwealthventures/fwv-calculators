// app/api/blog/generator/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';           // avoid edge quirks
export const dynamic = 'force-dynamic';    // no accidental caching

function cors(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-automation-secret');
  return res;
}

function isLocal(req: NextRequest) {
  const host = req.headers.get('host') || '';
  return host.startsWith('localhost') || host.startsWith('127.0.0.1');
}

const REQUIRED_SECRET = (process.env.BLOG_AUTOMATION_SECRET || '').trim();

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function GET() {
  return cors(NextResponse.json({ ok: true, route: '/api/blog/generator' }));
}

export async function POST(req: NextRequest) {
  // Require secret outside localhost (keeps prod protected)
  if (!isLocal(req) && REQUIRED_SECRET) {
    const provided = (req.headers.get('x-automation-secret') || '').trim();
    if (provided.length !== REQUIRED_SECRET.length || provided !== REQUIRED_SECRET) {
      return cors(NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 }));
    }
  }

  try {
    const { topic, dryRun } = await req.json();
    if (!topic || typeof topic !== 'string') {
      return cors(NextResponse.json({ ok: false, error: 'Missing "topic"' }, { status: 400 }));
    }

    // TODO: plug in your enrich/validators/brand flow here
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
    const markdown =
`---
title: "${topic}"
date: "${new Date().toISOString()}"
excerpt: "Preview for ${topic}."
---

# ${topic}

This is a preview post generated locally.`;

    return cors(NextResponse.json({
      ok: true,
      saved: !dryRun,
      slug,
      title: topic,
      excerpt: `Preview for ${topic}.`,
      markdown,
    }));
  } catch (e: any) {
    return cors(NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 }));
  }
}
