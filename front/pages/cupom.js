import Cupom from "~/components/cupom";

export default function CupomPage(props) {
    return <Cupom />
}


export const getServerSideProps = async (context) => {
    let props = {}

    props.title = 'Cupom'
    props.hideMenus = true

    return {
        props: props
    };
};