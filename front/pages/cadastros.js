import React from 'react'
import instance from '~/lib/axiosConfig'
import { useGlobalContext } from '~/lib/globalContext'
import Enderecos from '~/components/cadastros/enderecos'
import styles from '~/styles/components/Cadastros.module.less'
import ConfirmationPopup from '~/components/confirmation-popup'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'


export default function Cadastros(props) {
    const {Ruas, Produtos, entregadores, setRuas, setProdutos, setEntregadores} = useGlobalContext()
    const [flag, setFlag] = React.useState(true)

    React.useState(() => {
        setRuas(props.ruas)
        setProdutos(props.produtos)
        setEntregadores(props.entregadores)
        setFlag(false)
    }, [props.ruas, props.entregadores, props.produtos])

    if(flag) return <></>

    return (
        <>
            <ConfirmationPopup />
            <Tabs variant='enclosed' className={styles.tabs}>
                <TabList className={styles.tabList}>
                    <Tab>Endereços</Tab>
                    <Tab>Produtos</Tab>
                    <Tab>Entregadores</Tab>
                </TabList>
                <TabPanels className={styles.tabPanels}>
                    <TabPanel><Enderecos css={styles} /></TabPanel>
                    <TabPanel></TabPanel>
                    <TabPanel></TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}


export const getServerSideProps = async (context) => {

    let props = {}

    props.title = 'Cadastros'

    try {
        const ruas = await instance.get('/enderecos')
        const produtos = await instance.get('/cardapio')
        const entregadores = await instance.get('/entregadores')

        props.ruas = ruas.data
        props.produtos = produtos.data
        props.entregadores = entregadores.data
    } catch (err) {
        console.log(err)
    }


    return {props}
}
