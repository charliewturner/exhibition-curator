import Header from "./Header";
import Body from "./Body";
import ArtworkModal from "./ArtworkModal";

// helper: truncate to N words (keeps original string intact elsewhere)
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
  return (
    <div id="homepage-container">
      <Header onSearchSubmit={onSearchSubmit} />
      <Body status={status} heroItems={heroItems} onOpenItem={onOpenItem} />

      {/* Simple results readout (replace with your own list later) */}
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
            {results.map((it) => (
              <li
                key={`${it.source}:${it.id}`}
                onClick={() => onOpenItem?.(it)}
                style={{ cursor: "pointer" }}
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
                <div
                  style={{ fontWeight: 600, marginTop: 6, fontSize: 14 }}
                  title={it.title} // hover shows full title
                >
                  {truncateWords(it.title, MAX_WORDS)}
                </div>
                <div style={{ color: "#6b7280", fontSize: 12 }}>
                  {it.maker}
                  {it.maker && it.date ? " · " : ""}
                  {it.date}
                </div>
                <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>
                  {it.source.toUpperCase()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ArtworkModal item={selectedItem} onClose={onCloseItem} />
    </div>
  );
}
