Exhibition Curator
==================

**Live site:** <https://curator-catalogue.netlify.app>\
**Tech stack:** React - Vite - JavaScript - CSS - Netlify

* * * * *

Overview
--------

**Exhibition Curator** is a web-based catalogue and curation tool designed to help users explore, organize, and present art exhibitions digitally. It provides a simple and elegant interface for displaying artworks, managing exhibition information, and sharing curated collections online.

The app is built for speed and usability --- leveraging **Vite** for fast builds and **React** for dynamic interactivity --- and deployed seamlessly on **Netlify** for continuous delivery and hosting.

* * * * *

Features
--------

-   **Art Exhibition Catalogue** -- Displays curated artworks and related information.

-   **Dynamic Filtering and Browsing** -- Users can easily navigate through exhibitions.

-   **Modern Frontend Stack** -- Built with React and Vite for high performance.

-   **Netlify Deployment** -- Automated production builds and instant hosting.

-   **Clean UI** -- Focused, minimalist interface with intuitive navigation.

* * * * *

Tech Stack
----------

| Category | Tools |
| --- | --- |
| Frontend Framework | React |
| Build Tool | Vite |
| Language | JavaScript (ES6+) |
| Styling | CSS |
| Hosting | Netlify |

* * * * *

Project Setup
-------------

### 1\. Clone the Repository

`git clone https://github.com/<your-username>/exhibition-curator.git
cd exhibition-curator`

### 2\. Install Dependencies

`npm install`

### 3\. Run the Development Server

`npm run dev`

Then open <http://localhost:5173> in your browser.

### 4\. Build for Production

`npm run build`

This creates an optimized build in the `dist/` directory.

### 5\. Preview the Production Build (optional)

`npm run preview`

* * * * *

Deployment
----------

This site is hosted on **Netlify**.

Netlify automatically runs the following command when deploying:

`npm run build`

It publishes the compiled files from:

`/dist`

The `netlify.toml` configuration ensures proper routing for a single-page app:

`[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`

* * * * *

Development Notes
-----------------

-   The project originally began in TypeScript but was migrated to **plain JavaScript** for simplicity.

-   All `.ts` and `.tsx` files have been replaced with `.js`/`.jsx`.

-   TypeScript configuration (`tsconfig.json`) and dependencies have been removed.

-   The build now relies solely on **Vite's native build pipeline**.

* * * * *

Future Improvements
-------------------

-   Add artist/exhibit filtering and sorting options.

-   Introduce user authentication for private curator collections.

-   Integrate with a backend or CMS for artwork data.

* * * * *

License
-------

This project is released under the **MIT License**.\
You're free to use, modify, and distribute it with attribution.