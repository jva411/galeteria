import { useEffect, useState } from 'react'
import OrderCard from 'components/card/order'
import { ControlledOrder } from './api/order'
import { OrderFilter } from 'utils/api/order'
import { MdFilterList } from 'react-icons/md'
import api, { dynamicOptions } from 'utils/axios'
import Sidebar from 'components/planilha/sidebar'
import { productsState } from 'utils/providers/product'
import { deliverymansState } from 'utils/providers/deliveryman'
import { addOrders, ordersState, updateOrder } from 'utils/providers/order'
import { RegisterOrder } from 'components/modal/register-order'


interface PlanilhaProps {
    deliverymans: Deliveryman[]
    products: Product[]
    orders: ControlledOrder[]
}

let sse: EventSource

export default function Planilha({ deliverymans, products, orders }: PlanilhaProps) {
    if (typeof window !== 'undefined') {
        deliverymansState.data = []
        productsState.data = []
        ordersState.orders = []
    }
    if (deliverymansState.data.length === 0) deliverymansState.data.push(...deliverymans)
    if (productsState.data.length === 0) productsState.data.push(...products)
    if (ordersState.orders.length === 0) addOrders(...orders)

    if (sse == null && typeof window !== 'undefined') {
        sse = new EventSource(api.getUri() + '/order?sse=true')
        sse.addEventListener('setup', event => {
            dynamicOptions.id = event.data
        })
        sse.addEventListener('lock', event => {
            const count = Number(event.data)
            const order = ordersState.orders[count].order
            order.locked = true
            updateOrder(order)
        })
        sse.addEventListener('unlock', event => {
            const count = Number(event.data)
            const order = ordersState.orders[count].order
            order.locked = false
            updateOrder(order)
        })
        sse.addEventListener('update-order', event => {
            const order = JSON.parse(event.data) as ControlledOrder
            updateOrder(order, true)
        })
    }

    const [filter, setFilter] = useState<OrderFilter>({})
    const filteredOrders = ordersState.orders.filter(order => Object.keys(filter).reduce((acc, key) => acc && filter[key as keyof OrderFilter] === order.order[key as keyof OrderFilter], true))

    function handleFilterDeliveryman(deliveryman_id: string) {
        if (deliveryman_id === '') setFilter({})
        else setFilter({deliveryman_id})
    }

    return <>
        <div className='flex flex-wrap w-full p-[2rem] justify-between px-[8rem]'>
            {filteredOrders.map((os, idx) => <OrderCard key={idx} os={os} />)}
        </div>
        <label htmlFor='filter' className='fixed top-[5.5rem] right-[1rem] text-[2.8rem] rounded-full border-gray border-[1px] p-[0.6rem] cursor-pointer'>
            <MdFilterList />
        </label>
        <input type='checkbox' id='filter' className='fixed top-[5.5rem] right-[1rem] invisible [&:checked+div.filterOptions]:flex' onChange={e => console.log(`checked? ${e.currentTarget.checked}`)} />
        <div className='filterOptions hidden w-[15rem] p-[0.5rem] bg-white border-black border-[1px] fixed top-[7rem] right-[5.2rem] [&>*]:w-full'>
            <select value={filter.deliveryman_id} onChange={e => handleFilterDeliveryman(e.currentTarget.value)}>
                <option value=''>--Entregador--</option>
                {deliverymansState.data.map((d, idx) => <option key={idx} value={d._id}>{d.name}</option>)}
            </select>
        </div>
        <Sidebar />
        <RegisterOrder />
    </>
}


export async function getServerSideProps() {
    const props = {
        title: 'Planilha',
        deliverymans: [] as Deliveryman[],
        products: [] as Product[],
        orders: [] as ControlledOrder[]
    }

    const [deliverymans, products, orders] = await Promise.all([
        api.get('/deliveryman'),
        api.get('/product'),
        api.get('/order')
    ])
    props.deliverymans = typeof deliverymans.data === 'string'? JSON.parse(deliverymans.data): deliverymans.data
    props.products = typeof products.data === 'string'? JSON.parse(products.data): products.data
    props.orders = typeof orders.data === 'string'? JSON.parse(orders.data): orders.data

    return { props }
}
