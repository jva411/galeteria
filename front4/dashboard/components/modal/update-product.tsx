import Modal from './modal'
import api from 'utils/axios'
import { useState } from 'react'
import Input from 'components/input/input'
import PriceInput from 'components/input/price'
import { productsState } from 'utils/providers/product'


interface UpdateProductProps {
    onClose: (props: UpdateProductProps) => void
    product: Product
}


export const controls = {
    open: (props?: UpdateProductProps) => {}
}


export default function UpdateProductModal() {
    const [props, setProps] = useState<UpdateProductProps>()
    const [isOpen, setIsOpen] = useState(false)

    function open(props?: UpdateProductProps) {
        setProps(props)
        setIsOpen(true)
    }
    function close() {
        setIsOpen(false)
        props?.onClose(props)
    }

    function update(key: 'name' | 'price', newValue: string | number) {
        props!.product[key] = newValue as never
        setProps({...props!})
    }

    async function updateProduct() {
        try {
            await api.put(`/product/${props!.product._id}`, JSON.stringify({
                name: props!.product.name,
                price: props!.product.price
            }), {headers:{'Content-Type': 'application/json'}})
            productsState.data = JSON.parse(await (await api.get('/product')).data)
            productsState.notify('newProduct')
            close()
        } catch(ex) { console.error(ex) }
    }

    controls.open = open

    return <Modal isOpen={isOpen} onClose={close}>
        <Input label='Nome' id='name' value={props?.product.name} onChange={e => update('name', (e.target as HTMLInputElement).value)} />
        <PriceInput label='Preço' id='price' defaultValue={props?.product.price} onChange={value => update('price', value)} />
        <button
            type='button'
            onClick={updateProduct}
            className='mt-[3rem] p-[1rem] rounded-full bg-lime-400 disabled:grayscale-[80%]'
        >
            Atualizar
        </button>
    </Modal>
}
