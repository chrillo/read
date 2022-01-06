import { ActionFunction, Form, json, Link, LoaderFunction, redirect, useActionData, useLoaderData } from "remix"
import { Page } from "~/components/app/page"
import { FormActions } from "~/components/form/formActions"
import { FormSubmit } from "~/components/form/formButton"
import { FormInput } from "~/components/form/formInput"
import { createFeedSource, getFeedSource, updateFeedSource } from "~/server/feed/feed.server"
import { FeedSourceForm, validateFeedSourceInput } from "./new"


export const action:ActionFunction = async({request,params})=>{
    const {feedId} = params
    if(!feedId) return json({errors:{id:'id s required'}})
    const formData  = await request.formData()
    const {values,errors} = await validateFeedSourceInput(formData)

    console.log('update action',values, errors)
    if(Object.keys(errors).length){
        return json({errors,values})
    }
    
    await updateFeedSource(feedId,values)

    return redirect(`/feed`)
 
}

export const loader:LoaderFunction = ({request,params})=>{
    const {feedId} = params
    if(!feedId) return null
    return getFeedSource({id:feedId})
}

export const NewFeedSource = ()=>{
    const feed = useLoaderData()
    const actionData = useActionData()

    return <Page>
        <FeedSourceForm errors={actionData?.errors} defaultValues={feed} />
    </Page>
}
export default NewFeedSource