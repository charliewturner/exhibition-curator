export default function SearchInput({ value, onChange }) {
  return (
    <input
      id="search-input"
      style={{ borderRadius: 10, maxWidth: "600px" }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search artworks…"
    />
  );
}
