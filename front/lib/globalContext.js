import React from 'react';

const GlobalContext = React.createContext()

export default function GlobalContextProvider({ children }){

    const [pedidos, setPedidos] = React.useState([])
    const [Ruas, setRuas] = React.useState(require('~/config/enderecos.json').sort())
    const [Produtos, setProdutos] = React.useState(require('~/config/produtos.json'))
    const [entregadores, setEntregadores] = React.useState(require('~/config/entregadores.json'))

    return(
        <GlobalContext.Provider
            value={{
                Ruas,
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
        Ruas,
        setRuas,
        pedidos,
        Produtos,
        setPedidos,
        setProdutos,
        entregadores,
        setEntregadores,
    } = context

    return ({
        Ruas,
        setRuas,
        pedidos,
        Produtos,
        setPedidos,
        setProdutos,
        entregadores,
        setEntregadores,     
    })
}
