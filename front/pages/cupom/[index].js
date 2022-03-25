import api from '~/lib/axiosConfig'
import Cupom from "~/components/cupom"

export default function CupomPage(props) {
    return <Cupom {...props} />
}


export const getServerSideProps = async (context) => {
    let props = {}

    props.title = 'Cupom'
    props.hideMenus = true

    const pedido = await api.get(`/pedido/${context.query.index}`)
    props.pedido = pedido.data

    return {
        props: props
    };
};