import Input from './input'
import { useState } from 'react'


interface PriceInputProps {
    label?: string
    id?: string
    name?: string
    placeholder?: string
    step?: number
    defaultValue?: number
    inline?: boolean
    className?: string
    onChange: (value: number) => void
}


export default function PriceInput({ onChange, step, defaultValue, inline, ...props }: PriceInputProps) {
    const [price, setPrice] = useState(defaultValue || 0)

    function handleChange(e: React.FormEvent<HTMLInputElement>) {
        const str = e.currentTarget.value.substring(3)

        let value = Math.max(Number(str), 0)
        if (!str.includes('.')) value /= 100
        value = Math.floor(value * 100) / 100

        if (value && value !== price) {
            setPrice(value)
            onChange(value)
        }
    }

    function handleKeyDown(key: string) {
        switch (key) {
            case 'ArrowUp': {
                setPrice(price + (step || 0.1))
                break
            }
            case 'ArrowDown': {
                setPrice(Math.max(price - (step || 0.1), 0))
                break
            }
        }
    }

    return <Input
        {...props}
        step={step || 0.1}
        min={0}
        value={'R$ ' + price.toFixed(2)}
        inline={inline}
        onChange={handleChange}
        onKeyDown={e => handleKeyDown(e.key)}
    />
}
