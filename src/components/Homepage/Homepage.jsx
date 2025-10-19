import Header from "./Header";
import Body from "./Body";

export default function Homepage({
  status = "loading",
  heroItems = [],
  results = [],
  onSearchSubmit,
}) {
  return (
    <div id="homepage-container">
      <Header onSearchSubmit={onSearchSubmit} />
      <Body status={status} heroItems={heroItems} />
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
              <li key={`${it.source}:${it.id}`}>
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
                <div style={{ fontWeight: 600, marginTop: 6, fontSize: 14 }}>
                  {it.title}
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
    </div>
  );
}
