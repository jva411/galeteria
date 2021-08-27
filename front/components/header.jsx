import React from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Flex, Text, Link, LinkBox, LinkOverlay } from '@chakra-ui/react'


const NavLink = ({ children, href }) => {
    const router = useRouter()
    const currentPath = router.pathname === href

    return (
        <LinkBox
            m='0.8rem'
            p='0.8rem'
            my='auto'
            display='flex'
            fontSize='2rem'
            fontWeight='bold'
            borderRadius='0.2rem'
            alignItems='center'
            transition='all 0.3s'
            bg={currentPath ? 'green' : 'white'}
            boxShadow={currentPath ? '0.2rem 0.2rem 0.2rem #000' : 'none' }
            _hover={{
                color: '#fff',
                bg: 'green',
                boxShadow: '0.2rem 0.2rem 0.2rem #000'
            }}
            _focus={{
                bg: 'green',
                color: '#fff',
                boxShadow: '0.2rem 0.2rem 0.2rem #000'
            }}
            _active={{
                boxShadow: '0.15rem 0.15rem 0.2rem #000 inset'
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
            zIndex='1'
            bg='white'
            position='sticky'
            justifyContent='space-between'
            boxShadow='0 0.2rem 0.3rem #00000060'
        >
            <Text ml='1%' my='auto' color='green' fontSize='3.2rem' fontWeight='bold'>
                Disk Frango Real
            </Text>
            <Flex display={{ base: 'none', lg: 'flex' }} mr='3%'>
                <NavLink href='/'>Inicial</NavLink>
                <NavLink href='/planilha'>Planilha</NavLink>
                <NavLink href='/cadastros'>Cadastros</NavLink>
            </Flex>
        </Flex>
    )
};