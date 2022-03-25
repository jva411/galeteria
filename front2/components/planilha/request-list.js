/* eslint-disable react-hooks/exhaustive-deps */
import RequestItem from './request-item'
import { useState, useEffect } from 'react'


export default function RequestList({ styles }) {

    const [state, setState] = useState({
        pedidos: Array(200).fill({})
    })

    console.log(state.pedidos)

    return (
        <div className={styles.requestList}>
            {state.pedidos.map((pedido, index) => (
                <RequestItem key={index} pedido={pedido} />
            ))}
        </div>
    )

}

