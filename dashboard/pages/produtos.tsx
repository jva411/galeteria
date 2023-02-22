import api from 'utils/axios'
import AddButton from 'components/button/add'
import useForceUpdate from 'utils/force-update'
import { productsState } from 'utils/providers/product'
import ProductCard from 'components/card/product'
import RegisterProductModal, { controls } from 'components/modal/register-product'
import UpdateProductModal from 'components/modal/update-product'


interface ProdutosProps {
    products: Product[]
}


export default function Produtos({ products }: ProdutosProps) {
    if (productsState.data.length === 0) productsState.data.push(...products)
    const forceUpdate = useForceUpdate()
    productsState.listeners['Produtos'] = () => forceUpdate()

    return <>
        <div className='flex flex-wrap items-center p-[2rem] [&>*]:mb-[2rem] [&>*]:mr-[2rem]'>
            {/* <ProductCard product={{name: 'Frango com Baião', price: 23.0}} /> */}
            {productsState.data.map((product, idx) => <ProductCard product={product} key={idx} />)}
            <AddButton onClick={() => controls.open({name: '', price: 0, onClose: () => {}})} />
        </div>
        <RegisterProductModal />
        <UpdateProductModal />
    </>
}


export async function getServerSideProps() {
    const props = {
        title: 'Produtos',
        products: [] as Product[]
    }

    const data = await (await api.get('product')).data
    props.products = typeof data === 'string'? JSON.parse(data): data

    return { props }
}
