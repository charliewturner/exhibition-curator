var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/getty-search.ts
var getty_search_exports = {};
__export(getty_search_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(getty_search_exports);
var handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const q = (params.q ?? "").trim();
    const page = Math.max(1, parseInt(params.page ?? "1", 10));
    const perPage = Math.min(100, Math.max(1, parseInt(params.perPage ?? "24", 10)));
    const offset = (page - 1) * perPage;
    const groupURI = params.group?.startsWith("http") ? params.group : "";
    const sparql = `
PREFIX la:  <https://linked.art/ns/terms/>
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>

SELECT ?object ?title ?img WHERE {
  ?object a la:HumanMadeObject .
  OPTIONAL { ?object la:digitally_shown_by/la:access_point ?img . }
  FILTER(BOUND(?img))
  ${groupURI ? `
    { ?object la:current_custodian <${groupURI}> . }
    UNION
    { ?object crm:P50_has_current_keeper <${groupURI}> . }
  ` : ""}
  OPTIONAL { ?object la:title ?title . }
  ${q ? `FILTER(CONTAINS(LCASE(STR(?title)), LCASE("${escapeSparqlLiteral(q)}")))` : ""}
}
ORDER BY LCASE(STR(?title))
LIMIT ${perPage}
OFFSET ${offset}
`.trim();
    const endpoint = process.env.GETTY_SPARQL_ENDPOINT ?? "https://data.getty.edu/museum/collection/sparql";
    const r = await fetch(endpoint, {
      method: "POST",
      headers: {
        "accept": "application/sparql-results+json",
        "content-type": "application/sparql-query"
        // "x-api-key": process.env.GETTY_API_KEY!   // if required
      },
      body: sparql
    });
    if (!r.ok) return { statusCode: 502, body: `SPARQL error ${r.status}` };
    const data = await r.json();
    const items = (data.results?.bindings ?? []).map((b) => ({
      id: b.object?.value,
      title: b.title?.value ?? "(untitled)",
      imageUrl: b.img?.value ?? null
    }));
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=120"
      },
      body: JSON.stringify({ page, perPage, count: items.length, items })
    };
  } catch (e) {
    return { statusCode: 500, body: e?.message ?? "Server error" };
  }
};
function escapeSparqlLiteral(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=getty-search.js.map
