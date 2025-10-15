import CollectionListItem from "./CollectionListItem";

export type CollectionItem = {
  id: string;
  src: string;
  alt?: string;
  label?: string;
};

function CollectionList({
  items,
}: {
  items: CollectionItem[];
}): React.JSX.Element {
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

export default CollectionList;
