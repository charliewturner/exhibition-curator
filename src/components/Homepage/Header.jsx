import Search from "./Search";
import ProfileDropdown from "./ProfileDropdown";

function Header() {
  return (
    <>
      <div id="header-container">
        <Search></Search>
        <ProfileDropdown></ProfileDropdown>
      </div>
    </>
  );
}

export default Header;
