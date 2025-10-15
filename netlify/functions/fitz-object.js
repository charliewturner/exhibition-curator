export const handler = async (event) => {
  const id = event.queryStringParameters?.id || "399";
  const url = `https://data.fitzmuseum.cam.ac.uk/id/object/${id}`;
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  return {
    statusCode: r.status,
    headers: {
      "content-type": r.headers.get("content-type") || "application/json",
    },
    body: await r.text(),
  };
};
