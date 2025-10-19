import { useEffect, useMemo, useState, useCallback } from "react";

export default function HeroCarousel({ items = [], autoplayMs = 4000 }) {
  const safeItems = useMemo(() => items.filter((i) => i?.imageUrl), [items]);
  const [idx, setIdx] = useState(0);

  const count = safeItems.length;
  const current = count ? safeItems[idx % count] : null;
  const prev = count ? safeItems[(idx - 1 + count) % count] : null;
  const next = count ? safeItems[(idx + 1) % count] : null;

  const goNext = useCallback(
    () => setIdx((n) => (count ? (n + 1) % count : 0)),
    [count]
  );
  const goPrev = useCallback(
    () => setIdx((n) => (count ? (n - 1 + count) % count : 0)),
    [count]
  );

  useEffect(() => {
    if (!count) return;
    const t = setInterval(goNext, autoplayMs);
    return () => clearInterval(t);
  }, [count, goNext, autoplayMs]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  if (!count) return null;

  return (
    <section className="hero">
      <div className="hero-track">
        <button
          className="hero-nav hero-nav--left"
          onClick={goPrev}
          aria-label="Previous"
        >
          &#10094;
        </button>

        {prev && (
          <figure className="hero-slide hero-slide--side" aria-hidden="true">
            <img src={prev.imageUrl} alt={prev.title || "Previous artwork"} />
          </figure>
        )}

        {current && (
          <figure className="hero-slide hero-slide--center">
            <img src={current.imageUrl} alt={current.title || "Artwork"} />
            <figcaption className="hero-info">
              <div className="hero-title">{current.title || "(untitled)"}</div>
              {(current.maker || current.date) && (
                <div className="hero-meta">
                  {current.maker && <span>{current.maker}</span>}
                  {current.maker && current.date && <span> · </span>}
                  {current.date && <span>{current.date}</span>}
                </div>
              )}
            </figcaption>
          </figure>
        )}

        {next && (
          <figure className="hero-slide hero-slide--side" aria-hidden="true">
            <img src={next.imageUrl} alt={next.title || "Next artwork"} />
          </figure>
        )}

        <button
          className="hero-nav hero-nav--right"
          onClick={goNext}
          aria-label="Next"
        >
          &#10095;
        </button>
      </div>

      <div
        className="hero-dots"
        role="tablist"
        aria-label="carousel pagination"
      >
        {safeItems.slice(0, 12).map((_, i) => {
          const active = i === idx % Math.min(12, safeItems.length);
          return (
            <button
              key={i}
              className={"hero-dot" + (active ? " is-active" : "")}
              aria-selected={active}
              onClick={() => setIdx(i)}
              aria-label={`Go to item ${i + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
}
