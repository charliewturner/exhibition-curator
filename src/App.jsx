import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import CollectionPage from "./components/collection/CollectionPage";
import getAPI from "./components/getApi";
import { CollectionProvider } from "./components/collection/CollectionContext";

const MET = "https://collectionapi.metmuseum.org/public/collection/v1";
const VAM = "https://api.vam.ac.uk/v2";
async function fetchVamDetail(systemNumber, signal) {
  const d = await getAPI(`${VAM}/museumobject/${systemNumber}`, { signal });

  const rec = d?.record || {};
  const meta = d?.meta || {};

  const dims = Array.isArray(rec.dimensions)
    ? rec.dimensions
        .map((x) => [x.dimension, x.value, x.unit].filter(Boolean).join(" "))
        .join("; ")
    : rec.dimensions || "";

  const collectionHref =
    meta?._links.collection_page?.href || rec?._links?.self?.href || null;

  // console.log("V&A detail (raw):", d);
  // console.log("collection page:", d?.meta?._links.collection_page?.href);
  // console.log("dimensions raw:", d?.record?.dimensions);

  return {
    dimensions: dims,
    objectURL: collectionHref,
    culture: rec.culture || "",
    department: rec.museumLocation || "",
    classification: rec.objectType || "",
    creditLine: rec.creditLine || "",

    raw: d,
  };
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function mapMet(o) {
  if (!o) return null;
  const imageUrl = o.primaryImageSmall || o.primaryImage || null;
  if (!imageUrl) return null;
  return {
    id: String(o.objectID),
    title: o.title || "(untitled)",
    maker: o.artistDisplayName || "",
    date: o.objectDate || "",
    imageUrl,
    source: "met",
    culture: o.culture || "",
    dimensions: o.dimensions || "",
    department: o.department || "",
    classification: o.classification || "",
    creditLine: o.creditLine || "",
    objectURL: o.objectURL || null,
  };
}

function mapVam(r) {
  const iiifBase =
    r._images?._iiif_image_base_url ||
    (r._primaryImageId
      ? `https://framemark.vam.ac.uk/collections/${r._primaryImageId}`
      : null);
  const imageUrl = iiifBase
    ? `${iiifBase}/full/843,/0/default.jpg`
    : r._images?._primary_thumbnail || null;
  if (!imageUrl) return null;

  const dims = Array.isArray(r.dimensions)
    ? r.dimensions
        .map((d) => `${d.dimension} ${d.value}${d.unit ? ` ${d.unit}` : ""}`)
        .join("; ")
    : r.dimensions || "";

  return {
    id: r.systemNumber,
    title: r._primaryTitle || r.objectType || "(untitled)",
    maker: r._primaryMaker__name || "",
    date: r._primaryDate || "",
    imageUrl,
    source: "vam",
    culture: r.culture || "",
    dimensions: dims,
    department: r.museumLocation || "",
    classification: r.objectType || "",
    creditLine: r.creditLine || "", // optional
    objectURL: r._links?.self?.href || r._currentLocation?.[0]?.url || null,
  };
}

async function searchMetByKeyword(q, limit = 24, signal) {
  const query = (q && q.trim()) || "art";
  const search = await getAPI(
    `${MET}/search?hasImages=true&q=${encodeURIComponent(query)}`,
    { signal }
  );
  const ids = Array.isArray(search.objectIDs)
    ? search.objectIDs.slice(0, limit)
    : [];
  const results = [];
  for (const part of chunk(ids, 8)) {
    const got = await Promise.allSettled(
      part.map((id) => getAPI(`${MET}/objects/${id}`, { signal }))
    );
    for (const g of got)
      if (g.status === "fulfilled") results.push(mapMet(g.value));
  }
  return results.filter(Boolean);
}

async function searchVamByKeyword(q, limit = 24, offset = 0, signal) {
  const params = new URLSearchParams({
    images_exist: "1",
    page_size: String(limit),
    page_offset: String(offset),
  });
  if (q && q.trim()) params.set("q", q.trim());
  const list = await getAPI(`${VAM}/objects/search?${params.toString()}`, {
    signal,
  });
  const records = Array.isArray(list.records) ? list.records : [];
  return records.map(mapVam).filter(Boolean);
}

function sortItems(items, sort) {
  const byTitle = (a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  const toYear = (s) => {
    const m = (s || "").match(/\d{3,4}/);
    return m ? parseInt(m[0], 10) : Number.NaN;
  };
  const byDate = (a, b) => (toYear(a.date) || 0) - (toYear(b.date) || 0);

  const arr = [...items];
  switch (sort) {
    case "title_desc":
      return arr.sort((a, b) => -byTitle(a, b));
    case "date_asc":
      return arr.sort(byDate);
    case "date_desc":
      return arr.sort((a, b) => -byDate(a, b));
    case "title_asc":
    default:
      return arr.sort(byTitle);
  }
}

export default function App() {
  const [status, setStatus] = useState("loading");
  const [heroItems, setHeroItems] = useState([]);
  const [results, setResults] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);

  async function handleOpen(item) {
    setSelectedItem(item);

    if (item?.source === "vam") {
      try {
        const ctrl = new AbortController();
        const extra = await fetchVamDetail(item.id, ctrl.signal);

        setSelectedItem((prev) => (prev ? { ...prev, ...extra } : prev));
      } catch (e) {
        console.warn("V&A detail fetch failed:", e);
      }
    }
  }
  function handleClose() {
    setSelectedItem(null);
  }

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const [vam12, met12] = await Promise.all([
          searchVamByKeyword("", 12, 0, ctrl.signal),
          searchMetByKeyword("", 12, ctrl.signal),
        ]);
        setHeroItems([...vam12, ...met12]);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    })();
    return () => ctrl.abort();
  }, []);

  async function handleSearchSubmit({ q, source, sort }) {
    const ctrl = new AbortController();
    setStatus("loading");
    try {
      const wantMet = source === "met" || source === "both";
      const wantVam = source === "vam" || source === "both";

      const [met, vam] = await Promise.all([
        wantMet ? searchMetByKeyword(q, 24, ctrl.signal) : Promise.resolve([]),
        wantVam
          ? searchVamByKeyword(q, 24, 0, ctrl.signal)
          : Promise.resolve([]),
      ]);

      const combined = sortItems([...met, ...vam], sort || "title_asc");
      setResults(combined);
      setStatus("success");
    } catch (e) {
      console.error(e);
      setResults([]);
      setStatus("error");
    }
  }

  return (
    <CollectionProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Homepage
                status={status}
                heroItems={heroItems}
                results={results}
                onSearchSubmit={handleSearchSubmit}
                onOpenItem={handleOpen}
                selectedItem={selectedItem}
                onCloseItem={handleClose}
              />
            }
          />
          <Route
            path="/collection"
            element={
              <CollectionPage
                onOpenItem={handleOpen}
                selectedItem={selectedItem}
                onCloseItem={handleClose}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </CollectionProvider>
  );
}
