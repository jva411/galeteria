import React from 'react'
import lodash from 'lodash'
import instance from '~/lib/axiosConfig'
import styles from '~/styles/components/Cupom.module.less'
import { Text, Box, Flex } from '@chakra-ui/react'


const Line = ({left, right}) => {

    return <Flex className={styles.produto}>
        <Text>{left}</Text>
        <Text>{right}</Text>
    </Flex>
}


const Cupom = () => {
    
    // Largura de 31 letras

    const [pedido, setPedido] = React.useState()

    React.useEffect(async () => {
        const Pedido = await instance.get('/impressao')
        setPedido(Pedido.data.Pedido)
    }, [true])

    React.useEffect(() => {
        if(window.opener && pedido) {
            window.print()
            window.close()
        }
    }, [pedido])


    if(!pedido || lodash.isEmpty(pedido)) return <></>

    const taxa = pedido.taxaEntrega + pedido.taxaCartao

    return (
        <Box id='printBody' className={styles.body} >
            <Text>{`(${pedido.index}º)`}</Text>
            <Text>Disk Frango Real</Text>
            <Text>98509-7224/3245-8939</Text>
            <Text mt='1.4rem' textAlign='justify'>{`${pedido.rua.Rua}, ${pedido.numero} - ${pedido.complemento}`}</Text>


            <Text>{`-------------------------------`}</Text>
            {pedido.produtos.map(x => (
                <Line
                    left={`${x.quantidade}x ${x.nome}`}
                    right={Number(x.quantidade * x.preco).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}).slice(3)}
                />
            ))}
            <Line
                left={taxa ? 'Taxa' : ''}
                right={Number(taxa).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}).slice(3)}
            />
            <Text mt='0.8rem'>{`-------------------------------`}</Text>


            <Line left='Total' right={Number(pedido.total).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} />
            <Line left='Pagamento' right={pedido.isCartao
                ? 'CARTÃO'
                : pedido.entregador === 'Pago' || pedido.entregador === 'Fiado'
                    ? pedido.entregador.toUpperCase()
                    : pedido.troco
                        ? Number(pedido.troco).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
                        : Number(pedido.total).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
            } />
            {!pedido.isCartao && pedido.troco
                ? <Line left='Troco' right={Number(pedido.troco - pedido.total).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} />
                : <></>
            }

            {pedido.observacoes
                ? <>
                    <Text mt='0.8rem'>{`-------------------------------`}</Text>
                    <Text textAlign='start'>Obs:</Text>
                    <Text className={styles.observacoes}>{pedido.observacoes}</Text>
                </>
                : <></>
            }
        </Box>
    )
}


export default Cupom
