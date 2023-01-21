import api from 'utils/axios'
import { useEffect, useState } from 'react'
import OrderCard from 'components/card/order'
import { productState } from 'utils/providers/products'
import { deliverymanState } from 'utils/providers/deliveryman'


interface PlanilhaProps {
    deliverymans: Deliveryman[]
    products: Product[]
    orders: Order[]
}

const mockOrder: Order = {
    _id: '',
    address: {
        address: 'primeiro de maio',
        number: 2060,
        note: 'Altos'
    },
    count: 0,
    created_at: new Date().getTime(),
    deliveryman_id: '',
    note: 'Bem Assado\nTrinchado',
    order_state: 'new',
    payment_method: 'money',
    payment_state: 'pendent',
    products: [
        {
            amount: 1,
            name: 'frango com baião',
            price: 23
        },
        {
            amount: 2,
            name: 'batata frita',
            price: 10
        },
        {
            amount: 5,
            name: 'linguiça',
            price: 3
        }
    ],
    tax: 2.0,
    toDelivery: true,
    total: 60.00
}

export default function Planilha({ deliverymans, products, orders }: PlanilhaProps) {
    if (deliverymanState.data.length === 0) deliverymanState.data.push(...deliverymans)
    if (productState.data.length === 0) productState.data.push(...products)

    return <div className='flex flex-wrap w-full p-[2rem] justify-between px-[8rem]'>
        <OrderCard order={mockOrder} />
        <OrderCard order={mockOrder} />
        <OrderCard order={mockOrder} />
        <OrderCard order={mockOrder} />
    </div>
}


export async function getServerSideProps() {
    const props = {
        title: 'Planilha',
        deliverymans: [] as Deliveryman[],
        products: [] as Product[],
        orders: [] as Order[]
    }

    const [deliverymans, products, orders] = await Promise.all([
        api.get('/deliveryman'),
        api.get('/product'),
        api.get('order')
    ])
    props.deliverymans = JSON.parse(deliverymans.data)
    props.products = JSON.parse(products.data)
    props.orders = JSON.parse(orders.data)

    return { props }
}
