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


const Expansion = ({ Pedido, handleChange }) => {

    const { Ruas, Produtos } = useGlobalContext()

    return (
        <Flex className={styles.PedidoDetails}>
            <Box>
                <Flex>
                    <InputPicker
                        className={styles.InputEndereco}
                        placeholder='Selecione a Rua'
                        defaultValue={Pedido.rua.Rua}
                        cleanable={false}
                        onChange={value => handleChange('rua', value)}
                        data={Ruas.map(rua => ({
                            label: rua.Rua,
                            value: rua
                        }))}
                    />

                    <NumberInput min={1} max={10000} defaultValue={Pedido.numero}>
                        <NumberInputField
                            className={styles.Numero}
                            placeholder='Número'
                            value={Pedido.numero}
                            onChange={e => handleChange('numero', e.target.value)}
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
                    {Object.keys(Pedido.produtos).filter(prod => Pedido.produtos[prod])
                        .map(prod => `${Pedido.produtos[prod]}x ${prod}:  ${(Number(Pedido.produtos[prod] * Produtos[prod])).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`)
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
                        defaultValue={Pedido.produto}
                        onChange={value => {
                            handleChange('produto', value.nome)
                            handleChange('amount', Pedido.produtos[value.nome])
                        }}
                        data={Produtos.map(prod => ({
                            label: prod.nome,
                            value: prod
                        }))}
                    />
                    <NumberInput
                        min={0}
                        max={100}
                        h='fit-content'
                        value={Pedido.amount}
                        onChange={value => {
                            value = Number(value)
                            Pedido.produtos[Pedido.produto] = value
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
                <Button className={styles.LimparProdutos} onClick={() => handleChange('produtos', Object.keys(Pedido.produtos).reduce((acc, prod) => Object.assign(acc, {[prod]: 0}), {}))}>
                    Limpar produtos
                </Button>
            </Box>

            <Textarea
                placeholder='Observações'
                value={Pedido.observacoes}
                className={styles.InputObs}
                onChange={e => handleChange('observacoes', e.target.value)}
            />
        </Flex>
    )
}


export default React.memo(Expansion)
