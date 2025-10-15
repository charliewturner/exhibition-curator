import Filters from "./Filters";
import SearchInput from "./SearchInput";
import Sort from "./Sort";
import Submit from "./Submit";

function Search() {
  return (
    <>
      <Filters></Filters>
      <Sort></Sort>
      <SearchInput></SearchInput>
      <Submit></Submit>
    </>
  );
}

export default Search;
