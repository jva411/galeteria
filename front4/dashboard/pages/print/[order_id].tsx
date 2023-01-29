import api from 'utils/axios'
import { DateTime } from 'luxon'
import { ReactNode } from 'react'
import { NextPageContext } from 'next'
import { ControlledOrder } from 'pages/api/order'


interface IPrintableOrderProps {
    order: ControlledOrder
}
interface IValueProps {
    description: string
    value: number | string
}
interface IBoxProps {
    children: ReactNode
    className?: string
}

function Value({ description, value }: IValueProps) {
    return <li className='justify-between flex capitalize'>
        <span>{description}</span>
        <span>{typeof value === 'string' ? value : 'R$ ' + value.toFixed(2)}</span>
    </li>
}

function Box({ children, className }: IBoxProps) {
    const baseStyles = 'flex flex-col border-t-[1px] border-gray-400 px-[1rem] pt-[0.5rem] mt-[0.5rem]'
    return <div className={baseStyles + ' ' + className}>
        {children}
    </div>
}

const payments = {
    'pendent': null,
    'complete': 'Pago',
    'canceled': 'Cancelou'
}
const payments2 = {
    'money': null,
    'card': 'Cartão',
    'pix': 'PIX',
    'fiado': 'Fiado'
}

export default function PrintableOrder({ order }: IPrintableOrderProps) {
    const address = `${order.address.address}, ${order.address.number}` + (order.address.note? ` - ${order.address.note}`: '')
    let payment = payments[order.payment_state] as string | number | null
    if (payment == null) payment = payments2[order.payment_method]
    if (payment == null) payment = order.payment || order.total

    return <div className='relative flex flex-col mt-[0.5rem] ml-[0.5rem] w-[30rem] border-black border-[0.1rem] [&>*]:w-full text-center leading-tight'>
        <span><b>Nº {order.count + 1}</b></span>
        <span>Disk Frango Real</span>
        <span>(85) 3245-8939 / (85) 9 8509-7224</span>
        <Box><b className='text-justify w-full capitalize'>{address}</b></Box>
        <Box>
            {order.products.map((p, idx) => <Value key={idx} description={`${p.amount}x ${p.name}`} value={p.amount * p.price} />)}
            <Value description='Taxa' value={order.tax} />
        </Box>
        <Box>
            <Value description='Total' value={order.total} />
            <Value description='Pagamento' value={payment} />
            {typeof payment === 'string' || payment <= order.total ?
                <></> :
                <Value description='Troco' value={payment - order.total} />
            }
        </Box>
        {order.note ? <Box className='text-justify whitespace-pre-wrap'>
            <b>OBS:</b>
            {order.note + '\n' + 'Trinchado'}
        </Box> : <></>}
        <Box>
            <span>Registrado em {DateTime.fromMillis(order.created_at).toFormat('dd/LL/yyyy - HH:mm')}</span>
        </Box>
    </div>
}



export async function getServerSideProps(context: NextPageContext) {
    const { order_id } = context.query
    const data = (await api.get('order/' + order_id)).data
    const order = typeof data === 'string' ? JSON.parse(data) : data

    return {
        props: {
            order,
            minimize: true
        }
    }
}
