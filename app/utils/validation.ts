import { isBoolean, isString } from "./typeGuards";



export const getValues = (formData:FormData)=>{
    const values = Object.fromEntries(formData);
    
    return Object.keys(values).reduce((agg,key)=>{
        if(isString(values[key])) agg[key] = values[key].toString()
        return agg
    },{} as {[key:string]:string})

    
}