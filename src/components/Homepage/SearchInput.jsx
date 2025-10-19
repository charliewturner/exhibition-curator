export default function SearchInput({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search artworks…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        flex: 1,
        minWidth: 220,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        outline: "none",
      }}
    />
  );
}
