import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/blog';

export const runtime = 'nodejs';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function OGImage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = getPostBySlug(slug);
  const title = post?.meta?.title || 'Foster Wealth Calculators';
  const subtitle = post?.meta?.category || 'Blog';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #2b1a3d 0%, #3b2a55 100%)',
          padding: 48,
          color: '#F3E8FF',
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.85 }}>Foster Wealth Ventures • {subtitle}</div>
        <div style={{ fontSize: 64, lineHeight: 1.2, fontWeight: 800 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: 0.9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#d4af37' }} />
          <div style={{ fontSize: 24 }}>fosterwealthventures.store</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

