import { ActionFunction, json } from "remix";
import { db } from "~/server/db.server";


export const action:ActionFunction = async({request,params})=>{
    console.log(request,params)

    const {itemId} = params
    if(!itemId){
        return
    }
    const feedItem = await db.feedItem.update({
        where:{
            id:Number(itemId)
        },
        data:{
            read:true
        }
    })
    return json(feedItem)
}

