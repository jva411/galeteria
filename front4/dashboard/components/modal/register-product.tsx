import Modal from './modal'
import api from 'utils/axios'
import { useState } from 'react'
import Input from 'components/input/input'
import PriceInput from 'components/input/price'
import { productState } from 'utils/providers/products'


interface RegisterProductProps {
    onClose: (props: RegisterProductProps) => void
    name: string
    price: number
}


export const controls = {
    open: (props?: RegisterProductProps) => {}
}


export default function RegisterProductModal() {
    const [props, setProps] = useState<RegisterProductProps>()
    const [isOpen, setIsOpen] = useState(false)

    function open(props?: RegisterProductProps) {
        setProps(props)
        setIsOpen(true)
    }
    function close() {
        setIsOpen(false)
        props?.onClose(props)
    }

    function update(key: 'name' | 'price', newValue: string | number) {
        props![key] = newValue as never
        setProps({...props!})
    }

    async function registerProduct() {
        try {
            await api.post('/product', JSON.stringify({
                name: props!.name,
                price: props!.price
            }), {headers:{'Content-Type': 'application/json'}})
            productState.data = JSON.parse(await (await api.get('/product')).data)
            productState.notify('newProduct')
            close()
        } catch(ex) { console.error(ex) }
    }

    controls.open = open

    return <Modal isOpen={isOpen} onClose={close}>
        <Input label='Nome' id='name' value={props?.name} onChange={e => update('name', (e.target as HTMLInputElement).value)} />
        <PriceInput label='Preço' id='price' onChange={value => update('price', value)} />
        <button
            type='button'
            onClick={registerProduct}
            disabled={!props?.name.length}
            className='mt-[3rem] p-[1rem] rounded-full bg-lime-400 disabled:grayscale-[80%]'
        >
            Registrar
        </button>
    </Modal>
}
