import Planilha from '~/components/planilha/index.js';


export default function Home() {
    return (
        <Planilha />
    )
}


export async function getStaticProps() {
    const props = {
        title: 'Planilha'
    }

    return { props }
}
