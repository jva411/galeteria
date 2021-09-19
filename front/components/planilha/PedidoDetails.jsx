import React from 'react'
import lodash from 'lodash'
import { InputPicker } from 'rsuite'
import { FiPrinter } from 'react-icons/fi'
import { useGlobalContext } from '~/lib/globalContext'
import styles from '~/styles/components/Planilha.module.less'
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons'
import {
    Flex, Text, Box, RadioGroup, Radio, Menu, MenuButton, MenuList, MenuItem, MenuDivider, MenuOptionGroup, MenuItemOption,
    Checkbox, Divider, Button, AccordionItem, AccordionButton, AccordionIcon, Accordion, AccordionPanel, List, ListItem,
    Wrap, WrapItem, Center, IconButton, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Input, Textarea,
    Image, Tooltip, HStack, Spacer
} from '@chakra-ui/react'
import { openPopup } from '../confirmation-popup'


/**
 * @param {string} str
 * 
 * @returns {string}
 */
function sanitize(str) {
    return str.toLowerCase()
        .replace(/[áâàäã]/gu, 'a')
        .replace(/[éêèë]/gu, 'e')
        .replace(/[íîìï]/gu, 'i')
        .replace(/[óôòöõ]/gu, 'o')
        .replace(/[úûùü]/gu, 'u') // ç -> c,  ý -> y
        .replace(/[ýÿ]/gu, 'y')
        .replace(/[^a-z 0-9\n]/gu, '')
}


let task = null


function searchBy(key, label) {
    const str1 = sanitize(key)
    const str2 = sanitize(label)
    return str2.match(new RegExp(str1.split('').join('.{0,6}')))
}
let delay = Date.now()


const Expansion = ({ Pedido, handleChange, index, imprimir }) => {

    const { Ruas, Produtos } = useGlobalContext()
    const [state, setState] = React.useState({
        observacoes: Pedido.observacoes,
        complemento: Pedido.complemento
    })
    const ref = React.useRef()


    let customClassName = styles.InputEndereco
    if(Pedido.rua && Pedido.rua.Rua) customClassName = styles.InputValuedEndereco
    const keys = Object.keys(state)


    function handleLocalChange(key, value) {
        if (keys.includes(key)) {
            if (task) clearTimeout(task)
            state[key] = value
            setState({...state})
            task = setTimeout(() => {
                handleChange(key, value)
            }, 400)
        } else handleChange(key, value)
    }

    function limparProdutos() {
        openPopup({
            message: 'Você deseja realmente limpar a lista de produtos deste pedido?',
            action: 'Limpar',
            confirmation: () => handleLocalChange('produtos', []),
            ref: ref
        })
    }

    React.useEffect(() => {
        for (let key of keys) {
            state[key] = Pedido[key]
        }
        setState({...state})
    }, keys.map(key => Pedido[key]))


    return (
        <Flex className={styles.PedidoDetails}>
            <Box>
                <Flex>
                    <InputPicker
                        className={styles.InputEndereco}
                        placeholder='Selecione a Rua'
                        value={Pedido.rua}
                        cleanable={false}
                        searchBy={searchBy}
                        onSelect={value => {
                            if(!value) return
                            let n = Pedido.numero
                            if(n < value.min) n = value.min
                            else if(n > value.max) n = value.max
                            handleLocalChange('rua', value)
                            if(n !== Pedido.numero) handleLocalChange('numero', n)
                        }}
                        data={Ruas.ruas.map(rua => ({
                            label: rua.Rua,
                            value: rua
                        }))}
                    />

                    <NumberInput min={Pedido.rua.min} max={Pedido.rua.max} defaultValue={Pedido.numero} >
                        <NumberInputField
                            className={styles.Numero}
                            placeholder='Número'
                            value={Pedido.numero}
                            inputMode='decimal'
                            onChange={e => {
                                let n = Math.floor(Number(e.target.value))
                                if(n > Pedido.rua.max) n = Pedido.rua.max
                                else if (n < Pedido.rua.min) n = Pedido.rua.min
                                handleLocalChange('numero', n)
                            }}
                        />
                    </NumberInput>
                </Flex>

                <Input
                    className={styles.Complemento}
                    placeholder='Complemento'
                    value={state.complemento}
                    onChange={e => handleLocalChange('complemento', e.target.value)}
                />
            </Box>

            <Flex className={styles.ProdutosList}>
                <Text>
                    {Pedido.produtos.filter(prod => prod.quantidade).map(prod => (
                        `${prod.quantidade}x ${prod.nome}:  ${(Number(prod.quantidade * prod.preco)).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`))
                        .join('\n')
                    }
                </Text>
            </Flex>
            <Box>
                <Flex>
                    <InputPicker
                        className={styles.InputProduto}
                        cleanable={false}
                        searchBy={searchBy}
                        placeholder='Produto'
                        value={(() => {
                            const v = {...Pedido.produto.value}
                            delete v.quantidade
                            return v
                        })()}
                        onSelect={value => {
                            if(!value) return
                            value.quantidade = 0

                            const has = Pedido.produtos.find(p => p.nome === value.nome)
                            if(has) handleLocalChange('produto', {label: has.nome, value: has})
                            else handleLocalChange('produto', {label: value.nome, value: value})
                        }}
                        data={Produtos.map(prod => ({
                            label: `${prod.cod} - ${prod.nome}`,
                            value: {...prod}
                        }))}
                    />
                    <Input
                        className={styles.InputProdutoQntd}
                        placeholder='Quantidade'
                        value={Pedido.produto.value.quantidade}
                        onChange={e => {
                            if(Pedido.produto.label === 'Selecione um produto') return

                            let v = e.target.value.replace(/\D/gu, '')
                            if(`${Pedido.produto.value.quantidade}`.length - v.length === -1) {
                                const start = e.target.selectionStart
                                v = v.slice(0, start) + v.slice(start+1, v.length)
                                setTimeout(() => e.target.setSelectionRange(start, start), 1)
                            }
                            let value = Math.floor(Number(v))
                            if(value < 0) value = 0
                            if(value > 200) value = 200

                            const last = Pedido.produto.value.quantidade
                            Pedido.produto.value.quantidade = value
                            const has = Pedido.produtos.find(x => x.nome === Pedido.produto.label)
                            if(has) has.quantidade = value
                            if(last === value) return;
                            if(value === 0) Pedido.produtos.splice(Pedido.produtos.findIndex(x => x.nome === Pedido.produto.value.nome), 1)
                            else if(last === 0) Pedido.produtos.push(Pedido.produto.value)
                            handleLocalChange()
                        }}
                    />
                </Flex>
                <Button className={styles.LimparProdutos} onClick={limparProdutos} ref={ref}>
                    Limpar produtos
                </Button>
            </Box>

            <Textarea
                placeholder='Observações'
                maxLength={300}
                className={styles.InputObs}
                value={state.observacoes}
                onChange={e => handleLocalChange('observacoes', e.target.value)}
            />

            <Flex className={styles.Troco}>
                <label htmlFor={`troco-${index}`}>Troco:</label>
                <NumberInput min={0}>
                    <NumberInputField
                        id={`troco-${index}`}
                        className={styles.Numero}
                        placeholder='Troco'
                        onChange={e => handleLocalChange('troco', Number(e.target.value))}
                    />
                </NumberInput>
            </Flex>

            <Spacer />
            <IconButton
                className={styles.printButton}
                title='Imprimir'
                variant='ghost'
                onClick={imprimir}
                icon={<FiPrinter />}
            />
        </Flex>
    )
}


export default React.memo(Expansion)
