import Modal from './modal'
import { useState } from 'react'
import { ControlledOrder } from 'pages/api/order'
import NumberInput from 'components/input/number'
import { productsState } from 'utils/providers/product'

interface RegisterOrderProps {
    onClose: (props: RegisterOrderProps) => void
    order: ControlledOrder
}


export const controls = {
    open: (props?: RegisterOrderProps) => {}
}


export function RegisterOrder() {
    const [props, setProps] = useState<RegisterOrderProps>()
    const [isOpen, setIsOpen] = useState(false)
    const [order, setOrder] = useState<ControlledOrder>()

    function open(props?: RegisterOrderProps) {
        setProps(props)
        setIsOpen(true)
        const temp = props!.order
        const newOrder = {...temp}
        newOrder.products = []
        let i = 0;
        for (const product of productsState.data) {
            if (i < temp.products.length && temp.products[i].name === product.name) {
                newOrder.products.push(temp.products[i])
                i++
            } else {
                newOrder.products.push({...product, amount: 0})
            }
        }
        newOrder.address = {...newOrder.address}
        setOrder(newOrder)
    }
    function close() {
        setIsOpen(false)
        props?.onClose(props)
    }

    function handleChangeAmount(p: ProductOrder, value: number) {
        const old = p.amount
        p.amount = value
        order!.total += (value - old) * p.price
        setOrder({...order!})
    }

    controls.open = open

    return <Modal isOpen={isOpen} onClose={close}>
        <div className='flex w-full h-full'>
            <div className='flex flex-col w-[32rem]'>
                <div className='flex mb-[1rem]'>
                    <input list='address' className='grow h-[3rem] mr-[1rem]' autoFocus />
                    <datalist id='address'>
                        <option value='Primeiro de Maio' />
                    </datalist>
                    <NumberInput placeholder='Casa' className='w-[7rem]' onChange={() => {}} />
                </div>
                <input placeholder='Complemento' className='w-full mb-[1rem]' />
                <ul className='w-full space-y-[0.5rem]'>
                    {order?.products.map((p, idx) => <li key={idx} className='justify-between flex capitalize'>
                        <div className='flex'>
                            <NumberInput className='w-[5rem] mr-[0.5rem]' defaultValue={p.amount} onChange={value => handleChangeAmount(p, value)} transform={v => Math.max(v, 0)} />
                            <span>{p.name}</span>
                        </div>
                        <span>R$ {(p.amount * p.price).toFixed(2)}</span>
                    </li>)}
                    <li className='justify-between flex capitalize'>
                        <span className='ml-[5.5rem]'>Total</span>
                        <span>R$ {order?.total.toFixed(2) || '0.00'}</span>
                    </li>
                </ul>
            </div>
        </div>
    </Modal>
}
