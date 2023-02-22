export interface InputProps extends React.HTMLProps<HTMLInputElement> {
    label?: string
    inline?: boolean
}


export default function Input({ label, placeholder, name, id, value, onChange, type, defaultValue, inline, ...props }: InputProps) {
    return <div className={'flex' + (inline? ' space-x-[0.5rem]': ' flex-col')}>
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
