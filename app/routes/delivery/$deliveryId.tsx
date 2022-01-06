import { ActionFunction, json, LoaderFunction, redirect, useActionData, useLoaderData } from "remix"
import { Page } from "~/components/app/page"
import { getFeedDelivery, getFeedSource, updateFeedDelivery, updateFeedSource } from "~/server/feed/feed.server"
import { FeedSourceForm } from "../feed/new"
import { FeedDeliveryForm, validateFeedDeliveryInput } from "./new"


export const action:ActionFunction = async({request,params})=>{
    const {feedId} = params
    if(!feedId) return json({errors:{id:'id s required'}})
    const formData  = await request.formData()
    const {values,errors} = await validateFeedDeliveryInput(formData)

    console.log('update action',values, errors)
    if(Object.keys(errors).length){
        return json({errors,values})
    }
    
    await updateFeedDelivery(feedId,values)

    return redirect(`/delivery`)
 
}

export const loader:LoaderFunction = ({request,params})=>{
    const {deliveryId} = params
    if(!deliveryId) return null
    return getFeedDelivery(deliveryId)
}

export const NewFeedSource = ()=>{
    const feed = useLoaderData()
    const actionData = useActionData()

    return <Page>
        <FeedDeliveryForm errors={actionData?.errors} defaultValues={feed} />
    </Page>
}
export default NewFeedSource