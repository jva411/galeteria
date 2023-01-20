export interface InputProps extends React.HTMLProps<HTMLInputElement> {
    label?: string
}


export default function Input({ label, placeholder, name, id, value, onChange, type, defaultValue, ...props }: InputProps) {
    return <div className='flex flex-col'>
        {label
            ? <label htmlFor={id}>{label}</label>
            : <></>
        }
        <input
            type={type}
            id={id}
            name={name || id}
            placeholder={placeholder || label}
            onChange={onChange}
            value={value}
            defaultValue={defaultValue}
            {...props}
        />
    </div>
}
