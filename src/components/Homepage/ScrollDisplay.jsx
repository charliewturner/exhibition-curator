import DisplayItem from "./DisplayItem";

function ScrollDisplay(){
  //Replace individual render of DisplayItem with a looped render
  return (
    <>
      <div id="scroll-container">
        <DisplayItem></DisplayItem>
      </div>
    </>
  );
}

export default ScrollDisplay;
