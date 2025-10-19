import Header from "./Header";
import Body from "./Body";

function Homepage({ status, heroItems }) {
  return (
    <>
      <div id="homepage-container">
        <Header></Header>
        <Body status={status} heroItems={heroItems}></Body>
      </div>
    </>
  );
}

export default Homepage;
