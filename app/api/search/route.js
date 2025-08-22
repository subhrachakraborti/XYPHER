import { NextResponse } from 'next/server';

export const runtime = 'edge';
// Proper helper function (wraps return in a function)
function pagesObjectToArray(pages) {
  if (!pages) return [];
  return Object.values(pages)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((p) => ({
      pageid: p.pageid,
      title: p.title,
      extract: p.extract || '',
      thumbnail: p.thumbnail?.source || null,
      wordcount: p.wordcount || undefined,
    }));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  if (!q) {
    return NextResponse.json({ items: [] });
  }

  const userAgent =
    process.env.WIKIMEDIA_USER_AGENT ||
    'XypherSearch/1.0 (contact: you@example.com)';

  const endpoint = new URL('https://en.wikipedia.org/w/api.php');
  const params = {
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: q,
    gsrlimit: '20',
    prop: 'pageimages|extracts|info',
    inprop: 'url',
    exintro: '1',
    explaintext: '1',
    piprop: 'thumbnail|name',
    pithumbsize: '240',
    origin: '*',
  };
  Object.entries(params).forEach(([k, v]) =>
    endpoint.searchParams.set(k, v)
  );

  try {
    const res = await fetch(endpoint.toString(), {
      headers: {
        Accept: 'application/json',
        'User-Agent': userAgent,
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { items: [], error: `Upstream error: ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const items = pagesObjectToArray(data?.query?.pages);
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json(
      { items: [], error: 'Fetch failed' },
      { status: 500 }
    );
  }
}
