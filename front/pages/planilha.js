import React from 'react'
import instance from '~/lib/axiosConfig'
import { Button } from '@chakra-ui/button'
import Line from '~/components/planilha/Line'
import { Accordion } from '@chakra-ui/accordion'
import { useGlobalContext } from '~/lib/globalContext'
import styles from '~/styles/components/Planilha.module.less'
import { Box, Center, Divider, Flex, Text } from '@chakra-ui/layout'


export default function Planilha(props) {

    const {pedidos, Ruas, Produtos, entregadores, setPedidos, setRuas, setProdutos, setEntregadores} = useGlobalContext()
    const [lastUpdate, setLastUpdate] = React.useState(props.lastUpdate)
    const [task, setTask] = React.useState()

    React.useState(() => {
        setRuas(props.ruas)
        setPedidos(props.pedidos)
        setProdutos(props.produtos)
        setEntregadores(props.entregadores)
    }, [props.pedidos, props.ruas, props.entregadores, props.produtos])

    React.useEffect(() => {
        if(!task) {
            setTask(setTimeout(() => {
                const last = await instance.get('/pedidos/update')
                if(last.lastUpdate !== lastUpdate) {
                    setLastUpdate(last.lastUpdate)
                    const pedidos2 = await instance.get('/pedidos')
                    
                    const Pedidos = pedidos2.data.map((p, idx) => {
                        p.rua = ruas.data.find(r => r.Rua === p.rua)
                        if(!p.rua) p.rua = {Rua: '', min: 1, max: 10000}

                        if(idx >= pedidos.length) return p
                        return {
                            ...pedidos[idx],
                            ...p
                        }
                    })

                    setPedidos(Pedidos)
                }
            }, 1000))
        }
    }, [task])



    function handleChange(index, pedido) {
        
    }

    return (
        <>
        <Box className={styles.Planilha}>
            <Flex className={styles.Header}>
                <Text w='12rem'>Endereço</Text>
                <Text w='15rem'>Produtos</Text>
                <Text w='20rem'>Observações</Text>
                <Text w='10rem'>Entregador</Text>
                <Text w='35rem'>Estado do pedido</Text>
                <Text w='6rem'>Cartão</Text>
                <Text w='5rem'>Total</Text>
            </Flex>
            <Box className={styles.Body}>
                <Box>
                    {pedidos.map((pedido, idx) => 
                        <Line key={idx} index={idx*2} pedido={pedido} onChange={handleChange}/>
                    )}
                </Box>
                <Center>
                    <Button
                        h='10rem'
                        w='24rem'
                        mt='5rem'
                        bg='green'
                        color='#fff'
                        fontSize='28px'
                        borderRadius='30px'
                        onClick={async () => {
                            await instance.post('/pedido')
                            const Pedidos = await instance.get('/pedidos')
                            setPedidos(Pedidos.data)
                        }}
                        _hover={{ bg: 'green', cursor: 'pointer' }}
                        textShadow='1px 1px 2px #000, -1px -1px 2px, 1px -1px 2px, -1px 1px 2px #000'
                        _active={{ bg: 'green', transform: 'scale(0.95)' }}
                    >
                        Novo Pedido
                    </Button>
                </Center>
            </Box>
        </Box>
        <Center h='120rem'>
                oi
            </Center>
        </>
    )
}

export const getServerSideProps = async (context) => {

    let props = {}

    props.title = 'Planilha'

    try {
        const ruas = await instance.get('/enderecos')
        const pedidos = await instance.get('/pedidos')
        const produtos = await instance.get('/cardapio')
        const lastUpdate = await instance.get('/pedidos/update')
        const entregadores = await instance.get('/entregadores')

        const Pedidos = pedidos.data.map(p => {
            p.index = produtos.data[1].nome
            p.amount = 0

            p.rua = ruas.data.find(r => r.Rua === p.rua)
            if(!p.rua) p.rua = {Rua: '', min: 1, max: 10000}
            return p
        })

        produtos.data = Object.values(produtos.data).reduce((acc, p, idx) => {
            if(p.variacoes) acc = acc.concat(p.variacoes.map((v, idx2) => ({nome: v.nome, preco: v.preco, cod: `${idx+1}.${idx2+1}`})))
            else acc.push({...p, cod: `${idx+1}`})
            return acc
        }, [])

        props.ruas = ruas.data
        props.pedidos = Pedidos
        props.produtos = produtos.data
        props.entregadores = entregadores.data
        props.lastUpdate = lastUpdate.data.lastUpdate
    } catch (err) {
        console.log('ERROR')
        console.log(err)
    }

    return {
        props: props
    }
}
