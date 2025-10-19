import { useEffect, useRef } from "react";

export default function ArtworkModal({ item, onClose }) {
  const closeRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus the close button when opening
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
      {/* backdrop click closes */}
      <button
        className="overlay__backdrop"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="overlay__panel" onClick={(e) => e.stopPropagation()}>
        <div className="overlay__bar">
          <h2>{item.title || "(untitled)"}</h2>
          <button
            ref={closeRef}
            className="btn btn--ghost"
            onClick={onClose}
            aria-label="Close"
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
            <div>
              <p style={{ margin: "4px 0 8px", color: "#6b7280" }}>
                <strong>{item.maker || "Unknown maker"}</strong>
                {item.date ? ` · ${item.date}` : ""}
              </p>
              {item.source && (
                <p style={{ marginTop: 8, color: "#94a3b8", fontSize: 12 }}>
                  Source: {item.source.toUpperCase()}
                </p>
              )}
              {/* Extra metadata */}
              <div style={{ display: "grid", gap: 6, fontSize: 14 }}>
                {item.culture && (
                  <p>
                    <strong>Culture:</strong> {item.culture}
                  </p>
                )}
                {item.dimensions && (
                  <p>
                    <strong>Dimensions:</strong> {item.dimensions}
                  </p>
                )}
                {item.department && (
                  <p>
                    <strong>Department:</strong> {item.department}
                  </p>
                )}
                {item.classification && (
                  <p>
                    <strong>Classification:</strong> {item.classification}
                  </p>
                )}
                {item.creditLine && (
                  <p>
                    <strong>Credit:</strong> {item.creditLine}
                  </p>
                )}
              </div>
              {item.objectURL && (
                <p style={{ marginTop: 12 }}>
                  <a href={item.objectURL} target="_blank" rel="noreferrer">
                    View source ↗
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
