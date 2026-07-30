/**
 * IndexNow URL Submission Script
 *
 * Fetches the sitemap, extracts all URLs, and submits them to IndexNow API endpoints.
 *
 * Usage:
 *   node scripts/submit-indexnow.js
 *   node scripts/submit-indexnow.js --key <your-key>  (override key)
 *   node scripts/submit-indexnow.js --dry-run          (print without submitting)
 */

const https = require("https");
const http = require("http");

const SITE_URL = "https://bayer.ooo";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const API_KEY = "c9d901b6-2e28-42fb-8f11-a6f448a6576e";

// IndexNow API endpoints
const ENDPOINTS = [
  { name: "Bing", url: "https://www.bing.com/indexnow" },
  { name: "Seznam", url: "https://search.seznam.cz/indexnow" },
  { name: "Naver", url: "https://searchadvisor.naver.com/indexnow" },
  { name: "Yandex", url: "https://yandex.com/indexnow" },
];

function fetchXML(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, { headers: { "User-Agent": "bayer.ooo-IndexNow/1.0" } }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function extractURLsFromSitemap(xml) {
  const urls = [];
  const regex = /<loc[^>]*>([^<]+)<\/loc>/gi;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

function submitToIndexNow(endpoint, host, key, urlList) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      host: host.replace(/^https?:\/\//, ""),
      key,
      keyLocation: `${host}/${key}.txt`,
      urlList,
    });

    const url = new URL(endpoint);
    const client = endpoint.startsWith("https") ? https : http;

    const req = client.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(body),
          "User-Agent": "bayer.ooo-IndexNow/1.0",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            body: data,
          });
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const overrideKeyIndex = args.indexOf("--key");
  const key = overrideKeyIndex !== -1 ? args[overrideKeyIndex + 1] : API_KEY;

  console.log(`🔑 IndexNow Key: ${key}`);
  console.log(`🌐 Site: ${SITE_URL}`);
  console.log(`📄 Sitemap: ${SITEMAP_URL}`);
  console.log(`🏁 Dry-run: ${dryRun ? "YES" : "NO"}`);
  console.log("");

  // Fetch sitemap
  console.log("📡 Fetching sitemap...");
  let xml;
  try {
    xml = await fetchXML(SITEMAP_URL);
  } catch (err) {
    console.error(`❌ Failed to fetch sitemap: ${err.message}`);
    process.exit(1);
  }

  const urls = extractURLsFromSitemap(xml);
  console.log(`✅ Found ${urls.length} URLs in sitemap`);
  console.log("");

  // Show first 5 URLs as preview
  console.log("📋 First URLs:");
  urls.slice(0, 5).forEach((u) => console.log(`   ${u}`));
  if (urls.length > 5) console.log(`   ... and ${urls.length - 5} more`);
  console.log("");

  if (dryRun) {
    console.log("🏁 Dry-run complete. No URLs were submitted.");
    return;
  }

  // Submit to each endpoint (IndexNow spec: max 10k URLs per request)
  const batchSize = 10000;
  const batches = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    batches.push(urls.slice(i, i + batchSize));
  }

  for (const endpoint of ENDPOINTS) {
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`🚀 Submitting batch ${i + 1}/${batches.length} (${batch.length} URLs) to ${endpoint.name}...`);

      try {
        const result = await submitToIndexNow(endpoint.url, SITE_URL, key, batch);
        if (result.status === 200) {
          console.log(`   ✅ ${endpoint.name} accepted batch ${i + 1}`);
        } else {
          console.log(`   ⚠️  ${endpoint.name} responded with ${result.status}: ${result.body}`);
        }
      } catch (err) {
        console.error(`   ❌ ${endpoint.name} failed: ${err.message}`);
      }
    }
  }

  console.log("");
  console.log("✅ IndexNow submission complete!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
