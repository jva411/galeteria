import Card from "components/card/card"
import { ReactNode } from "react"
import { MdClose } from 'react-icons/md'


interface ModalProps {
    isOpen?: boolean
    onClose: () => void
    children?: ReactNode
    containerProps?: React.HTMLProps<HTMLDivElement>
}


export default function Modal({ isOpen, onClose, children, containerProps }: ModalProps) {
    const containerStlyes = `absolute top-0 w-full h-[calc(100%-5rem)] mt-[5rem] flex justify-center items-center z-10 focus:outline-none`
    const overlayStyles = `bg-[#85858550] w-full h-full absolute`

    if (!isOpen) return <></>

    return <div className={containerStlyes} onKeyUp={e => e.key === 'Escape' && onClose()} tabIndex={0}>
        <div className={overlayStyles} onClick={onClose} />
        <Card className='w-[35rem] h-[25rem] relative flex-col p-[1rem] pt-[4rem]' {...containerProps}>
            <button type='button' title='Fechar' onClick={() => onClose()} className='absolute right-[1rem] top-[1rem] text-[2rem] text-gray-400 hover:text-black'>
                <MdClose />
            </button>
            {children}
        </Card>
    </div>
}
