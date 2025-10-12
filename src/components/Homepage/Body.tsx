import ScrollDisplay from "./ScrollDisplay";
import FocusInfo from "./FocusInfo";

function Body(): React.JSX.Element {
  return (
    <>
      <div id="homepage-body">
        <ScrollDisplay></ScrollDisplay>
        <FocusInfo></FocusInfo>
      </div>
    </>
  );
}

export default Body;
