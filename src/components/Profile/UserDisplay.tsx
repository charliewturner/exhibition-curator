import PFP from "./PFP";
import Username from "./Username";
import UserInfo from "./UserInfo";

function UserDisplay(): React.JSX.Element {
  return (
    <>
      <div id="user-container">
        <PFP></PFP>
        <Username></Username>
        <UserInfo></UserInfo>
      </div>
    </>
  );
}

export default UserDisplay;
