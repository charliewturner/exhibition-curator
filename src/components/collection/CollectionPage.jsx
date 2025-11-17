import Header from "../Homepage/Header";
import ArtworkModal from "../Homepage/ArtworkModal";
import { useCollection } from "./CollectionContext";

const MAX_WORDS = 12;
function truncateWords(str = "", maxWords = MAX_WORDS) {
  const words = String(str).trim().split(/\s+/);
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(" ") + "…";
}

export default function CollectionPage({
  onOpenItem,
  selectedItem,
  onCloseItem,
}) {
  const { items, isSaved, toggle } = useCollection();

  return (
    <div id="homepage-container">
      {/* keep header so user can search from here too */}
      <Header onSearchSubmit={() => {}} />

      <section
        style={{
          padding: "0 16px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            margin: "16px 0",
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
          }}
          aria-label="Return to homepage"
        >
          Return to Homepage
        </button>
      </section>

      <section style={{ padding: 16, maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "left", margin: "8px 0 12px" }}>
          My Collection
        </h2>

        {items.length === 0 ? (
          <p style={{ color: "#6b7280" }}>
            Your collection is empty. Save works from search results or the
            carousel.
          </p>
        ) : (
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
            {items.map((it) => {
              const saved = isSaved(it);
              return (
                <li
                  key={`${it.source}:${it.id}`}
                  onClick={() => onOpenItem?.(it)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={it.imageUrl}
                    alt={it.title}
                    style={{
                      width: "100%",
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
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
                  <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>
                    {it.source.toUpperCase()}
                  </div>
                  <div style={{ marginTop: 8 }}>
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
