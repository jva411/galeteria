export default function Text({ children, ...props }) {
    const style = {
        width: props.width || props.w || 'fit-content',
    }

    return (
        <p style={style}>{children}</p>
    )
}
