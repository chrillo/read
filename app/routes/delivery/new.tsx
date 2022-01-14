import { FeedDelivery } from "@prisma/client";
import { ActionFunction, Form, json, Link, redirect, useActionData } from "remix";
import { Page } from "~/components/app/page";
import { FormActions } from "~/components/form/formActions";
import { FormSubmit } from "~/components/form/formButton";
import { FormCheckbox } from "~/components/form/formCheckbox";
import { FormInput } from "~/components/form/formInput";
import { createFeedDelivery, createFeedSource, validateFeedUrl } from "~/server/feed/feed.server";
import { isString } from "~/utils/typeGuards";
import { getValues } from "~/utils/validation";


export const validateFeedDeliveryInput = async(formData:FormData)=>{
    const values = getValues(formData)
    const {utcHour,intervalHours,active,activeDays} = values
    
    const errors = {} as {[key:string]:string}
    if(!utcHour) errors.title = "Hour is required"
    if(!intervalHours) errors.url = "interval is required"

    return {errors,values:{
        utcHour:parseInt(utcHour, 10),
        intervalHours:parseInt(intervalHours,10),
        active:active === 'on' ? true : false,
        activeDays:[] // TODO parse active days
    }}
}

export const FeedDeliveryForm = ({errors,defaultValues}:{errors?:{[key:string]:string},defaultValues?:Partial<FeedDelivery>})=>{
   return <Form method="post">
    <p><FormInput name="utcHour" label="Hour:" defaultValue={defaultValues?.utcHour} error={errors?.title} /></p>
    <p><FormInput name="intervalHours" label="Interval:" defaultValue={defaultValues?.intervalHours} error={errors?.url} /></p>
    <p><FormCheckbox name="active" label="Active:" defaultValue={defaultValues?.active} /></p>
    <FormActions>
        <FormSubmit label="Save" />
        <Link to="/delivery">Cancel</Link>
    </FormActions>
</Form>
}


export const action:ActionFunction = async({request})=>{

    const formData  = await request.formData()
    const {values,errors} = await validateFeedDeliveryInput(formData)

    console.log('create action',values, errors)
    if(Object.keys(errors).length){
        return json({errors,values})
    }

    const feedSource = await createFeedDelivery(values)

    return redirect(`/delivery`)
}

export const loader = ()=>{
    return null
}

export const NewFeedSource = ()=>{
    const actionData = useActionData();
    console.log('action data',actionData)
    return <Page>
        <FeedDeliveryForm errors={actionData?.errors} defaultValues={actionData?.values} />
    </Page>
}
export default NewFeedSource