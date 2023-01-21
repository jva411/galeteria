import PriceInput from 'components/input/price'
import { deliverymanState } from 'utils/providers/deliveryman'
import Card from './card'


interface OrderCardProps {
    order: Order
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

export default function OrderCard({ order }: OrderCardProps) {
    const cardStyles = `flex-col p-[0.5rem] w-[37rem] h-auto [div>&]:justify-start mb-[2rem] mr-[2rem] ${cardColors[order.order_state]}`
    const address = `${order.address.address || 'rua'}, ${order.address.number}` + (order.address.note? ` - ${order.address.note}`: '')

    return <Card className={cardStyles}>
        <span className=''>Nº {order.count+1}</span>
        <div className='flex w-full text-[1.4rem] border-t-[0.1rem] border-black'>
            <span className='w-[12rem] capitalize'>{address}</span>
            <ProductList products={order.products} />
        </div>
        <div className='flex w-full text-[1.4rem] border-t-[0.1rem] border-black pt-[1rem]'>
            <div className='flex flex-col space-y-[1rem]'>
                <select>
                    <option value=''>--Entregador--</option>
                    {deliverymanState.data.map(d => <option value={d._id}>{d.name}</option>)}
                </select>
                <select>
                    <option value='money'>Dinheiro</option>
                    <option value='card'>Cartão</option>
                    <option value='pix'>PIX</option>
                    <option value='fiado'>Fiado</option>
                </select>
            </div>
            <div className='flex flex-col space-y-[1rem] ml-[1rem]'>
                <select>
                    <option value="new">Novo</option>
                    <option value="in_progress">Em Rota</option>
                    <option value="complete">Concluído</option>
                    <option value="canceled">Cancelado</option>
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
