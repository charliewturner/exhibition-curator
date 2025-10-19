import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = "myCollectionV1";
const Ctx = createContext(null);

export function CollectionProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setItems(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const makeKey = (it) => `${it.source}:${it.id}`;
  const value = useMemo(() => {
    const isSaved = (it) => items.some((p) => makeKey(p) === makeKey(it));
    const add = (it) =>
      setItems((prev) =>
        prev.some((p) => makeKey(p) === makeKey(it)) ? prev : [...prev, it]
      );
    const remove = (it) =>
      setItems((prev) => prev.filter((p) => makeKey(p) !== makeKey(it)));
    const toggle = (it) => (isSaved(it) ? remove(it) : add(it));
    return { items, add, remove, toggle, isSaved, count: items.length };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCollection() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useCollection must be used within CollectionProvider");
  return ctx;
}
