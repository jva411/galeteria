import React from 'react'
import lodash from 'lodash'
import instance from '~/lib/axiosConfig'
import PedidoDetails from './PedidoDetails'
import { useGlobalContext } from '~/lib/globalContext'
import { openContext } from '~/components/context-menu'
import styles from '~/styles/components/Planilha.module.less'
import { AddIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import {
    Flex, Text, Box, RadioGroup, Radio, Menu, MenuButton, MenuList, MenuItem, MenuDivider, MenuOptionGroup, MenuItemOption,
    Checkbox, Divider, Button, AccordionItem, AccordionButton, AccordionIcon, Accordion, AccordionPanel, List, ListItem,
    Wrap, WrapItem, Center, IconButton, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Input, Textarea,
    Image, Tooltip, HStack, useDisclosure, Collapse
} from '@chakra-ui/react'


const states = {
    naoSaiu: '#FFFCDE',
    saiu: '#59C4CD',
    entregue: '#A2DA8F',
    erro: '#DEB122',
    cancelou: '#DE695D'
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let ignore = false


const Line = ({ pedido, index, planilha }) => {

    // console.log(pedido)
    // console.log('a')
    const { entregadores, Ruas, Produtos } = useGlobalContext()
    const [Props, setProps] = React.useState({
        Pedido: pedido,
        lastUpdate: pedido.lastUpdate,
        isOpen: false
    })

    React.useEffect(() => {
        if(!lodash.isEqual(Props.Pedido, pedido)) {
            Props.Pedido = pedido
            setProps({...Props})
        }
    }, [pedido])

    React.useEffect(async () => {
        let update = (await instance.get(`/pedido/${index/2}/update`)).data.update
        while(Props.lastUpdate === update){
            await sleep(1000)
            update = (await instance.get(`/pedido/${index/2}/update`)).data.update
        }
        if(ignore){
            ignore = false
            return
        }

        const pedido = await instance.get(`/pedido/${index/2}`)
        pedido.data.rua = Ruas.ruas.find(r => r.Rua === pedido.data.rua)
        if(!pedido.data.rua) pedido.data.rua = {Rua: '', min: 1, max: 10000}
        Props.Pedido = {
            ...Props.Pedido,
            ...pedido.data
        }
        Props.lastUpdate = update
        setProps({...Props})
    }, [Props.lastUpdate])


    async function handleChange(key, value) {
        const p = {...Props.Pedido}

        if(typeof key !== 'undefined') p[key] = value
        p.total = p.taxaEntrega + p.taxaCartao

        const prods = p.produtos.filter(x => x.quantidade > 0)
        for(let P of prods) p.total += P.preco * P.quantidade

        Props.Pedido = {...p}

        p.produtos = prods
        p.rua = Props.Pedido.rua.Rua
        delete p.produto
        delete p.amount
        delete p.index

        const lu = await instance.put(`/pedido/${index/2}`, p)
        ignore = true
        Props.lastUpdate = lu.data.lastUpdate
        // console.log(Props.Pedido.observacoes)
        setProps({...Props})
    }

    function handleClick(e) {
        Props.isOpen = !Props.isOpen;
        setProps({...Props})
    }

    /**
     * @param {React.KeyboardEvent<HTMLDivElement>} e 
     */
    function handleKeyUp(e) {
        const parent = e.target.parentElement
        const n = parent.children.length
        // console.log(e.key)
        if (e.key === 'ArrowDown' && index < n - 2) {
            const next = e.ctrlKey ? n - 2 : index + 2
            parent.children[next].focus()
            e.preventDefault()
        } else if (e.key === 'ArrowUp' && index > 0) {
            const next = e.ctrlKey ? 0 : index - 2
            parent.children[next].focus()
            e.preventDefault()
        } else if (e.key === 'ArrowRight') {
            if(!Props.isOpen){
                Props.isOpen = true
                setProps({...Props})
            }
            e.preventDefault()
        } else if (e.key === 'ArrowLeft') {
            if(Props.isOpen){
                Props.isOpen = false
                setProps({...Props})
            }
            e.preventDefault()
        } else if (e.key === ' ' || e.key === 'Enter') {
            Props.isOpen = !Props.isOpen
            setProps({...Props})
            e.preventDefault()
        }
    }

    async function imprimir() {
        const pedido2 = {...Props.Pedido}
        pedido2.index = index/2 + 1
        await instance.put('/impressao', {Pedido: pedido2})
        window.open('/cupom', '_blank')
    }

    /**
     * @param {React.MouseEvent<HTMLDivElement>} e 
     */
    function handleContextMenu(e) {
        e.preventDefault()
        const xPos = e.pageX + 'px'
        const yPos = e.pageY + 'px'

        const options = [
            {
                label: 'Imprimir',
                handle: imprimir
            }
        ]

        openContext({
            xPos,
            yPos,
            options,
            isOpen: true
        })
    }





    const stopEvents = {
        onClick: e => e.stopPropagation(),
        onKeyDown: e => e.stopPropagation()
    }

    if(!Props.Pedido.rua) Props.Pedido.rua = {Rua: '', min: 1, max: 1000}
    if(!Props.Pedido.produto) Props.Pedido.produto = {label: 'Selecione um produto', value: {quantidade: 0}}

    if(planilha.entregadorFiltro || planilha.estadoFiltro) {
        if(!Props.Pedido.rua.Rua) return <></>
        if(planilha.entregadorFiltro && planilha.entregadorFiltro !== Props.Pedido.entregador) return <></>
        if(planilha.estadoFiltro && planilha.estadoFiltro !== Props.Pedido.estado) return <></>
    }

    return (
        <>
            <Flex className={styles.Line} bg={states[Props.Pedido.estado]} onClick={handleClick} onContextMenu={handleContextMenu} onKeyDown={handleKeyUp} tabIndex={0}>
                <Text className={styles.Ordem}>
                    {index/2 + 1}
                </Text>
                <Text className={styles.endereco}>
                    {`${Props.Pedido.rua.Rua}, ${Props.Pedido.numero} - ${Props.Pedido.complemento}`}
                </Text>

                <Text className={styles.produtos}>
                    {Props.Pedido.produtos.filter(prod => prod.quantidade).map(prod => `${prod.quantidade}x ${prod.nome}`).join(' | ')}
                </Text>

                <Text className={styles.observacoes}>
                    {Props.Pedido.observacoes}
                </Text>

                <Menu>
                    {({ isOpen }) => (
                        <>
                            <Box className={styles.entregador} {...stopEvents}>
                                <MenuButton as={Button} rightIcon={isOpen? <ChevronUpIcon /> : <ChevronDownIcon />}>
                                    {Props.Pedido.entregador}
                                </MenuButton>
                            </Box>
                            <MenuList pos='absolute' {...stopEvents}>
                                <MenuOptionGroup type='radio' onChange={value => handleChange('entregador', value)}>
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

                <RadioGroup className={styles.estado} value={Props.Pedido.estado} onChange={value => handleChange('estado', value)} {...stopEvents}>
                    <HStack spacing='1rem'>
                        <Radio value='naoSaiu'>Novo</Radio>
                        <Radio value='saiu'>Em Rota</Radio>
                        <Radio value='erro'>Erro</Radio>
                        <Radio value='cancelou'>Cancelou</Radio>
                        <Radio value='entregue'>Entregue</Radio>
                    </HStack>
                </RadioGroup>

                <Flex className={styles.cartao} {...stopEvents}>
                    <Checkbox isChecked={Props.Pedido.isCartao} onChange={e => handleChange('isCartao', e.target.checked)} />
                </Flex>

                <Text className={styles.total}>
                    {'R$' + Props.Pedido.total.toFixed(2)}
                </Text>
            </Flex>
            <Collapse in={Props.isOpen} animateOpacity className={styles.Collapse}>
                <PedidoDetails Pedido={Props.Pedido} handleChange={handleChange} index={index/2} imprimir={imprimir} />
            </Collapse>
        </>
    )
}


export default Line
