import React from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { Box, Image, Flex, Text, Link, Drawer, Stack } from '@chakra-ui/react'

export default () => {
  
  const green = '#1DCC0E'

  const NavLink = ({ children, href }) =>(
    <Link
      m='8px'
      p='8px'
      color={green}
      display='flex'
      fontSize='20px'
      as={GatsbyLink}
      fontWeight='bold'
      borderRadius='2px'
      alignItems='center'
      transition='all 0.3s'
      to={href}
      _hover={{
        color: '#fff',
        bg: green,
        boxShadow: '2px 2px 2px #000'
      }}
      _focus={{
        bg: green,
        color: '#fff',
        boxShadow: '2px 2px 2px #000'
      }}
      _active={{
        boxShadow: '1.5px 1.5px 2px #000 inset'
      }}
      >
        {children}
    </Link>
  )


  return(
    <Flex
      w='100%'
      h='50px'
      as="header"
      justifyContent='space-between'
      boxShadow='0px 2px 3px #00000060'
      >
        <Text ml='1%' my='auto' color={green} fontSize='32px' fontWeight='bold'>Disk Frango Real</Text>
        <Flex display={{base: 'none', lg:'flex'}} mr='3%'>
          <NavLink href='/'>Inicial</NavLink>
          <NavLink href='/planilha'>Planilha</NavLink>
          <NavLink href='/'>Lembretes</NavLink>
          <NavLink href='/'>Histórico</NavLink>
        </Flex>
    </Flex>
  )
};