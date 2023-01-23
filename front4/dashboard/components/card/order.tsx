import Card from './card'
import api from 'utils/axios'
import { useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { OrderFilter } from 'utils/api/order'
import PriceInput from 'components/input/price'
import { FcLock, FcUnlock } from 'react-icons/fc'
import { deliverymansState } from 'utils/providers/deliveryman'
import { OrderState as ProviderOrderState, updateOrder } from 'utils/providers/order'
import { controls } from 'components/modal/register-order'


interface OrderCardProps {
    os: ProviderOrderState
}
interface ProductListProps {
    products: ProductOrder[]
}

const cardColors = {
    'new': '[div>&]:bg-neutral-200',
    'in_progress': '[div>&]:bg-cyan-300',
    'complete': '[div>&]:bg-green-500',
    'canceled': '[div>&]:bg-[#bf5d52DD]'
}

function ProductList({ products }: ProductListProps) {
    return <ul className='grow px-[1rem] border-l-[0.1rem] border-black'>
        {products.map((p, idx) => <li key={idx} className='justify-between flex capitalize'>
            <span>{p.amount}x {p.name}</span>
            <span>R$ {(p.amount * p.price).toFixed(2)}</span>
        </li>)}
    </ul>
}
let timeoutId: NodeJS.Timeout
let waitToUpdate = false
function handleUpdate(cb: () => void) {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        cb()
        waitToUpdate = true
        setTimeout(() => waitToUpdate = false, 1000)
    }, 500)
}

export default function OrderCard({ os }: OrderCardProps) {
    const { order: data, listeners } = os
    const [order, setOrder] = useState(data)
    listeners[`order-card-${order.count}`] = () => setOrder({...os.order})

    const cardStyles = `relative flex-col p-[0.5rem] w-[37rem] h-auto [div>&]:justify-start mb-[2rem] mr-[2rem] ${cardColors[order.order_state]}`
    const lockStyles = `absolute top-[0.5rem] right-[2.5rem] cursor-pointer`
    const editStyles = `absolute top-[0.5rem] right-[0.5rem] ${order.locked? 'cursor-not-allowed': 'cursor-pointer'}`
    const address = `${order.address.address || 'rua'}, ${order.address.number}` + (order.address.note? ` - ${order.address.note}`: '')
    const changes: OrderFilter = {}
    const canUpdate = order._id !== ''

    async function sendUpdateOrder() {
        await api.put(
            `/order/${order._id}`,
            JSON.stringify(changes),
            {headers:{'Content-Type': 'application/json'}}
        )
    }

    function handleSelectOrderState(state: OrderState) {
        if (!canUpdate) return
        changes['order_state'] = state
        handleUpdate(async () => {
            try {
                await sendUpdateOrder()
                updateOrder(Object.assign(order, changes))
            } catch (Exception) {}
        })
    }

    function lock() {
        api.patch(`/order?lock=true&count=${order.count}`)
        order.locked = true
        updateOrder(order)
    }
    function unlock() {
        api.patch(`/order?lock=false&count=${order.count}`)
        order.locked = false
        updateOrder(order)
    }

    function openEdit() {
        if (!order.locked) {
            controls.open({order, onClose: unlock})
            lock()
        }
    }

    return <Card className={cardStyles}>
        <span className=''>Nº {order.count+1}</span>
        <MdEdit className={editStyles} title='Editar' onClick={() => openEdit()} />
        {order.locked
            ? <FcLock className={lockStyles} title='Desbloquear' onClick={unlock} />
            : <FcUnlock className={lockStyles} title='Bloquear' onClick={lock} />
        }
        <div className='flex w-full text-[1.4rem] border-t-[0.1rem] border-black'>
            <span className='w-[12rem] capitalize'>{address}</span>
            <ProductList products={order.products} />
        </div>
        <div className='flex w-full text-[1.4rem] border-t-[0.1rem] border-black pt-[1rem]'>
            <div className='flex flex-col space-y-[1rem]'>
                <select>
                    <option value=''>--Entregador--</option>
                    {deliverymansState.data.map((d, idx) => <option key={idx} value={d._id}>{d.name}</option>)}
                </select>
                <select>
                    <option value='money'>Dinheiro</option>
                    <option value='card'>Cartão</option>
                    <option value='pix'>PIX</option>
                    <option value='fiado'>Fiado</option>
                </select>
            </div>
            <div className='flex flex-col space-y-[1rem] ml-[1rem]'>
                <select onChange={e => handleSelectOrderState(e.currentTarget.value as OrderState)}>
                    <option value='new'>Novo</option>
                    <option value='in_progress'>Em Rota</option>
                    <option value='complete'>Concluído</option>
                    <option value='canceled'>Cancelado</option>
                </select>
                <select>
                    <option value='money'>Dinheiro</option>
                    <option value='card'>Cartão</option>
                    <option value='pix'>PIX</option>
                    <option value='fiado'>Fiado</option>
                </select>
            </div>
            <div className='flex flex-col space-y-[1rem] ml-[1rem]'>
                <PriceInput label='taxa:' className='w-[10rem] h-[2rem]' inline defaultValue={order.tax} onChange={v => console.log(v)} />
                <span className='font-semibold'>Total: R${order.total.toFixed(2)}</span>
            </div>
        </div>
    </Card>
}
