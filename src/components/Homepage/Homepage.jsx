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
}) {
  const { isSaved, toggle } = useCollection();

  return (
    <div id="homepage-container">
      <Header onSearchSubmit={onSearchSubmit} />
      <Body status={status} heroItems={heroItems} onOpenItem={onOpenItem} />

      <section style={{ padding: 16, maxWidth: "1100px", margin: "0 auto" }}>
        {status === "loading" && <div>Searching…</div>}
        {status === "error" && <div>Something went wrong.</div>}
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
                  style={{
                    cursor: "pointer",
                    display: "flex", // ⬅️ make the card a column
                    flexDirection: "column",
                  }}
                >
                  <img
                    src={it.imageUrl}
                    alt={it.title}
                    style={{
                      width: "90vw",
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />

                  {/* Wrap the text in a flex-1 block so it takes leftover space */}
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

                  {/* Button pinned to bottom */}
                  <div style={{ marginTop: "auto", paddingTop: 8 }}>
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
                        width: "100%", // optional: make all buttons same width
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
