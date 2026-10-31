/**
 * Notifies IndexNow (Bing, Yandex, Seznam, Naver…) of every URL in the built sitemap, so changes are crawled in minutes.
 * Run after deploying production: `pnpm indexnow`. Needs SITE_ENV=production, SITE_URL and INDEXNOW_KEY in the
 * environment (or in .env.production) and a previous `pnpm build`.
 * https://www.indexnow.org/documentation
 */
import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env.production")) process.loadEnvFile(".env.production");
const { SITE_ENV, SITE_URL, INDEXNOW_KEY } = process.env;

if (SITE_ENV !== "production" || !SITE_URL || !INDEXNOW_KEY) {
    console.error("IndexNow skipped: requires SITE_ENV=production, SITE_URL and INDEXNOW_KEY");
    process.exit(1);
}

const sitemap = readFileSync("dist/sitemap.xml", "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
const site = new URL(SITE_URL);

const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
        host: site.host,
        key: INDEXNOW_KEY,
        keyLocation: new URL(`/${INDEXNOW_KEY}.txt`, site).href,
        urlList,
    }),
});

// 200 = accepted, 202 = accepted but the key is still being verified
if (!response.ok) {
    console.error(`IndexNow failed: ${response.status} ${await response.text()}`);
    process.exit(1);
}
console.log(`IndexNow: submitted ${urlList.length} URLs (${response.status})`);
