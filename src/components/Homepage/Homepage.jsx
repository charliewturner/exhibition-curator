import Header from "./Header";
import Body from "./Body";
import ArtworkModal from "./ArtworkModal";
import { useCollection } from "../collection/CollectionContext";

const MAX_WORDS = 8;
function truncateWords(str = "", maxWords = MAX_WORDS) {
  const words = String(str).trim().split(/\s+/);
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(" ") + "…";
}

export default function Homepage({
  status = "loading",
  heroItems = [],
  results = [],
  onSearchSubmit,
  onOpenItem,
  selectedItem,
  onCloseItem,
  hasSearched,
}) {
  const { isSaved, toggle } = useCollection();

  return (
    <div id="homepage-container">
      <Header onSearchSubmit={onSearchSubmit} />

      <Body heroItems={heroItems} onOpenItem={onOpenItem} />
      <section
        style={{
          padding: 16,
          maxWidth: "1100px",
          margin: "0 auto",
          width: "90vw",
        }}
      >
        {status === "loading" && <div>Searching…</div>}
        {status === "error" && <div>Something went wrong.</div>}
        {hasSearched && status === "success" && results?.length === 0 && (
          <div style={{ color: "#6b7280", marginTop: 12 }}>
            No artworks found. Please try a different search term.
          </div>
        )}
        {status === "success" && results?.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "12px 0",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            {results.map((it) => {
              const saved = isSaved(it);
              return (
                <li
                  key={`${it.source}:${it.id}`}
                  onClick={() => onOpenItem?.(it)}
                  className="result-card" // ← add class
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={it.imageUrl}
                    alt={it.title}
                    style={{
                      width: "100%", // keep card width consistent
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{ fontWeight: 600, marginTop: 6, fontSize: 14 }}
                      title={it.title}
                    >
                      {truncateWords(it.title, MAX_WORDS)}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>
                      {it.maker}
                      {it.maker && it.date ? " · " : ""}
                      {it.date}
                    </div>
                    <div
                      style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}
                    >
                      {it.source.toUpperCase()}
                    </div>
                  </div>

                  {/* Button pinned to bottom with extra bottom gap */}
                  <div className="result-card__actions">
                    {" "}
                    {/* ← add class */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(it);
                      }}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                        background: saved ? "#0ea5e9" : "#fff",
                        color: saved ? "#fff" : "#111827",
                        cursor: "pointer",
                        fontWeight: 600,
                        width: "100%",
                      }}
                      aria-label={
                        saved ? "Remove from collection" : "Add to collection"
                      }
                    >
                      {saved ? "Remove" : "Save"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <ArtworkModal item={selectedItem} onClose={onCloseItem} />
    </div>
  );
}
