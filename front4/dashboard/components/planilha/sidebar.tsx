import { useState } from 'react'
import { ControlledOrder } from 'pages/api/order'
import { ordersState } from 'utils/providers/order'
import { RxDoubleArrowRight, RxDoubleArrowLeft } from 'react-icons/rx'
import { deliverymansState } from 'utils/providers/deliveryman'


interface ISidebarProps { }
interface IDeliverymanReportProps {
    deliveryman: string
    orders: ControlledOrder[]
}

const translations = {
    'money': 'Dinheiro',
    'card': 'Cartão',
    'pix': 'PIX'
}

function DeliverymanReport({ deliveryman, orders }: IDeliverymanReportProps) {
    const separatedOrders = {
        'money': orders.filter(order => order.payment_method === 'money'),
        'card': orders.filter(order => order.payment_method === 'card'),
        'pix': orders.filter(order => order.payment_method === 'pix')
    }

    return <div className='flex flex-col w-full mt-[0.5rem] pt-[0.5rem] border-black border-t-[1px]'>
        <span><b>{deliveryman}</b> - {orders.length} entregas</span>
        {['money', 'card', 'pix'].map((method, idx) =>
            <div key={idx} className='flex justify-between'>
                <span>{translations[method as 'money']}</span>
                <span>R$ {(separatedOrders[method as 'money'].reduce((acc, order) => acc + order.total, 0)).toFixed(2)}</span>
            </div>
        )}
        <div className='flex justify-between'>
            <span>Total</span>
            <span>R$ {(orders.reduce((acc, order) => acc + order.total, 0)).toFixed(2)}</span>
        </div>
    </div>
}

export default function Sidebar({}: ISidebarProps) {
    const [isOpen, setIsOpen] = useState(false)

    const sidebarStyles = `flex flex-col fixed left-0 top-0 pt-[5rem] bg-white h-screen ${isOpen? 'w-[40rem]': 'w-[3rem]'}
    shadow-[1px_1px_5px_gray] duration-500 ease-in overflow-hidden
    `

    const todayOrders = ordersState.orders.filter(order => order.order._id).map(o => o.order)
    const completeOrders = todayOrders.filter(order => order.order_state === 'complete')
    const canceledOrders = todayOrders.filter(order => order.order_state === 'canceled')
    const deliverymansID = new Set(todayOrders.map(order => order.deliveryman_id))
    // console.log(deliverymansID)
    const deliverymans = deliverymansState.data.filter(d => deliverymansID.has(d._id))


    return <div className={sidebarStyles}>
        <button type='button' className='absolute right-[0.5rem] top-[5.5rem] text-[2rem]' onClick={() => setIsOpen(!isOpen)}>
            {isOpen? <RxDoubleArrowLeft />: <RxDoubleArrowRight />}
        </button>
        {isOpen? <>
            Entregadores
            {deliverymans.map((d, idx) => <DeliverymanReport key={idx} deliveryman={d.name} orders={todayOrders.filter(order => order.deliveryman_id === d._id)} />)}
        </>: <></>}
    </div>
}
