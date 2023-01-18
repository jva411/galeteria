import { ChangeEventHandler } from "react"

interface InputTextProps {
    label?: string
    placeholder?: string
    name?: string
    id?: string
    value?: string
    onChange?: ChangeEventHandler<HTMLInputElement>
    defaultValue?: string
}


export default function InputText({ label, placeholder, name, id, value, onChange, defaultValue }: InputTextProps) {
    return <div className='flex flex-col'>
        {label
            ? <label htmlFor={id}>{label}</label>
            : <></>
        }
        <input
            type='text'
            id={id}
            name={name || id}
            placeholder={placeholder || label}
            onChange={onChange}
            value={value}
            defaultValue={defaultValue}
        />
    </div>
}
