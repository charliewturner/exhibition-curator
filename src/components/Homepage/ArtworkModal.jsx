import { useEffect, useRef } from "react";

export default function ArtworkModal({ item, onClose }) {
  const closeRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus the close button when opening (basic focus mgmt)
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  if (!item) return null;

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Artwork details"
    >
      <button
        className="overlay__backdrop"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="overlay__panel">
        <div className="overlay__bar">
          <h2 style={{ margin: 0 }}>{item.title || "(untitled)"}</h2>
          <button
            ref={closeRef}
            className="btn btn--ghost"
            onClick={onClose}
            aria-label="Close details"
          >
            ✕
          </button>
        </div>
        <div className="overlay__body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "min(420px, 40vw) 1fr",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 8,
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.title || "Artwork image"}
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
            <div style={{ alignSelf: "start" }}>
              <p style={{ margin: "4px 0 8px", color: "#6b7280" }}>
                <strong>{item.maker || "Unknown maker"}</strong>
                {item.date ? ` · ${item.date}` : ""}
              </p>

              {/* Room for extra fields if you have them later */}
              {item.source && (
                <p style={{ marginTop: 8, color: "#94a3b8", fontSize: 12 }}>
                  Source: {item.source.toUpperCase()}
                </p>
              )}

              {/* Example: link out if you store objectURL later */}
              {item.objectURL && (
                <p style={{ marginTop: 12 }}>
                  <a href={item.objectURL} target="_blank" rel="noreferrer">
                    View on source site ↗
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
