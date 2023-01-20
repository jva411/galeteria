import Input from './input'
import { useState } from 'react'


interface PriceInputProps {
    label?: string
    id?: string
    name?: string
    placeholder?: string
    step?: number
    defaultValue?: number
    onChange: (value: number) => void
}


export default function PriceInput({ onChange, step, defaultValue, ...props }: PriceInputProps) {
    const [price, setPrice] = useState(defaultValue || 0)

    function handleChange(e: React.FormEvent<HTMLInputElement>) {
        const str = e.currentTarget.value.substring(3)

        let value = Math.max(Number(str), 0)
        value = Math.floor(value * 100) / 100

        if (value && value !== price) {
            setPrice(value)
            onChange(value)
        }
    }

    return <Input
        {...props}
        step={step || 0.1}
        min={0}
        value={'R$ ' + price.toFixed(2)}
        onChange={handleChange}
    />
}
