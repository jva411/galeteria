import lodash from 'lodash'
import api from '~/lib/axiosConfig'
import React, { useState, useEffect } from 'react'
import styles from '~/styles/components/Planilha.module.less'
import { Box, SimpleGrid, Text, Flex, Input } from '@chakra-ui/react'


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let ignore = false


export default function RelatorioDiario(){

    const [props, setProps] = useState({
        pedidos: {},
        trocos: {},
        produtos: {},
        flag: false
    })



    async function update() {
        try {
            const res = await api.get('/pedidos/important')
            props.pedidos = lodash.groupBy(res.data.filter(p => p.estado === 'entregue'), p => p.entregador)
            Object.keys(props.pedidos).map(x => props.trocos[x] = 105)
            props.flag = true
            props.produtos = {}
            res.data.map(p => p.produtos.map(P => {
                let P2 = props.produtos[P.nome]
                if (P2) P2.total += P.quantidade
                else {
                    P2 = {
                        total: P.quantidade,
                        preco: P.preco,
                        faltam: 0
                    }
                    props.produtos[P.nome] = P2
                }
                if (p.estado === 'naoSaiu') P2.faltam += P.quantidade
                else if (p.estado === 'cancelou') delete props.produtos[P.nome]
            }))
            setProps({...props})
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(update, [true])

    useEffect(async () => {
        if(props.flag) {
            await sleep(3000)
            if(ignore) return
            await update()
        }
    }, [props])


    return (
        <>
            <SimpleGrid className={styles.RelatorioDiario}>
                {Object.keys(props.pedidos).map((entr, idx) => {
                    const pedidos = props.pedidos[entr]
                    let cartao = 0
                    let dinheiro = 0
                    let troco = props.trocos[entr]
                    
                    for (let x of pedidos) {
                        if(x.isCartao) cartao += x.total
                        else dinheiro += x.total
                    }
                    let total = cartao + dinheiro + troco

                    return (
                        <Box key={idx} className={styles.EntregadorResumo}>
                            <Text className={styles.EntregadorTitle}>{entr}</Text>
                            <Flex className={styles.EntregadorResumoLinha}>
                                <Text>Total:</Text>
                                <Text>{`R$ ${total.toFixed(2)}`}</Text>
                            </Flex>
                            <Flex className={styles.EntregadorResumoLinha}>
                                <Text>Dinheiro:</Text>
                                <Text>{`R$ ${dinheiro.toFixed(2)}`}</Text>
                            </Flex>
                            <Flex className={styles.EntregadorResumoLinha}>
                                <Text>Cartão:</Text>
                                <Text>{`R$ ${cartao.toFixed(2)}`}</Text>
                            </Flex>
                            <Flex className={styles.EntregadorResumoLinha}>
                                <Text>Troco:</Text>
                                <Input
                                    value={`R$ ${troco.toFixed(2)}`}
                                    onChange={e => {
                                        ignore = true
                                        props.trocos[entr] = Number(e.target.value.match(/\d+(\.{1}\d{2})?/gu, '')[0])
                                        setProps({...props})
                                    }}
                                />
                            </Flex>
                            <Flex className={styles.EntregadorResumoLinha}>
                                <Text>Nº de entregas:</Text>
                                <Text>{pedidos.length}</Text>
                            </Flex>
                        </Box>
                    )
                })}
            </SimpleGrid>


            {lodash.isEmpty(props.produtos)
                ? <></>
                : <h2>Produtos:</h2>
            }


            <SimpleGrid className={styles.RelatorioDiario}>
                {Object.keys(props.produtos).map((prod, idx) => {
                    const p = props.produtos[prod]
                    const total = p.total * p.preco
                    const faltam = p.faltam ? p.faltam : 0

                    return (
                        <Box key={idx} className={styles.EntregadorResumo}>
                            <Text className={styles.EntregadorTitle}>{prod}</Text>
                            <Flex className={styles.EntregadorResumoLinha}>
                                <Text>Vendidos:</Text>
                                <Text>{p.total}</Text>
                            </Flex>
                            <Flex className={styles.EntregadorResumoLinha}>
                                <Text>Faltam sair:</Text>
                                <Text>{faltam}</Text>
                            </Flex>
                            <Flex className={styles.EntregadorResumoLinha}>
                                <Text>Total:</Text>
                                <Text>{`R$ ${total.toFixed(2)}`}</Text>
                            </Flex>
                        </Box>
                    )
                })}
            </SimpleGrid>
        </>
    )
}
