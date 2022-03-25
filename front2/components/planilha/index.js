import Text from '~/components/text'
import RequestList from './request-list'
import styles from '~/styles/components/planilha.module.scss'


export default function Planilha({ }) {

    return (
        <div className={styles.planilha}>
            <header>
                <Text>Endereço</Text>
                <Text>Produtos</Text>
                <Text>Observações</Text>
                <Text>Entregador</Text>
                <Text>Estado</Text>
                <Text>Pagamento</Text>
                <Text>Total</Text>
            </header>

            <RequestList styles={styles} />
        </div>
    )
}
