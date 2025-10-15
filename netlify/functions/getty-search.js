export const handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const q = (params.q || "").trim();
    const page = Math.max(1, parseInt(params.page || "1", 10));
    const perPage = Math.min(
      100,
      Math.max(1, parseInt(params.perPage || "24", 10))
    );
    const offset = (page - 1) * perPage;

    const groupURI =
      params.group && params.group.startsWith("http") ? params.group : "";

    const sparql = `
PREFIX la:  <https://linked.art/ns/terms/>
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>

SELECT ?object ?title ?img WHERE {
  ?object a la:HumanMadeObject .

  # Must have a digital object with an access point (image)
  ?object la:digitally_shown_by ?dig .
  ?dig a la:DigitalObject .
  ?dig la:access_point ?img .

  # If a group is provided, accept ANY relation from object -> group.
  ${groupURI ? `?object ?anyRel <${groupURI}> .` : ""}

  OPTIONAL { ?object la:title ?title . }

  ${
    q
      ? `FILTER(CONTAINS(LCASE(STR(?title)), LCASE("${escapeSparqlLiteral(
          q
        )}")))`
      : ""
  }
}
ORDER BY LCASE(STR(?title))
LIMIT ${perPage}
OFFSET ${offset}
`.trim();

    const endpoint =
      process.env.GETTY_SPARQL_ENDPOINT ||
      "https://data.getty.edu/museum/collection/sparql";

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/sparql-results+json",
        "content-type": "application/sparql-query",
      },
      body: sparql,
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      console.error("SPARQL error", resp.status, text);
      return { statusCode: 502, body: `SPARQL error ${resp.status}` };
    }

    const json = await resp.json();
    const items = (json.results?.bindings || []).map((b) => ({
      id: b.object?.value,
      title: b.title?.value || "(untitled)",
      imageUrl: b.img?.value || null,
    }));

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=120",
      },
      body: JSON.stringify({ page, perPage, count: items.length, items }),
    };
  } catch (e) {
    console.error("Function error:", e);
    return { statusCode: 500, body: e?.message || "Server error" };
  }
};

function escapeSparqlLiteral(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
