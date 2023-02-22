import Input from './input'
import { useState } from 'react'


interface PriceInputProps {
    label?: string
    id?: string
    name?: string
    placeholder?: string
    step?: number
    defaultValue?: number
    realValue?: number
    inline?: boolean
    className?: string
    onChange: (value: number) => void
}


export default function PriceInput({ onChange, step, defaultValue, realValue, inline, ...props }: PriceInputProps) {
    const [price, setPrice] = useState(defaultValue || 0)
    const [value, setValue] = useState('0.00')

    function handleChange(e: React.FormEvent<HTMLInputElement>) {
        const str = e.currentTarget.value.substring(3)

        let value = Math.max(Number(str), 0)
        if (!str.includes('.')) value /= 100
        value = Math.floor(value * 100) / 100

        if (value !== price) {
            setPrice(value)
            onChange(value)
        }
    }

    function handleChange2(e: React.FormEvent<HTMLInputElement>) {
        let newValue = e.currentTarget.value
            .replaceAll(/[^\d]/g, '')
            .replace(/^0*/, '')
            .padStart(3, '0')
        newValue = newValue.substring(0, newValue.length - 2) + '.' + newValue.substring(newValue.length - 2)

        setValue(newValue)
    }

    return <Input
        {...props}
        step={step || 0.1}
        min={0}
        // value={'R$ ' + (typeof realValue === 'number' ? realValue.toFixed(2) : price.toFixed(2))}
        value={value}
        inline={inline}
        // onChange={handleChange}
        onChange={handleChange2}
    />
}
