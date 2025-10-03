import CollectionList from "./CollectionList";
import CollectionHeader from "./CollectionHeader";

function Collection(): React.JSX.Element {
  return (
    <>
      <div>Collection</div>
      <CollectionList></CollectionList>
      <CollectionHeader></CollectionHeader>
    </>
  );
}

export default Collection;
