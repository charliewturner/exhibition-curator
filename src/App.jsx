// import "./App.css";
// import { useEffect, useState } from "react";
// import Homepage from "./components/Homepage/Homepage";
// import getAPI from "./components/getApi";
// // import Profile from "./components/Profile/Profile";

// function App() {
//   const [apiURL, setApiURL] = useState(
//     "https://data.getty.edu/museum/collection/group/4d54a8e2-f16b-4784-92aa-2a2844ae63b1"
//   );

//   const [mainPageStatus, setMainPageStatus] = useState("loading");

//   useEffect(() => {
//     const fetchAPI = async function () {
//       setMainPageStatus("loading");
//       try {
//         const url =
//           "/.netlify/functions/getty-search?" +
//           new URLSearchParams({
//             q: "",
//             page: "1",
//             perPage: "24",
//             group:
//               "https://data.getty.edu/museum/collection/group/4d54a8e2-f16b-4784-92aa-2a2844ae63b1",
//           });

//         const data = await getAPI(url);

//         console.log(data);

//         setMainPageStatus("success");
//       } catch (err) {
//         setMainPageStatus("error");
//       }
//     };

//     fetchAPI();
//   }, []);

//   return (
//     <>
//       <Homepage></Homepage>
//       {/* <Profile></Profile> */}
//     </>
//   );
// }

// export default App;

import "./App.css";
import { useEffect, useState } from "react";
import Homepage from "./components/Homepage/Homepage";
import getAPI from "./components/getApi"; // your fetch->json helper

export default function App() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      setStatus("loading");
      try {
        // -------- 1) THE MET: search -> fetch objects ----------
        // Search for object IDs that have images
        const search = await getAPI(
          "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=painting",
          { signal: ctrl.signal }
        );

        const ids = Array.isArray(search.objectIDs)
          ? search.objectIDs.slice(0, 24)
          : [];

        // Fetch the objects in parallel
        const metObjects = await Promise.all(
          ids.map((id) =>
            getAPI(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
              { signal: ctrl.signal }
            ).catch(() => null)
          )
        );

        console.log("Met objects JSON (raw):", metObjects.filter(Boolean));

        // -------- 2) GETTY: single object JSON-LD (optional) ----------
        // NOTE: This is just an example ID; replace with a real one you have.
        // The "group/..." URL you had is for an organization and won't list artworks.
        const gettyObjectId = "109D3M"; // <-- put a real object id here from a Getty artwork page
        const gettyObject = await getAPI(
          `https://data.getty.edu/museum/collection/object/${gettyObjectId}`,
          {
            signal: ctrl.signal,
            headers: { Accept: "application/ld+json" }, // ask for JSON-LD
          }
        ).catch(() => null);

        console.log("Getty object JSON-LD (raw):", gettyObject);

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
