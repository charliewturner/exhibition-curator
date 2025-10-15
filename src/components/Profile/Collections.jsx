
import Header from "./Header";
import Collection from "./Collection";

// TEMP placeholder data 
const makeItems = (seed, n = 12) =>
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

export default function Collections() {
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
              
              console.log("open collection", id);
            }}
          />
        ))}
      </div>
    </div>
  );
}