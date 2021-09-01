import React from 'react'
import lodash from 'lodash'
import api from '~/lib/axiosConfig'
import { FaFilter } from 'react-icons/fa'
import { Button } from '@chakra-ui/button'
import Line from '~/components/planilha/Line'
import { Accordion } from '@chakra-ui/accordion'
import { useGlobalContext } from '~/lib/globalContext'
import styles from '~/styles/components/Planilha.module.less'
import RelatorioDiario from '~/components/planilha/RelatorioDiario'
import { Box, Center, Divider, Flex, Text } from '@chakra-ui/layout'
import { Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const states = {
    naoSaiu: 'Novo',
    saiu: 'Em Rota',
    entregue: 'Entregue',
    erro: 'Erro',
    cancelou: 'Cancelou'
}


export default function Planilha(props) {

    const {pedidos, Ruas, Produtos, entregadores, setPedidos, setRuas, setProdutos, setEntregadores} = useGlobalContext()
    const [Props, setProps] = React.useState({
        lastUpdate: props.lastUpdate,
        entregadorFiltro: '',
        estadoFiltro: ''
    })

    React.useState(() => {
        setRuas(props.ruas)
        setPedidos(props.pedidos)
        setProdutos(props.produtos)
        setEntregadores(props.entregadores)
        Props.pedidosFiltrados = props.pedidos
        setProps({...Props})
    }, [props.pedidos, props.ruas, props.entregadores, props.produtos])

    React.useEffect(async () => {
        let last = (await api.get('/pedidos/update')).data.lastUpdate
        while(last === Props.lastUpdate) {
            await sleep(1000)
            last = await (await api.get('/pedidos/update')).data.lastUpdate
        }

        const pedidos2 = await api.get('/pedidos')
        const Enderecos = await api.get('/enderecos')

        const Pedidos = pedidos2.data.map((p, idx) => {

            if(p.rua) p.rua = Enderecos.data.ruas.find(r => r.Rua === p.rua)
            if(!p.rua) p.rua = {Rua: '', min: 1, max: 10000}
            
            if(idx >= pedidos.length) return p
            return {
                ...pedidos[idx],
                ...p
            }
        })

        Props.lastUpdate = last
        setProps({...Props})
        setPedidos(Pedidos)
        setRuas(Enderecos.data)
    }, [Props.lastUpdate])


    async function handleChanges(keys=[], values=[]) {
        for (let i in keys)
            Props[keys[i]] = values[i]
        
        if (keys.length) {
            setProps({...Props})
        }
    }

    if(lodash.isEmpty(pedidos) || lodash.isEmpty(entregadores) || lodash.isEmpty(Produtos) || lodash.isEmpty(Ruas)) return <></>

    return (
        <>
            <Box className={styles.Planilha}>
                <Flex className={styles.Header}>
                    <Text w='12rem'>Endereço</Text>
                    <Text w='15rem'>Produtos</Text>
                    <Text w='20rem'>Observações</Text>
                    <Menu>
                        {({isOpen}) => (
                            <>
                                <MenuButton
                                    className={styles.FilterOption}
                                    as={Button}
                                    rightIcon={<FaFilter />}
                                >
                                    {Props.entregadorFiltro ? Props.entregadorFiltro : 'Entregador'}
                                </MenuButton>
                                <MenuList>
                                    <MenuOptionGroup type='radio' onChange={value => handleChanges(['entregadorFiltro'], [value])}>
                                        <MenuItemOption value={''}>
                                            Limpar Filtro
                                        </MenuItemOption>
                                        {entregadores.map((entr, index) =>
                                            <MenuItemOption key={index} value={entr}>
                                                {entr}
                                            </MenuItemOption>
                                        )}
                                    </MenuOptionGroup>
                                </MenuList>
                            </>
                        )}
                    </Menu>
                    <Menu>
                        {({isOpen}) => (
                            <>
                                <Center className={styles.EstadoHeader}>
                                    <MenuButton
                                        className={styles.FilterOption}
                                        as={Button}
                                        rightIcon={<FaFilter />}
                                    >
                                        {Props.estadoFiltro ? states[Props.estadoFiltro] : 'Estado do pedido'}
                                    </MenuButton>
                                </Center>
                                <MenuList>
                                    <MenuOptionGroup type='radio' onChange={value => handleChanges(['estadoFiltro'], [value])}>
                                        <MenuItemOption value={''}>
                                            Limpar Filtro
                                        </MenuItemOption>
                                        {Object.keys(states).map((state, index) =>
                                            <MenuItemOption key={index} value={state}>
                                                {states[state]}
                                            </MenuItemOption>
                                        )}
                                    </MenuOptionGroup>
                                </MenuList>
                            </>
                        )}
                    </Menu>
                    <Text w='6rem'>Cartão</Text>
                    <Text w='5rem'>Total</Text>
                </Flex>
                <Box className={styles.Body}>
                    <Box>
                        {pedidos.map((pedido, idx) => 
                            <Line key={idx} index={idx*2} pedido={pedido} planilha={Props}/>
                        )}
                    </Box>
                    <Center>
                        <Button
                            h='10rem'
                            w='24rem'
                            mt='5rem'
                            bg='green'
                            color='#fff'
                            fontSize='2.8rem'
                            borderRadius='3rem'
                            onClick={async () => {
                                await api.post('/pedido/1')
                                // const Pedidos = await instance.get('/pedidos')
                                // setPedidos(Pedidos.data)
                            }}
                            _hover={{ bg: 'green', cursor: 'pointer' }}
                            textShadow='0.1rem 0.1rem 0.2rem #000, -0.1rem -0.1rem 0.2rem, 0.1rem -0.1rem 0.2rem, -0.1rem 0.1rem 0.2rem #000'
                            _active={{ bg: 'green', transform: 'scale(0.95)' }}
                        >
                            Novo Pedido
                        </Button>
                    </Center>
                    <RelatorioDiario />
                </Box>
            </Box>
        </>
    )
}

export const getServerSideProps = async (context) => {

    let props = {}

    props.title = 'Planilha'

    try {
        const ruas = await api.get('/enderecos')
        const pedidos = await api.get('/pedidos')
        const produtos = await api.get('/cardapio')
        const lastUpdate = await api.get('/pedidos/update')
        const entregadores = await api.get('/entregadores')

        const Pedidos = pedidos.data.map(p => {
            if(p.rua) p.rua = ruas.data.ruas.find(r => r.Rua === p.rua)
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
