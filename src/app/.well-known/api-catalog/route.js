import { apiCatalog } from "@/generated/api-catalog";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600",
  "Content-Type": "application/linkset+json; charset=utf-8",
};

export function GET() {
  return new Response(JSON.stringify(apiCatalog), { headers });
}

export function HEAD() {
  return new Response(null, { headers });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...headers,
      Allow: "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    },
  });
}
