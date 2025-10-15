import CollectionList, { type CollectionItem } from "./CollectionList";
import CollectionHeader from "./CollectionHeader";

type Props = {
  id: number | string;
  name: string;
  items: CollectionItem[];
  onOpen?: (id: number | string) => void;
};

function Collection({ id, name, items, onOpen }: Props): React.JSX.Element {
  return (
    <section id="collection-item" className="collection-card" aria-label={name}>
      <CollectionHeader onClick={() => onOpen?.(id)}>{name}</CollectionHeader>

      <div className="collection-card__body">
        <CollectionList items={items} />
      </div>
    </section>
  );
}

export default Collection;
