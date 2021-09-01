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
        flag: false
    })


    useEffect(async () => {
        try {
            const res = await api.get('/pedidos/important')
            props.pedidos = lodash.groupBy(res.data.filter(p => p.estado === 'entregue'), p => p.entregador)
            Object.keys(props.pedidos).map(x => props.trocos[x] = 105)
            props.flag = true
            setProps({...props})
        } catch (err) {
            console.log(err)
        }
    }, [true])

    useEffect(async () => {
        if(props.flag) {
            try {
                await sleep(3000)
                if(ignore) return;
                const res = await api.get('/pedidos/important')
                props.pedidos = lodash.groupBy(res.data.filter(p => p.estado === 'entregue'), p => p.entregador)
                Object.keys(props.pedidos).map(x => props.trocos[x] = 105)
                setProps({...props})
            } catch (err) {
                console.log(err)
            }
        }
    }, [props])
    
    return (
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
                    </Box>
                )
            })}
        </SimpleGrid>
    )
}
