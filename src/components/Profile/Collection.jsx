import CollectionList, {CollectionItem } from "./CollectionList";
import CollectionHeader from "./CollectionHeader";



function Collection({ id, name, items, onOpen }) {
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
