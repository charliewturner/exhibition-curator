Curator Catalogue
=================

A React app for exploring artworks from multiple museum collections (currently **The Met** and **V&A**) with search, filtering, a hero carousel, and a **local-storage--backed "My Collection"** you can save to without logging in.

Live demo: *(add your Netlify URL once deployed)*

* * * * *

Features
--------

-   **Hero Carousel**: 3-up carousel with a prominent center image and side previews.

-   **Search**: Keyword search across Met + V&A, with source filter and sort options.

-   **Results Grid**: Click any work to open a **details modal**.

-   **My Collection**: Save/remove works to a personal collection stored in `localStorage`.

-   **Collection Page**: View your saved items, open the same details modal, and search again.

-   **Responsive UI**: Simple, CSS-first layout (no CSS framework required).

* * * * *

Tech Stack
----------

-   **React 19**, **Vite**

-   **React Router v6**

-   **Netlify Functions** for optional API proxying (e.g., handling CORS)

-   Plain **CSS** (in `App.css` / `index.css`)

-   Data sources:

    -   **The Met Collection API**: `https://collectionapi.metmuseum.org`

    -   **V&A API**: `https://api.vam.ac.uk/v2`

* * * * *

Getting Started
---------------

### 1) Install

`npm install`

### 2) Run dev server

`npm run dev`

Vite will print a local URL like `http://localhost:5173`.

### 3) Build

`npm run build`

### 4) Preview production build (optional)

`npm run preview`

* * * * *

Project Structure
-----------------

`.
├── netlify/
│   └── functions/
│       ├── fitz-object.js       # example function (optional)
│       └── getty-search.js      # example function (optional)
├── src/
│   ├── App.jsx                  # routes + data fetching orchestration
│   ├── App.css / index.css      # global styles
│   ├── main.jsx                 # React entry
│   ├── components/
│   │   ├── getApi.js            # tiny fetch->json helper
│   │   ├── Homepage/
│   │   │   ├── Homepage.jsx     # header + body + results + modal
│   │   │   ├── Header.jsx       # includes Search + "My Collection" button
│   │   │   ├── Search.jsx       # SearchInput + Filters + Sort + Submit
│   │   │   ├── SearchInput.jsx
│   │   │   ├── Filters.jsx
│   │   │   ├── Sort.jsx
│   │   │   ├── Submit.jsx
│   │   │   ├── Body.jsx
│   │   │   ├── HeroCarousel.jsx
│   │   │   └── ArtworkModal.jsx
│   │   └── collection/
│   │       ├── CollectionContext.jsx # localStorage-backed "My Collection"
│   │       └── CollectionPage.jsx    # saved items view
│   └── ...
└── vite.config.js`

* * * * *

How It Works
------------

### Data fetching

-   **The Met**

    -   `GET /public/collection/v1/search?hasImages=true&q=<term>` → returns `objectIDs[]`

    -   Then fetch details: `GET /public/collection/v1/objects/<id>`

    -   We normalize to a common item shape: `{ id, title, maker, date, imageUrl, ... }`

-   **V&A**

    -   `GET /v2/objects/search?images_exist=1&q=<term>&page_size=24` → returns `records[]` (compact)

    -   For many details (e.g., dimensions/culture/object page url), we optionally fetch:

        -   `GET /v2/museumobject/<systemNumber>` (detail)

            -   URL to public page often under `meta._links_collection_page.href`

            -   Dimensions under `record.dimensions` (array/string)

-   **CORS**\
    Both APIs usually support direct client calls. If you hit CORS or throttling issues, route via a **Netlify function** (see below).

### Local "My Collection"

-   Implemented via `CollectionContext.jsx`, persisted in `localStorage` (`myCollectionV1`).

-   Helpers: `add(item)`, `remove(item)`, `toggle(item)`, `isSaved(item)`.

-   Access with `useCollection()` inside components.

### Routing

-   `/` → homepage (carousel, search, results)

-   `/collection` → "My Collection" page

* * * * *

Environment & Configuration
---------------------------

No API keys are required for the Met/V&A endpoints used here.

If you choose to hide requests behind Netlify Functions (to avoid CORS or to add rate limiting), configure Netlify locally:

### Netlify Dev (optional)

`npm i -g netlify-cli
netlify dev`

This will run Vite and your `netlify/functions/*` lambdas locally at `/.netlify/functions/<name>`.

**Example function usage:**

`// client
const res = await fetch('/.netlify/functions/some-proxy?url=' + encodeURIComponent(actualUrl));
const json = await res.json();`

* * * * *

Common Scripts
--------------

-   `npm run dev` --- start Vite dev server

-   `npm run build` --- bundle for production

-   `npm run preview` --- serve the production build locally

* * * * *

Key Components (Where to edit)
------------------------------

-   **Change hero dots color**: in `index.css` / `App.css` (`.hero-dot`, `.hero-dot.is-active`)

-   **Align Save buttons**: see `.result-card` styles and the `Homepage.jsx` list items

-   **Center search bar**: `.search-form` and `#header-container` styles

-   **Truncate result titles**: `Homepage.jsx` → `truncateWords()` helper

* * * * *

Troubleshooting
---------------

-   **Invalid hook call / BrowserRouter error**

    -   Ensure only **one** copy of React is installed: `npm ls react react-dom`

    -   Make sure `CollectionContext` is imported from **one consistent path**

    -   Wrap consumers with `<CollectionProvider>...</CollectionProvider>`

    -   Update React Router: `npm i react-router-dom@latest`

    -   In `vite.config.js`: `resolve: { dedupe: ['react', 'react-dom'] }`

-   **CORS errors**

    -   Try again (APIs sometimes rate limit).

    -   Temporarily proxy via a Netlify Function.

-   **Met object 404**

    -   Normal: search IDs occasionally 404. We use `Promise.allSettled` and filter failures.

* * * * *

Roadmap / Ideas
---------------

-   Auth + server persistence (Supabase)

-   More sources (Tate, British Museum via SPARQL/linked data, Europeana)

-   Advanced filters (period, medium, culture)

-   Image IIIF viewers and zoom

-   Shareable/public collections

* * * * *

License & Credits
-----------------

-   Code: MIT (add a `LICENSE` file if needed).

-   Data & Images: Subject to the terms of the source museums:

    -   The Met Collection API © The Metropolitan Museum of Art.

    -   V&A API © Victoria and Albert Museum.

* * * * *

Acknowledgements
----------------

Thanks to the open museum APIs that make cultural browsing possible. If you use this publicly, please credit the data providers and respect their usage guidelines.