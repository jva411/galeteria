import { useState } from 'react'


export default function RequestItem({ pedido }) {

    const [state, setState] = useState({
        pedido: pedido
    })

    pedido.setPedido = pedido => {
        setState({ ...state, pedido: pedido })
    }
    
    return (
        <div></div>
    )
}
