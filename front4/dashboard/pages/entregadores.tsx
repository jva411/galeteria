import api from 'utils/axios'
import AddButton from 'components/button/add'
import useForceUpdate from 'utils/force-update'
import { deliverymanState } from 'utils/providers/deliveryman'
import DeliverymanCard from 'components/card/deliveryman'
import RegisterDeliverymanModal, { controls } from 'components/modal/register-deliveryman'


interface EntregadoresProps {
    deliverymans: Deliveryman[]
}


export default function Entregadores({ deliverymans }: EntregadoresProps) {
    if (deliverymanState.data.length === 0) deliverymanState.data.push(...deliverymans)
    const forceUpdate = useForceUpdate()
    deliverymanState.listeners['Entregadores'] = () => forceUpdate()

    return <>
        <div className='flex flex-wrap items-center p-[2rem] [&>*]:mb-[2rem] [&>*]:mr-[2rem]'>
            {deliverymanState.data.map((deliveryman, idx) => <DeliverymanCard deliveryman={deliveryman} key={idx} />)}
            <AddButton onClick={() => controls.open({name: '', onClose: () => {}})} />
        </div>
        <RegisterDeliverymanModal />
    </>
}


export async function getServerSideProps() {
    const props = {
        title: 'Entregadores',
        deliverymans: [] as Deliveryman[]
    }

    const data = await (await api.get('deliveryman')).data
    props.deliverymans = JSON.parse(data)

    return { props }
}
