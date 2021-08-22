import React from 'react'
import { useGlobalContext } from '~/lib/globalContext'
import styles from '~/styles/components/ContextMenu.module.less'
import { Box, Flex, Text, useOutsideClick } from '@chakra-ui/react'


let openContext = () => {}


const ContextMenu = () => {
    
    const [contextMenu, setContextMenu] = React.useState({
        isOpen: false,
        xPos: '0px',
        yPos: '0px',
        options: []
    })
    const { xPos, yPos, isOpen, options } = contextMenu
    const ref = React.useRef();

    const onClose = () => {
        setContextMenu({
            options: [],
            xPos: '0px',
            yPos: '0px',
            isOpen: false
        })
    }
    openContext = (menu) => {
        setContextMenu(menu)
    }

    // useOutsideClick({
    //     ref,
    //     handler: onClose
    // })
    React.useEffect(() => {
        setTimeout(() => {
            document.addEventListener('mouseup', e => {
                if(ref.current && !ref.current.contains(e.target)) {
                    onClose()
                }
            })
        }, 1)
    }, [true])

    function handleClick(e, handle) {
        e.preventDefault()
        handle()
        onClose()
    }


    return (
        <Flex className={styles.Menu} hidden={!isOpen} _disabled={!isOpen} top={yPos} left={xPos} ref={ref}>
            {options.map((option, index) => (
                <Box className={styles.Option} key={index} onClick={e => handleClick(e, option.handle)}>
                    {option.icon
                        ? option.icon
                        : <></>
                    }
                    <Text className={styles.Label}>
                        {option.label}
                    </Text>
                </Box>
            ))}
        </Flex>
    )
}


export default ContextMenu

export { openContext }
