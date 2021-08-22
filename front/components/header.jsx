import React from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Flex, Text, Link, LinkBox, LinkOverlay } from '@chakra-ui/react'


const NavLink = ({ children, href }) => {
    const router = useRouter()
    const currentPath = router.pathname === href

    return (
        <LinkBox
            m='8px'
            p='8px'
            my='auto'
            display='flex'
            fontSize='20px'
            fontWeight='bold'
            borderRadius='2px'
            alignItems='center'
            transition='all 0.3s'
            bg={currentPath ? 'green' : 'white'}
            boxShadow={currentPath ? '2px 2px 2px #000' : 'none' }
            _hover={{
                color: '#fff',
                bg: 'green',
                boxShadow: '2px 2px 2px #000'
            }}
            _focus={{
                bg: 'green',
                color: '#fff',
                boxShadow: '2px 2px 2px #000'
            }}
            _active={{
                boxShadow: '1.5px 1.5px 2px #000 inset'
            }}
        >
            <NextLink href={href} passHref>
                <LinkOverlay color={currentPath ? 'white' : 'green'} textDecor='none' _hover={{color: 'white'}}>
                    {children}
                </LinkOverlay>
            </NextLink>
        </LinkBox>
    )
}


export default function Header() {

    return (
        <Flex
            h='7.5rem'
            w='100%'
            top='0'
            position='sticky'
            justifyContent='space-between'
            boxShadow='0 0.2rem 0.3rem #00000060'
        >
            <Text ml='1%' my='auto' color='green' fontSize='32px' fontWeight='bold'>
                Disk Frango Real
            </Text>
            <Flex display={{ base: 'none', lg: 'flex' }} mr='3%'>
                <NavLink href='/'>Inicial</NavLink>
                <NavLink href='/planilha'>Planilha</NavLink>
                <NavLink href='/'>Lembretes</NavLink>
                <NavLink href='/'>Histórico</NavLink>
            </Flex>
        </Flex>
    )
};