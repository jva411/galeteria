import Modal from "./modal"
import api from "utils/axios"
import { useState } from "react"
import Input from "components/input/input"
import { deliverymanState } from 'utils/providers/deliveryman'


interface RegisterDeliverymanProps {
    onClose: (props: RegisterDeliverymanProps) => void
    name: string
}


export const controls = {
    open: (props?: RegisterDeliverymanProps) => {}
}


export default function RegisterDeliverymanModal() {
    const [props, setProps] = useState<RegisterDeliverymanProps>()
    const [isOpen, setIsOpen] = useState(false)

    function open(props?: RegisterDeliverymanProps) {
        setProps(props)
        setIsOpen(true)
    }
    function close() {
        setIsOpen(false)
        props?.onClose(props)
    }

    function updateName(newValue: string) {
        props!.name = newValue
        setProps({...props!})
    }

    async function registerDeliveryman() {
        try {
            await api.post('/deliveryman', JSON.stringify({
                'name': props!.name,
                'description': ''
            }), {headers:{'Content-Type': 'application/json'}})
            deliverymanState.data = JSON.parse(await (await api.get('/deliveryman')).data)
            deliverymanState.notify('newDeliveryman')
            close()
        } catch(ex) { console.error(ex) }
    }

    controls.open = open

    return <Modal isOpen={isOpen} onClose={close}>
        <Input label='Nome' id='name' value={props?.name} onChange={e => updateName((e.target as HTMLInputElement).value)} />
        <button
            type='button'
            onClick={registerDeliveryman}
            disabled={!props?.name.length}
            className='mt-[3rem] p-[1rem] rounded-full bg-lime-400 disabled:grayscale-[80%]'
        >
            Registrar
        </button>
    </Modal>
}
