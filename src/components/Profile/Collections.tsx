import Header from "./Header";
import Collection from "./Collection";

function Collections(): React.JSX.Element {
  // render each collection conditionally

  const placeholderArray = Array.from({ length: 3 });

  return (
    <>
      <div id="collections-container">
        collections container
        <Header></Header>
        {placeholderArray.map((_, idx) => (
          <div>
            <small style={{ opacity: 0.6 }}>Collection #{idx + 1}</small>
            <Collection key={idx} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Collections;
