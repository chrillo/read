

export const FormCheckbox = ({label,name,defaultValue}:{label:string,name:string,defaultValue:boolean})=>{
    return <label className="form-checkbox">
        <span className="form-input-label">{label}</span>
        <input type="checkbox" defaultChecked={defaultValue} name={name} />
    </label>
}