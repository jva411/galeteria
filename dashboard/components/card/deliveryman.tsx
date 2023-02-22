import Card from './card'


interface DeliverymanCardProps {
    deliveryman: Deliveryman
}


export default function DeliverymanCard({ deliveryman }: DeliverymanCardProps) {
    const { name, active, description, created_at } = deliveryman
    const color = active ? 'bg-green-500' : 'bg-red-500'

    return <Card className='w-[18rem] flex-col'>
        <div className='flex flex-row items-center'>
            <span>{name}</span>
            <div className={`rounded-full w-[1.6rem] h-[1.6rem] ml-[1rem] ${color}`} />
            <span className='ml-[0.4rem]'>{active ? 'Ativo' : 'Inativo'}</span>
        </div>
        <div className='text-[1.4rem] text-gray-500'>
            <span>Registro: {new Date(created_at).toLocaleDateString()}</span>
        </div>
    </Card>
}
