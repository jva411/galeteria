import Card from './card'
import { MdEdit } from 'react-icons/md'
import { controls } from 'components/modal/update-product'


interface ProductCardProps {
    product: Product
}


export default function ProductCard({ product }: ProductCardProps) {
    const { name, price } = product

    return <Card className='w-[20rem] flex-col relative'>
        <span className='capitalize'>{name}</span>
        <span>R$ {price.toFixed(2)}</span>
        <button
            onClick={e => controls.open({ product, onClose: () => {} })}
            className='absolute top-[0.5rem] right-[0.5rem] bg-gray-300 p-[0.4rem] rounded-lg'
        >
            <MdEdit />
        </button>
    </Card>
}
