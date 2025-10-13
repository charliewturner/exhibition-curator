import CollectionList from "./CollectionList";
import CollectionHeader from "./CollectionHeader";

function Collection(): React.JSX.Element {
  return (
    <>
      <div id="collection-item">
        collection item
        <CollectionHeader></CollectionHeader>
        <CollectionList></CollectionList>
      </div>
    </>
  );
}

export default Collection;
