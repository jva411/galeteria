import api from 'utils/axios'
import { state } from 'utils/providers/deliveryman'
import DeliverymanCard from 'components/card/deliveryman'


interface EntregadoresProps {
    deliverymans: Deliveryman[]
}


export default function Entregadores({ deliverymans }: EntregadoresProps) {
    if (state.length === 0) state.push(...deliverymans)

    return <>
        {state.map((deliveryman, idx) => <DeliverymanCard deliveryman={deliveryman} key={idx} />)}
    </>
}


export async function getServerSideProps() {
    const props: any = {
        title: 'Entregadores'
    }

    const data = await (await api.get('deliveryman')).data
    props.deliverymans = JSON.parse(data)

    return { props }
}
