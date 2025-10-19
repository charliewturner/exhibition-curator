export default function SearchInput({ value, onChange }) {
  return (
    <input
      id="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search artworks…"
    />
  );
}
