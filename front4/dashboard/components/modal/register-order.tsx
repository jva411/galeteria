import Modal from './modal'
import api from 'utils/axios'
import { useState } from 'react'
import { ControlledOrder } from 'pages/api/order'
import NumberInput from 'components/input/number'
import { productsState } from 'utils/providers/product'
import { updateOrder } from 'utils/providers/order'


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
    function handleChangeNote(value: string) {
        order!.note = value
        setOrder({...order!})
    }
    function handleOBSCheck(value: string, checked: boolean) {
        if (checked) order!.note += value +'\n'
        else order!.note = order!.note.replace(new RegExp(value + '\n?', 'gi'), '')
        setOrder({...order!})
    }
    function handleChangeToDelivery(checked: boolean) {
        order!.toDelivery = checked
        setOrder({...order!})
    }

    async function createOrder() {
        order!.note = order!.note.trim()
        order!.address.address = order!.address.address.trim()
        order!.address.note = order!.address.note.trim()

        if (order!._id) {
            api.put('/order/' + order!._id, JSON.stringify(order!), {headers: {'Content-Type': 'application/json'}})
            updateOrder(order!)
        } else {
            const res = await api.post('/order', JSON.stringify(order!), {headers: {'Content-Type': 'application/json'}})
            const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
            updateOrder(data as ControlledOrder)
        }
        close()
    }

    controls.open = open

    return <Modal isOpen={isOpen} onClose={close} containerProps={{className: 'w-[67rem] h-fit'}}>
        <span className='absolute top-[1rem]'>Nº {(order?.count || 0) + 1}</span>
        <div className='flex w-full h-full'>
            <div className='flex flex-col w-[32rem] py-[0.5rem] pr-[1rem] border-y-[0.1rem] border-black'>
                <div className='flex mb-[1rem]'>
                    <input list='address' className='grow h-[3rem] mr-[1rem]' placeholder='Rua' autoFocus />
                    <datalist id='address'>
                        <option value='Primeiro de Maio' />
                    </datalist>
                    <NumberInput placeholder='Casa' className='w-[7rem]' onChange={() => {}} />
                </div>
                <input placeholder='Complemento' className='w-full mb-[1rem]' />
                <div className='border-black border-t-[0.1rem] pt-[1rem] mt-[1rem]'>
                    <textarea className='w-full h-[9rem] p-[0.4rem] text-[1.4rem] rounded-[0.9rem] resize-none border-black border-[0.1rem]' placeholder='Obeservações' value={order?.note} onChange={e => handleChangeNote(e.currentTarget.value)} />
                    <div className='flex text-[1.4rem]'>
                        {['Bem Assado', 'Trinchado'].map((opt, idx) => <div key={idx}>
                            <input type='checkbox' id={opt} checked={order?.note.toLowerCase().includes(opt.toLowerCase())} onChange={e => handleOBSCheck(opt, e.currentTarget.checked)} />
                            <label htmlFor={opt} className='ml-[0.5rem] mr-[2rem]'>{opt}</label>
                        </div>)}
                    </div>
                </div>
                <div className='border-black border-t-[0.1rem] pt-[1rem] mt-[1rem]'>
                    <input type='checkbox' id='toDelivery' checked={!order?.toDelivery} onChange={e => handleChangeToDelivery(!e.currentTarget.checked)} />
                    <label htmlFor='toDelivery' className='ml-[0.5rem] mr-[2rem]'>Retirar no local</label>
                </div>
            </div>
            <ul className='pl-[1rem] py-[0.5rem] grow space-y-[0.5rem] border-black border-l-[0.1rem] border-y-[0.1rem]'>
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
        <div className='flex mt-[0.5rem] pt-[1rem] w-full justify-end'>
            <button className='bg-green-500 text-white font-bold w-[8rem] h-[6rem] rounded-[0.8rem]' type='button' onClick={createOrder}>Salvar</button>
        </div>
    </Modal>
}
