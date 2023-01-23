import { useEffect, useState } from 'react'
import OrderCard from 'components/card/order'
import { ControlledOrder } from './api/order'
import api, { dynamicOptions } from 'utils/axios'
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
    if (deliverymansState.data.length === 0) deliverymansState.data.push(...deliverymans)
    if (productsState.data.length === 0) productsState.data.push(...products)
    if (ordersState.orders.length === 0) addOrders(...orders)

    if (sse == null && typeof window !== 'undefined') {
        console.log(api.getUri())
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
            updateOrder(order)
        })
    }

    return <>
        <div className='flex flex-wrap w-full p-[2rem] justify-between px-[8rem]'>
            {ordersState.orders.map((os, idx) => <OrderCard key={idx} os={os} />)}
        </div>
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
        api.get('order')
    ])
    props.deliverymans = typeof deliverymans.data === 'string'? JSON.parse(deliverymans.data): deliverymans.data
    props.products = typeof products.data === 'string'? JSON.parse(products.data): products.data
    props.orders = typeof orders.data === 'string'? JSON.parse(orders.data): orders.data

    return { props }
}
