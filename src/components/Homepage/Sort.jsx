export default function Sort({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <label style={{ fontSize: 12, color: "#6b7280" }}>Sort</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "9px 10px",
          height: "100%",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
        }}
      >
        <option value="title_asc">Title A–Z</option>
        <option value="title_desc">Title Z–A</option>
        <option value="date_asc">Date ↑</option>
        <option value="date_desc">Date ↓</option>
      </select>
    </div>
  );
}
