import { json } from "remix";
import { syncFeeds } from "~/server/feeds/feeds.service";


export async function loader() {
    return json(await syncFeeds())
}