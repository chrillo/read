import { ActionFunction, json } from "remix";
import { updateFeedItem } from "~/server/feeds/feeds.server";

export const action:ActionFunction = async({request,params})=>{

    const {itemId} = params
    if(!itemId){
        return
    }
    return json(await updateFeedItem(Number(itemId), {read:true}))
}

