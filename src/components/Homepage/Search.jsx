import Filters from "./Filters";
import SearchInput from "./SearchInput";
import Sort from "./Sort";
import Submit from "./Submit";
import { useState } from "react";

export default function Search({ onSubmit }) {
  const [q, setQ] = useState("");
  const [source, setSource] = useState("both"); // 'met' | 'vam' | 'both'
  const [sort, setSort] = useState("title_asc"); // 'title_asc' | 'title_desc' | 'date_asc' | 'date_desc'

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.({ q, source, sort });
  }

  return (
    <form id="search-input" onSubmit={handleSubmit} style={{ gap: 8 }}>
      <SearchInput value={q} onChange={setQ} />
      <Filters source={source} onChange={setSource} />
      <Sort value={sort} onChange={setSort} />
      <Submit />
    </form>
  );
}
