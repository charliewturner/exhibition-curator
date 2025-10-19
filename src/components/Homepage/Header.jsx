import Search from "./Search";
import ProfileDropdown from "./ProfileDropdown";

export default function Header({ onSearchSubmit }) {
  return (
    <header id="header-container">
      {/* put your logo / profile etc here too */}
      <Search onSubmit={onSearchSubmit} />
    </header>
  );
}
