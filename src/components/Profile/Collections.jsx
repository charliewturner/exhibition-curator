import Header from "./Header";
import Collection from "./Collection";
import type { CollectionItem } from "./CollectionList";

// TEMP placeholder data so you can see the scroll immediately
const makeItems = (seed: number, n = 12): CollectionItem[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `${seed}-${i}`,
    src: `https://picsum.photos/seed/${seed}-${i}/320/240`,
    alt: `Item ${i + 1}`,
    label: `Item ${i + 1}`,
  }));

const collectionsData = [
  { id: 1, name: "Collection #1", items: makeItems(1) },
  { id: 2, name: "Collection #2", items: makeItems(2) },
  { id: 3, name: "Collection #3", items: makeItems(3) },
];

function Collections(): React.JSX.Element {
  return (
    <div id="collections-container" className="collections">
      <Header />

      <div className="collections-grid">
        {collectionsData.map((c) => (
          <Collection
            key={c.id}
            id={c.id}
            name={c.name}
            items={c.items}
            onOpen={(id) => {
              // hook this to your router or modal later
              console.log("open collection", id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Collections;
