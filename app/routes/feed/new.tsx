import { ActionFunction, Form, json, Link, redirect, useActionData } from "remix";
import { Page } from "~/components/app/page";
import { FormActions } from "~/components/form/formActions";
import { FormSubmit } from "~/components/form/formButton";
import { FormCheckbox } from "~/components/form/formCheckbox";
import { FormInput } from "~/components/form/formInput";
import { createFeedSource, validateFeedUrl } from "~/server/feeds/feeds.server";
import { isString } from "~/utils/typeGuards";
import { getValues } from "~/utils/validation";


export const validateFeedSourceInput = async(formData:FormData)=>{
    const values = getValues(formData)
    const {title,url,active} = values
    
    const errors = {} as {[key:string]:string}
    if(!title) errors.title = "Title is required"
    if(!url) errors.url = "Url is required"

    try{
        if(url){
            const feed = await validateFeedUrl({url})
        }
    }catch(error){
        if (error instanceof Error)  errors.url = error.message
    }

    return {errors,values:{title, url,active:active === 'on' ? true : false }}
}

export const FeedSourceForm = ({errors,defaultValues}:{errors?:{[key:string]:string},defaultValues?:{[key:string]:string | boolean}})=>{
   return <Form method="post">
    <p><FormInput wide name="title" label="Title:" defaultValue={defaultValues?.title as string} error={errors?.title} /></p>
    <p><FormInput wide name="url" label="Url:" defaultValue={defaultValues?.url as string} error={errors?.url} /></p>
    <p><FormCheckbox name="active" label="active" defaultValue={defaultValues?.active as boolean} /></p>
    <FormActions>
        <FormSubmit label="Save" />
        <Link to="/feed">Cancel</Link>
    </FormActions>
</Form>
}


export const action:ActionFunction = async({request})=>{

    const formData  = await request.formData()
    const {values,errors} = await validateFeedSourceInput(formData)

    console.log('create action',values, errors)
    if(Object.keys(errors).length){
        return json({errors,values})
    }

    const feedSource = await createFeedSource(values)

    return redirect(`/feed`)
}

export const loader = ()=>{
    return null
}

export const NewFeedSource = ()=>{
    const actionData = useActionData();
    console.log('action data',actionData)
    return <Page>
        <FeedSourceForm errors={actionData?.errors} defaultValues={actionData?.values} />
    </Page>
}
export default NewFeedSource