import React from 'react'
import lodash from 'lodash'
import { useGlobalContext } from '~/lib/globalContext'
import styles from '~/styles/components/Planilha.module.less'
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { InputPicker } from 'rsuite'
import {
    Flex, Text, Box, RadioGroup, Radio, Menu, MenuButton, MenuList, MenuItem, MenuDivider, MenuOptionGroup, MenuItemOption,
    Checkbox, Divider, Button, AccordionItem, AccordionButton, AccordionIcon, Accordion, AccordionPanel, List, ListItem,
    Wrap, WrapItem, Center, IconButton, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Input, Textarea,
    Image, Tooltip, HStack
} from '@chakra-ui/react'


const Expansion = ({ Pedido, handleChange, index }) => {

    const { Ruas, Produtos } = useGlobalContext()

    let customClassName = styles.InputEndereco
    if(Pedido.rua && Pedido.rua.Rua) customClassName = styles.InputValuedEndereco

    return (
        <Flex className={styles.PedidoDetails}>
            <Box>
                <Flex>
                    <InputPicker
                        className={styles.InputEndereco}
                        placeholder='Selecione a Rua'
                        value={Pedido.rua}
                        cleanable={false}
                        onSelect={value => {
                            if(!value) return
                            let n = Pedido.numero
                            if(n < value.min) n = value.min
                            else if(n > value.max) n = value.max
                            handleChange('rua', value)
                            if(n !== Pedido.numero) handleChange('numero', n)
                        }}
                        data={Ruas.map(rua => ({
                            label: rua.Rua,
                            value: rua
                        }))}
                    />

                    <NumberInput min={Pedido.rua.min} max={Pedido.rua.max} defaultValue={Pedido.numero} /*onChange={e => console.log(e)}*/ >
                        <NumberInputField
                            className={styles.Numero}
                            placeholder='Número'
                            value={Pedido.numero}
                            inputMode='decimal'
                            onChange={e => {
                                let n = Math.floor(Number(e.target.value))
                                if(n > Pedido.rua.max) n = Pedido.rua.max
                                else if (n < Pedido.rua.min) n = Pedido.rua.min
                                handleChange('numero', n)
                            }}
                        />
                    </NumberInput>
                </Flex>

                <Input
                    className={styles.Complemento}
                    placeholder='Complemento'
                    value={Pedido.complemento}
                    onChange={e => handleChange('complemento', e.target.value)}
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
                        placeholder='Produto'
                        value={Pedido.produto}
                        onSelect={value => {
                            if(!value) return

                            let idx = 0
                            while(idx < Pedido.produtos.length)
                                if(Pedido.produtos[idx].nome === Pedido.produto.nome) break
                                else idx++

                            if(idx < Pedido.produtos.length && Pedido.produtos[idx].quantidade === 0) Pedido.produtos.splice(idx, 1)
                            let amount = 0
                            const has = Pedido.produtos.find(p => p.nome === value.nome)
                            if(has) amount = has.quantidade
                            handleChange('produto', value)
                            handleChange('amount', amount)
                        }}
                        data={Produtos.map(prod => ({
                            label: `${prod.cod} - ${prod.nome}`,
                            value: prod
                        }))}
                    />
                    <NumberInput
                        min={0}
                        max={100}
                        h='fit-content'
                        value={Pedido.amount}
                        onChange={value => {
                            value = Math.floor(Number(value))
                            const has = Pedido.produtos.find(x => x.nome === Pedido.produto.nome)
                            if(has) has.quantidade = value
                            else {
                                const Prod = {...Produtos.find(x => x.nome === Pedido.produto.nome)}
                                Prod.quantidade = value
                                Pedido.produtos.push(Prod)
                            }
                            console.log(Pedido.produtos)
                            handleChange('amount', value)
                        }}
                    >
                        <NumberInputField
                            placeholder='Quantidade'
                            className={styles.InputProdutoQntd}
                        />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </Flex>
                <Button className={styles.LimparProdutos} onClick={() => handleChange('produtos', [])}>
                    Limpar produtos
                </Button>
            </Box>

            <Textarea
                placeholder='Observações'
                value={Pedido.observacoes}
                className={styles.InputObs}
                onChange={e => handleChange('observacoes', e.target.value)}
            />

            <Flex className={styles.Troco}>
                <label htmlFor={`troco-${index}`}>Troco:</label>
                <NumberInput min={0}>
                    <NumberInputField
                        id={`troco-${index}`}
                        className={styles.Numero}
                        placeholder='Troco'
                        onChange={e => handleChange('troco', Number(e.target.value))}
                    />
                </NumberInput>
            </Flex>
        </Flex>
    )
}


export default React.memo(Expansion)
