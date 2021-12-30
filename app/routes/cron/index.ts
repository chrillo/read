import { json } from "remix";
import { syncFeeds } from "~/server/feeds/feeds.server";


export async function loader() {
    console.log('sync feeds')
    return json(await syncFeeds())
}