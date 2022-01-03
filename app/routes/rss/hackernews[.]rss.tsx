import type { LoaderFunction } from "remix";
import { getFrontPageItems } from "~/server/feeds/hackernews.server";


function escapeCdata(s: string) {
  return s.replaceAll("]]>", "]]]]><![CDATA[>");
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const loader: LoaderFunction = async ({
  request,
}) => {
  const perPage = 50
  const page = Number(new URL(request.url).searchParams.get('page')) || 1
  const from = (page -1) * perPage
  const to = page * perPage
  const items = await getFrontPageItems(from,to)

  const host =
    request.headers.get("X-Forwarded-Host") ??
    request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost")
    ? "http"
    : "https";
  const domain = `${protocol}://${host}`;
  const publicUrl = `${domain}/feeds/hackernews.rss`;

  const rssString = `
    <rss xmlns:blogChannel="${publicUrl}" version="2.0">
      <channel>
        <title>Hackernews</title>
        <link>${publicUrl}</link>
        <description>Top 100 Frontpage Items</description>
        <language>en-us</language>
        <generator>Read</generator>
        <ttl>40</ttl>
        ${items
          .map(item =>
            `
            <item>
              <title><![CDATA[${escapeCdata(
                item.title
              )}]]></title>
              <description><![CDATA[${escapeHtml(
                item.content
              )}]]></description>
              <author><![CDATA[${escapeCdata(
                item.author || ''
              )}]]></author>
              <pubDate>${item.createdAt.toUTCString()}</pubDate>
              ${item.commentsUrl ? `<hn:comments>${item.commentsUrl}</hn:comments>` : ''}
              <link>${item.url ? escapeHtml(item.url) : item.guid}</link>
              <guid>${item.guid}</guid>
            </item>
          `.trim()
          )
          .join("\n")}
      </channel>
    </rss>
  `.trim();

  return new Response(rssString, {
    headers: {
      "Cache-Control": `public, max-age=${
        60 * 10
      }, s-maxage=${60 * 60 * 24}`,
      "Content-Type": "application/xml",
      "Content-Length": String(Buffer.byteLength(rssString))
    }
  });
};