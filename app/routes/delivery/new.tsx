import { FeedDelivery } from "@prisma/client";
import { ActionFunction, Form, json, Link, redirect, useActionData } from "remix";
import { Page } from "~/components/app/page";
import { FormActions } from "~/components/form/formActions";
import { FormSubmit } from "~/components/form/formButton";
import { FormCheckbox } from "~/components/form/formCheckbox";
import { FormInput } from "~/components/form/formInput";
import { createFeedDelivery, createFeedSource, validateFeedUrl } from "~/server/feed/feed.server";
import { formatDayOfWeek } from "~/utils/format";
import { isString } from "~/utils/typeGuards";
import { getCheckbox, getInt, getString, getStringArray, getValues } from "~/utils/validation";


export const validateFeedDeliveryInput = async(formData:FormData)=>{
    console.log(formData)
    const active = getCheckbox(formData,'active')
    const utcHour = getInt(formData,'utcHour')
    const intervalHours = getInt(formData,'intervalHours')
    const activeDays = getStringArray(formData,'activeDays')

    const errors = {} as Record<string,string>
    if(utcHour < 0 || utcHour > 23) errors.utcHour = "Enter a value between 0 - 23"
    if(intervalHours < 1) errors.intervalHours = "Enter a number greater than 1"

    return {errors,values:{
        utcHour,
        intervalHours,
        active,
        activeDays:activeDays.map(Number)
    }}
}

export const FeedDeliveryForm = ({errors,defaultValues}:{errors?:{[key:string]:string},defaultValues?:Partial<FeedDelivery>})=>{
   return <Form method="post">
    <p><FormInput name="utcHour" label="Hour:" defaultValue={defaultValues?.utcHour} error={errors?.title} /></p>
    <p><FormInput name="intervalHours" label="Interval:" defaultValue={defaultValues?.intervalHours} error={errors?.url} /></p>
    
    {[1,2,3,4,5,6,0].map((day)=>{
        return <p key={day}><FormCheckbox value={day+''} name="activeDays" label={formatDayOfWeek(day)} defaultValue={defaultValues?.activeDays?.includes(day)} /></p>
    })}

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