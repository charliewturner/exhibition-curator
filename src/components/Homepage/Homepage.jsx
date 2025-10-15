import Header from "./Header";
import Body from "./Body";

function Homepage(): React.JSX.Element {
  return (
    <>
      <div id="homepage-container">
        <Header></Header>
        <Body></Body>
      </div>
    </>
  );
}

export default Homepage;
