// import "./App.css";
// import { useEffect, useState } from "react";
// import Homepage from "./components/Homepage/Homepage";
// import getAPI from "./components/getApi"; // your fetch->json helper

// export default function App() {
//   const [status, setStatus] = useState("loading");

//   useEffect(() => {
//     const ctrl = new AbortController();

//     (async () => {
//       setStatus("loading");
//       try {
//         // -------- 1) THE MET: search -> fetch objects ----------
//         // Search for object IDs that have images
//         const search = await getAPI(
//           "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=painting",
//           { signal: ctrl.signal }
//         );

//         console.log(search.objectIDs);
//         const ids = Array.isArray(search.objectIDs)
//           ? search.objectIDs.slice(0, 24)
//           : [];

//         // Fetch the objects in parallel
//         const metObjects = await Promise.all(
//           ids.map((id) =>
//             getAPI(
//               `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
//               { signal: ctrl.signal }
//             ).catch(() => null)
//           )
//         );

//         console.log("Met objects JSON (raw):", metObjects.filter(Boolean));

//         const gettyObjectId = "109D3M"; // <-- put a real object id here from a Getty artwork page
//         const gettyObject = await getAPI(
//           `https://data.getty.edu/museum/collection/object/${gettyObjectId}`,
//           {
//             signal: ctrl.signal,
//             headers: { Accept: "application/ld+json" }, // ask for JSON-LD
//           }
//         ).catch(() => null);

//         console.log("Getty object JSON-LD (raw):", gettyObject);

//         setStatus("success");
//       } catch (e) {
//         console.error("Fetch failed:", e);
//         if (e?.name !== "AbortError") setStatus("error");
//       }
//     })();

//     return () => ctrl.abort();
//   }, []);

//   return <Homepage status={status} />;
// }

import "./App.css";
import { useEffect, useState } from "react";
import Homepage from "./components/Homepage/Homepage";
import getAPI from "./components/getApi";

const MET = "https://collectionapi.metmuseum.org/public/collection/v1";

// tiny helper for batching fetches
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export default function App() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      setStatus("loading");
      try {
        // 1) Get departments
        const { departments } = await getAPI(`${MET}/departments`, {
          signal: ctrl.signal,
        });

        // 2) Choose departments (paintings + antiquities-ish). Adjust as you like.
        const wantedNames = [
          "Greek and Roman Art",
          "Ancient Near Eastern Art",
          "Egyptian Art",
          "Medieval Art",
          // add more if desired: "Islamic Art", "Asian Art", etc.
        ];
        const wantedIds = departments
          .filter((d) => wantedNames.includes(d.displayName))
          .map((d) => d.departmentId);

        // 3) Get object IDs for those departments (OR with "|")
        const idsResp = await getAPI(
          `${MET}/objects${
            wantedIds.length ? `?departmentIds=${wantedIds.join("|")}` : ""
          }`,
          { signal: ctrl.signal }
        );

        const ids = Array.isArray(idsResp.objectIDs) ? idsResp.objectIDs : [];
        console.log(
          "Total candidate IDs:",
          ids.length,
          "Departments:",
          wantedIds
        );

        // 4) Fetch first 24 objects (batched)
        const pick = ids.slice(0, 24);
        const results = [];
        for (const batch of chunk(pick, 8)) {
          const got = await Promise.allSettled(
            batch.map((id) =>
              getAPI(`${MET}/objects/${id}`, { signal: ctrl.signal })
            )
          );
          for (const g of got)
            if (g.status === "fulfilled") results.push(g.value);
        }

        const withImages = results.filter(
          (o) => o?.primaryImageSmall || o?.primaryImage
        );
        console.log("Met objects JSON (with images):", withImages);

        // -------- Optional: fetch ONE specific Met object by ID (Option A) --------
        // Replace with any Met objectID you have, e.g. 239987
        const MET_OBJECT_ID = 239987; // example
        try {
          const singleMetObject = await getAPI(
            `${MET}/objects/${MET_OBJECT_ID}`,
            {
              signal: ctrl.signal,
            }
          );
          console.log(`Single Met object ${MET_OBJECT_ID}:`, singleMetObject);
        } catch (e) {
          console.warn(`Failed to fetch Met object ${MET_OBJECT_ID}:`, e);
        }

        setStatus("success");
      } catch (e) {
        console.error("Fetch failed:", e);
        if (e?.name !== "AbortError") setStatus("error");
      }
    })();

    return () => ctrl.abort();
  }, []);

  return <Homepage status={status} />;
}
