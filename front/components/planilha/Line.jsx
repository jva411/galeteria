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


const Line = ({ pedido, index, onChange }) => {

    // console.log(pedido)
    // console.log('a')
    const { entregadores, Produtos } = useGlobalContext()
    const [Pedido, setPedido] = React.useState(pedido)
    const [task, setTask] = React.useState()
    const [lastUpdate, setLastUpdate] = React.useState(pedido.lastUpdate)
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

    React.useEffect(() => {
        if(!task) {
            setTask(setInterval(async () => {
                const update = (await instance.get(`/pedido/${index/2}/update`)).data.update
                if(update !== lastUpdate){
                    setLastUpdate(update)
                    const pedido = await instance.get(`/pedido/${index/2}`)
                    pedido.data.rua = ruas.find(r => r.Rua === pedido.data.rua)
                    if(!pedido.data.rua) pedido.data.rua = {Rua: '', min: 1, max: 10000}
                    setPedido({
                        ...Pedido,
                        ...pedido.data
                    })
                }
            }, 1000))
        }
    }, [task])


    async function handleChange(key, value) {
        Pedido[key] = value
        Pedido.total = Pedido.taxaEntrega + Pedido.taxaCartao

        const prods = Pedido.produtos.filter(x => x.quantidade > 0)
        prods.map(p => Pedido.total += p.preco * p.quantidade)
        
        setPedido({ ...Pedido })


        const Pedido2 = {
            ...Pedido,
            produtos: prods,
            rua: Pedido.rua.Rua
        }
        delete Pedido2.produto
        delete Pedido2.amount

        await instance.put(`/pedido/${index/2}`, Pedido2)
    }

    function handleClick(e) {
        onToggle();
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
            onOpen()
            e.preventDefault()
        } else if (e.key === 'ArrowLeft') {
            onClose()
            e.preventDefault()
        } else if (e.key === ' ' || e.key === 'Enter') {
            onToggle()
            e.preventDefault()
        }
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
                handle: async () => {
                    const pedido2 = {...Pedido}
                    pedido2.index = index/2 + 1
                    await instance.put('/impressao', {Pedido: pedido2})
                    window.open('/cupom', '_blank')
                }
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


    return (
        <>
            <Flex className={styles.Line} bg={states[Pedido.estado]} onClick={handleClick} onContextMenu={handleContextMenu} onKeyDown={handleKeyUp} tabIndex={0}>
                <Text className={styles.Ordem}>
                    {index/2 + 1}
                </Text>
                <Text className={styles.endereco}>
                    {`${Pedido.rua.Rua}, ${Pedido.numero} - ${Pedido.complemento}`}
                </Text>

                <Text className={styles.produtos}>
                    {Pedido.produtos.filter(prod => prod.quantidade).map(prod => `${prod.quantidade}x ${prod.nome}`).join(' | ')}
                </Text>

                <Text className={styles.observacoes}>
                    {Pedido.observacoes}
                </Text>

                <Menu closeOnSelect={false}>
                    {({ isOpen }) => (
                        <>
                            <Box className={styles.entregador} {...stopEvents}>
                                <MenuButton as={Button} rightIcon={isOpen? <ChevronUpIcon /> : <ChevronDownIcon />}>
                                    {Pedido.entregador}
                                </MenuButton>
                            </Box>
                            <MenuList pos='absolute'  {...stopEvents}>
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

                <RadioGroup className={styles.estado} value={Pedido.estado} onChange={value => handleChange('estado', value)} {...stopEvents}>
                    <HStack spacing='1rem'>
                        <Radio value='naoSaiu'>Novo</Radio>
                        <Radio value='saiu'>Em Rota</Radio>
                        <Radio value='erro'>Erro</Radio>
                        <Radio value='cancelou'>Cancelou</Radio>
                        <Radio value='entregue'>Entregue</Radio>
                    </HStack>
                </RadioGroup>

                <Flex className={styles.cartao} {...stopEvents}>
                    <Checkbox isChecked={Pedido.isCartao} onChange={e => handleChange('isCartao', e.target.checked)} />
                </Flex>

                <Text className={styles.total}>
                    {'R$' + Pedido.total.toFixed(2)}
                </Text>
            </Flex>
            <Collapse in={isOpen} animateOpacity className={styles.Collapse}>
                <PedidoDetails Pedido={Pedido} handleChange={handleChange} index={index/2} />
            </Collapse>
        </>
    )
}


export default Line
