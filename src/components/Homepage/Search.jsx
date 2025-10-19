import { useState } from "react";
import SearchInput from "./SearchInput";
import Filters from "./Filters";
import Sort from "./Sort";
import Submit from "./Submit";

export default function Search({ onSearchSubmit, onSubmit }) {
  const [q, setQ] = useState("");
  const [source, setSource] = useState("both"); // 'met' | 'vam' | 'both'
  const [sort, setSort] = useState("title_asc");

  // Accept either prop name
  const submitHandler = onSearchSubmit || onSubmit;

  function handleSubmit(e) {
    e.preventDefault(); // 🔴 prevents a full page reload
    if (typeof submitHandler === "function") {
      submitHandler({ q, source, sort });
    } else {
      console.warn("No onSearchSubmit handler provided");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <SearchInput value={q} onChange={setQ} />
      <Filters value={source} onChange={setSource} />
      <Sort value={sort} onChange={setSort} />
      <Submit />
    </form>
  );
}
