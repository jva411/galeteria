import Input from './input'
import { useState } from 'react'


interface NumberInputProps {
    label?: string
    id?: string
    name?: string
    placeholder?: string
    step?: number
    defaultValue?: number
    inline?: boolean
    className?: string
    realValue?: number
    onChange: (value: number) => void
    transform?: (value: number) => number
}


export default function NumberInput({ onChange, transform, realValue, ...props }: NumberInputProps) {
    const [value, setValue] = useState<number>(0)

    function handleChange(value: string) {
        let newValue = Number(value.replaceAll(/[^0-9\-]/ug, ''))
        if (typeof transform !== 'undefined') newValue = transform(newValue)
        setValue(newValue)
        onChange(newValue)
    }

    return <Input
        type='number'
        value={typeof realValue === 'number' ? realValue : value}
        onChange={e => handleChange(e.currentTarget.value)}
        onKeyDown={e => (e.key >= '0' && e.key <= '9')}
        {...props}
    />
}
