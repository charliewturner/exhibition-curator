export default function Filters({ source, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <label style={{ fontSize: 12, color: "#6b7280" }}>Source</label>
      <select
        value={source}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "9px 10px",
          borderRadius: 10,
          height: "100%",
          border: "1px solid #e5e7eb",
        }}
      >
        <option value="both">Both</option>
        <option value="met">The Met</option>
        <option value="vam">V&A</option>
      </select>
    </div>
  );
}
