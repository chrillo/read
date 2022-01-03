import { ActionFunction, json } from "remix";
import { updateFeedItem } from "~/server/feeds/feeds.server";

export const action:ActionFunction = async({request,params})=>{

    const {itemId} = params
    if(!itemId){
        return null
    }
    return json(await updateFeedItem(itemId, {read:true}))
}

