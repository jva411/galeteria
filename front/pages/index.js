export default function Principal(props) {
    return <div>Hello everyone!</div>
}

export const getServerSideProps = async (context) => {
    let props = {}

    props.title = 'Principal'

    return {
        props: props
    };
};
