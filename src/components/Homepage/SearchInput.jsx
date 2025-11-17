export default function SearchInput({ value, onChange }) {
  return (
    <div style={{ position: "relative" }}>
      <label htmlFor="search-input" style={visuallyHidden}>
        Search artworks
      </label>
      <input
        id="search-input"
        style={{ borderRadius: 10, maxWidth: "600px" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search artworks…"
      />
    </div>
  );
}

const visuallyHidden = {
  position: "absolute",
  left: "-9999px",
  width: "1px",
  height: "1px",
  overflow: "hidden",
};
