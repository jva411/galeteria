import React from 'react'
import styles from '~/styles/components/ConfirmationPopup.module.less'
import { AlertDialog, AlertDialogCloseButton, AlertDialogContent, AlertDialogOverlay, Box, Button, Flex, Text, useDisclosure, useOutsideClick } from '@chakra-ui/react'


let openPopup = () => {}


const ConfirmationPopup = () => {

    const [props, setProps] = React.useState({
        message: 'Você realmente quer fazer isso?',
        action: 'Confirmar',
        confirmation: () => {},
        ref: null
    })
    const { isOpen, onOpen, onClose } = useDisclosure()

    openPopup = (Props) => {
        setProps(Props)
        onOpen()
    }
    
    function handleAction() {
        onClose()
        props.confirmation()
    }

    return (
        <AlertDialog
            isCentered
            isOpen={isOpen}
            onClose={onClose}
            leastDestructiveRef={props.ref}
        >
            <AlertDialogOverlay />
            <AlertDialogContent className={styles.popup}>
                <AlertDialogCloseButton className={styles.close} />
                <Text className={styles.message}>{props.message}</Text>
                <Flex className={styles.buttons}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleAction}>{props.action}</Button>
                </Flex>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmationPopup

export { openPopup }
