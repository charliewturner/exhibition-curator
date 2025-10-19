import "./App.css";
import { useEffect, useState } from "react";
import Homepage from "./components/Homepage/Homepage";
import getAPI from "./components/getApi";

const MET = "https://collectionapi.metmuseum.org/public/collection/v1";
const VAM = "https://api.vam.ac.uk/v2";

// tiny helper for batching fetches
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export default function App() {
  const [status, setStatus] = useState("loading");

  const [metItems, setMetItems] = useState([]);
  const [vamItems, setVamItems] = useState([]);
  const [heroItems, setHeroItems] = useState([]);

  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      setStatus("loading");
      try {
        // A) MET — departments -> object IDs -> 24 objects with images

        const { departments } = await getAPI(`${MET}/departments`, {
          signal: ctrl.signal,
        });

        const wantedNames = [
          "Greek and Roman Art",
          "Ancient Near Eastern Art",
          "Egyptian Art",
          "Medieval Art",
          // add  "Islamic Art", "Asian Art", etc.
        ];
        const wantedIds = departments
          .filter((d) => wantedNames.includes(d.displayName))
          .map((d) => d.departmentId);

        const idsResp = await getAPI(
          `${MET}/objects${
            wantedIds.length ? `?departmentIds=${wantedIds.join("|")}` : ""
          }`,
          { signal: ctrl.signal }
        );

        const ids = Array.isArray(idsResp.objectIDs) ? idsResp.objectIDs : [];
        // console.log(
        //   "MET: total candidate IDs:",
        //   ids.length,
        //   "Departments:",
        //   wantedIds
        // );

        const pick = ids.slice(0, 24);
        const metResults = [];
        for (const batch of chunk(pick, 8)) {
          const got = await Promise.allSettled(
            batch.map((id) =>
              getAPI(`${MET}/objects/${id}`, { signal: ctrl.signal })
            )
          );
          for (const g of got)
            if (g.status === "fulfilled") metResults.push(g.value);
        }

        // const metWithImages = metResults.filter(
        //   (o) => o?.primaryImageSmall || o?.primaryImage
        // );
        // console.log("MET objects (24, with images):", metWithImages);
        // setMetItems(metWithImages);

        const metMapped = metResults
          .filter((o) => o?.primaryImageSmall || o?.primaryImage)
          .map((o) => ({
            id: String(o.objectID),
            title: o.title || "(untitled)",
            maker: o.artistDisplayName || "",
            date: o.objectDate || "",
            imageUrl: o.primaryImageSmall || o.primaryImage,
          }));
        // console.log("MET items (24, mapped):", metMapped);
        setMetItems(metMapped);

        // B) V&A — search 24 records with images

        const vamParams = new URLSearchParams({
          images_exist: "1", // only items with images
          page_size: "24",
          page_offset: "0",
          // q: "bronze",        // optional: add a keyword
        });

        const vamList = await getAPI(
          `${VAM}/objects/search?${vamParams.toString()}`,
          {
            signal: ctrl.signal,
          }
        );

        const records = Array.isArray(vamList.records) ? vamList.records : [];
        const vamMapped = records
          .map((r) => {
            const iiifBase =
              r._images?._iiif_image_base_url ||
              (r._primaryImageId
                ? `https://framemark.vam.ac.uk/collections/${r._primaryImageId}`
                : null);

            const imageUrl = iiifBase
              ? `${iiifBase}/full/843,/0/default.jpg`
              : r._images?._primary_thumbnail || null;

            return {
              id: r.systemNumber, // e.g., "O828146"
              title: r._primaryTitle || r.objectType || "(untitled)",
              maker: r._primaryMaker__name || "",
              date: r._primaryDate || "",
              imageUrl,
            };
          })
          .filter((x) => x.imageUrl);

        // console.log("V&A items (24 with images):", vamMapped);
        setVamItems(vamMapped);

        // Combine a few from both sources for the hero
        const combined = [...vamMapped.slice(0, 12), ...metMapped.slice(0, 12)];
        setHeroItems(combined);

        setStatus("success");
      } catch (e) {
        if (e?.name !== "AbortError") {
          console.error("Fetch failed:", e);
          setStatus("error");
        }
      }
    })();

    return () => ctrl.abort();
  }, []);

  return <Homepage status={status} heroItems={heroItems} />;
}
