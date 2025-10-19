import { useNavigate } from "react-router-dom";
import { useCollection } from "../collection/CollectionContext";
import Search from "./Search";

export default function Header({ onSearchSubmit }) {
  const nav = useNavigate();
  const { count } = useCollection();

  return (
    <header id="header-container" style={{ gap: 12 }}>
      {/* Pass the handler as BOTH names to be safe */}
      <Search onSearchSubmit={onSearchSubmit} onSubmit={onSearchSubmit} />

      <button
        onClick={() => nav("/collection")}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        My Collection ({count})
      </button>
    </header>
  );
}
