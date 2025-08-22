'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TAGLINE = 'Search the XYPHER way';

export default function HomePage() {
  const [theme, setTheme] = useState('dark');
  const router = useRouter();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [featured, setFeatured] = useState(null);
  const [news, setNews] = useState([]);
  const [onThisDay, setOnThisDay] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Apply theme class to <html>
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'hacker');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Fetch featured content on mount
  useEffect(() => {
    async function fetchFeatured() {
      setFeaturedLoading(true);
      setFeaturedError('');
      try {
        const res = await fetch('/api/featured');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setFeatured(data.tfa || null);
        setNews(data.news || []);
        setOnThisDay(data.onthisday || []);
      } catch (err) {
        setFeaturedError('Could not load featured content.');
      } finally {
        setFeaturedLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResults(data.items || []);
    } catch (err) {
      setError('Search failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  const showFeatured = results.length === 0 && !loading && !error;

  // Handler for heading click
  function handleHeadingClick(e) {
    e.preventDefault();
    setQ('');
    setResults([]);
    setError('');
    router.push('/');
  }

  return (
    <main className="container-padded py-10">
      <header className="mb-10">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow">
              <span className="font-black text-xl">X</span>
            </div>
            <a
              href="/"
              onClick={handleHeadingClick}
              className="text-2xl sm:text-3xl font-semibold tracking-tight hover:underline cursor-pointer"
              aria-label="Go to home page"
            >
              XYPHER
            </a>
          </div>
          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Switch to dark theme"
              className={`text-xl px-2 py-1 rounded ${theme === 'dark' ? 'bg-brand-600 text-white' : 'text-neutral-400'}`}
              onClick={() => setTheme('dark')}
              type="button"
            >
              <i className="fa-solid fa-moon" id="dark-icon" data-value="1"></i>
            </button>
            <button
              aria-label="Switch to hacker theme"
              className={`text-xl px-2 py-1 rounded ${theme === 'hacker' ? 'bg-brand-600 text-white' : 'text-neutral-400'}`}
              onClick={() => setTheme('hacker')}
              type="button"
            >
              <i className="fa-solid fa-hat-cowboy" id="hacker-icon" data-value="2"></i>
            </button>
          </div>
        </div>
        <p className="text-neutral-400 mt-2">{TAGLINE}</p>
      </header>

      <form onSubmit={onSubmit} className="card p-4 sm:p-6 sticky top-4 z-10 mb-8">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for anything…"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-base placeholder:text-neutral-500"
            aria-label="Search query"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 font-medium"
          >
            {loading ? 'Searching…' : '🔍'}
          </button>
        </div>
      </form>

      {/* Featured, News, On This Day Section */}
      {showFeatured && (
        <section className="mb-8 grid gap-6">
          {/* Featured Article */}
          {featuredLoading ? (
            <div className="card p-4 sm:p-6 animate-pulse text-neutral-400">Loading featured article…</div>
          ) : featuredError ? (
            <div className="card p-4 sm:p-6 text-red-400">{featuredError}</div>
          ) : featured ? (
            <article className="card p-4 sm:p-6 flex gap-4 items-start">
              {featured.thumbnail && (
                <img
                  src={featured.thumbnail.source}
                  alt="featured thumbnail"
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0 border border-neutral-800"
                  loading="lazy"
                />
              )}
              <div className="min-w-0">
                <h2 className="text-xl font-bold neon leading-tight mb-1">
                  <Link
                    target="_blank"
                    className="hover:underline"
                    href={featured.content_urls?.desktop?.page || '#'}
                  >
                    {featured.displaytitle?.replace(/<[^>]+>/g, '')}
                  </Link>
                </h2>
                {featured.extract && (
                  <p className="mt-1 text-neutral-300 text-sm line-clamp-4">{featured.extract}</p>
                )}
                <div className="mt-2 text-xs text-neutral-500">
                  <span>Featured Wikipedia Article</span>
                </div>
              </div>
            </article>
          ) : null}

          {/* On This Day */}
          {onThisDay.length > 0 && (
            <section className="card p-4 sm:p-6">
              <h2 className="text-lg font-bold neon mb-2">On This Day</h2>
              <ul className="list-disc pl-5 space-y-2">
                {onThisDay.map((item, idx) => (
                  <li key={idx}>
                    <span className="text-neutral-200 font-semibold">{item.text}</span>
                    {item.pages && item.pages.length > 0 && (
                      <span className="ml-2 text-neutral-400 text-xs">
                        {item.pages.map((p) => (
                          <a
                            key={p.pageid}
                            href={p.content_urls?.desktop?.page || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {p.displaytitle?.replace(/<[^>]+>/g, '')},&nbsp;
                          </a>
                        ))}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      )}

      {error && <div className="mt-6 text-sm text-red-400">{error}</div>}

      <section className="mt-8 grid gap-4">
        {results.map((r) => (
          <article key={r.pageid} className="card p-4 sm:p-6 flex gap-4">
            {r.thumbnail && (
              <img
                src={r.thumbnail}
                alt="thumbnail"
                className="w-24 h-24 rounded-lg object-cover flex-shrink-0 border border-neutral-800"
                loading="lazy"
              />
            )}
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-tight">
                <Link
                  target="_blank"
                  className="hover:underline"
                  href={`https://en.wikipedia.org/?curid=${r.pageid}`}
                >
                  {r.title}
                </Link>
              </h3>
              {r.extract && (
                <p className="mt-1 text-neutral-300 text-sm line-clamp-3">{r.extract}</p>
              )}
              <div className="mt-2 text-xs text-neutral-500">
                <span>from Wikipedia • {r.wordcount ?? 0} words</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <footer className="mt-12 text-xs text-neutral-500">
        <p>
          Powered by the{' '}
          <a
            className="underline"
            href="https://www.mediawiki.org"
            target="_blank"
            rel="noreferrer"
          >
            Wikimedia.Org
          </a>
          . XYPHER is an independent project.
        </p>
      </footer>
    </main>
  );
}
