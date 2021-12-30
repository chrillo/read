import { json } from "remix";
import { syncFeeds } from "~/server/feeds/feeds.server";


export async function loader() {
    return json(await syncFeeds())
}