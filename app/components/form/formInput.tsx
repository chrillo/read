

export const FormInput = ({wide,label,name,defaultValue,error}:{wide?:boolean,name:string,label:string,defaultValue?:string | number, error?:string})=>{


    return <label className={`form-input ${wide ? 'form-input-wide' : ''}`}>
            <span className="form-input-label">{label}</span>
            <input 
                name={name}
                type="text" 
                defaultValue={defaultValue} 
            />
            {error ? (<span className="form-input-error">{error}</span>) : null}
    </label>
}