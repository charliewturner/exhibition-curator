
import CollectionListItem from "./CollectionListItem";

export default function CollectionList({ items = [] }) {
  return (
    <div className="collection-rail" role="list">
      {items.map((it) => (
        <div key={it.id} role="listitem">
          <CollectionListItem src={it.src} alt={it.alt} label={it.label} />
        </div>
      ))}
    </div>
  );
}