import { NextResponse } from 'next/server';

export const runtime = 'edge';
export async function GET() {
  const endpoint =
    'https://en.wikipedia.org/api/rest_v1/feed/featured/2025/08/22'; 
  // YYYY/MM/DD (today's date). You can generate dynamically if needed.

  try {
    const res = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 }, // cache 1h
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    // Wikipedia REST returns featured articles in `tfa`, news, and onthisday
    return NextResponse.json({
      tfa: data?.tfa,
      news: data?.news,
      onthisday: data?.onthisday
    });
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
