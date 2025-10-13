import UserDisplay from "./UserDisplay";
import Collections from "./Collections";

function Profile(): React.JSX.Element {
  return (
    <>
      <div id="profile-container">
        <UserDisplay></UserDisplay>
        <Collections></Collections>
      </div>
    </>
  );
}

export default Profile;
