import React from 'react';

const GlobalContext = React.createContext()

export default function GlobalContextProvider({ children }){

    const [pedidos, setPedidos] = React.useState([])
    const [Ruas, setRuas] = React.useState([])
    const [Produtos, setProdutos] = React.useState([])
    const [entregadores, setEntregadores] = React.useState([])
    const [id, setId] = React.useState('')

    return(
        <GlobalContext.Provider
            value={{
                id,
                Ruas,
                setId,
                setRuas,
                pedidos,
                Produtos,
                setPedidos,
                setProdutos,
                entregadores,
                setEntregadores,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export function useGlobalContext(){
    const context = React.useContext(GlobalContext)

    const {
        id,
        Ruas,
        setId,
        setRuas,
        pedidos,
        Produtos,
        setPedidos,
        setProdutos,
        entregadores,
        setEntregadores,
    } = context

    return ({
        id,
        Ruas,
        setId,
        setRuas,
        pedidos,
        Produtos,
        setPedidos,
        setProdutos,
        entregadores,
        setEntregadores,     
    })
}
