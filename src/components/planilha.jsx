import React from 'react'
import {
  Flex, Text, Box, RadioGroup, Radio, Menu, MenuButton, MenuList, MenuItem, MenuDivider, MenuOptionGroup, MenuItemOption,
	Checkbox, Divider, Button, AccordionItem, AccordionButton, AccordionIcon, Accordion, AccordionPanel, List, ListItem,
	Select, Wrap, WrapItem, Center, IconButton, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Input 
} from '@chakra-ui/react'
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons'

const Produtos = require('../config/produtos.json')
const Ruas = require('../config/enderecos.json').sort()



export default () =>{

  const fs = '14px'
  const cores = {
    naoSaiu: '#F9FADD',
    saiu: '#17FBDF',
    entregue: '#40FB17',
    erro: '#C4A900',
    cancelou: '#CB0202',
    green: '#1DCC0E'
  }

  const entregadores = [
    'Bil',
    'Tibério',
    'Natan',
    'Uilton',
    'Elielton',
    'Pago',
    'Fiado'
  ]

  const Line = () => {

    const [estado, setEstado] = React.useState('naoSaiu')
    const [entregador, setEntregador] = React.useState(entregadores[0])
    const [produto, setProduto] = React.useState(Object.keys(Produtos)[0])
    const [produtos, setProdutos] = React.useState({})
    const [updateProdutos, setUpdateProdutos] = React.useState(false)
		const [amount, setAmount] = React.useState(0)
		const [rua, setRua] = React.useState(Ruas[0])
    const [allowToggle, setAllowToggle] = React.useState(true)
    const [isDisabled, setIsDisabled] = React.useState(false)
    const [flag, setFlag] = React.useState(true)
		
    function toggleExpand(toExpand, toDisable){
      setAllowToggle(toExpand)
      setIsDisabled(toDisable)
    }
		function changeProduto(value){
			setProduto(value)
			setAmount(produtos[value])
		}
    function changeAmount(amount){
			if(amount<0) amount = 0
			setAmount(amount)
      produtos[produto] = amount
      setProdutos(produtos)
      setUpdateProdutos(true)
    }
		
    if(flag){
      Object.keys(Produtos).forEach(key=> produtos[key] = 0)
      setProdutos(produtos)
      setFlag(false)
    }
    let total = 0

    return(
			<Accordion allowToggle={allowToggle}>
				<AccordionItem minH='40px' border="0" isDisabled={isDisabled}>
					{({ isExpanded })=> (
						<>
							<AccordionButton w="100%" _focus={{borderWidth: "0px"}} _disabled={{bgColor:"#00000000"}}>
								<Box
									w="100%"
									px='16px'
									display='flex'
									transition='0.08s'
									bg={cores[estado]}
									borderRadius='25px'
									justifyContent='space-between'
									_hover={{
									  cursor: 'pointer',
									  borderWidth: '2px'
									}}
								>
									<Flex my='auto'>
										<Text w='200px' fontSize={fs} my='auto'>
											Primeiro de Maio, 2060 - Altos
										</Text>
										<Text w='200px' fontSize={fs} ml='20px' my='auto'>
											1 Frango + 1 Batata + 1 Coca-Cola 2L + 2 paçoca
										</Text>
										<Text w='200px' fontSize={fs} my='auto' ml='20px' isTruncated>
											Dourado, bem assado, 2 farofas
										</Text>
									</Flex>
									<Menu my='auto'>
										<MenuButton w='80px' outline='none' onMouseOver={()=>toggleExpand(false, !isExpanded)} onMouseLeave={()=>toggleExpand(true, false)}>
											<Flex justifyContent='center'>
												<Text fontSize={fs} isTruncated children={entregador}/>
												<ChevronDownIcon my='auto'/>
											</Flex>
										</MenuButton>
										<MenuList onMouseOver={()=>toggleExpand(false, !isExpanded)} onMouseLeave={()=>toggleExpand(true, false)}>
											<MenuOptionGroup type='radio' onChange={value=> setEntregador(value)} value={entregador}>
												{entregadores.map((entregador, index) => (
													<MenuItemOption value={entregador} key={index}>{entregador}</MenuItemOption>
												))}
											</MenuOptionGroup>
										</MenuList>
									</Menu>
									<RadioGroup onChange={value=> setEstado(value)} value={estado} my='auto'>
										<Radio value='naoSaiu' px="4px" size="sm" _hover={{cursor: "pointer"}}>Novo</Radio>
										<Radio value='saiu' px="4px" size="sm">Saiu</Radio>
										<Radio value='entregue' px="4px" size="sm">Entregue</Radio>
										<Radio value='erro' px="4px" size="sm">Erro</Radio>
										<Radio value='cancelou' px="4px" size="sm">Cancelou</Radio>
									</RadioGroup>
									<Checkbox colorScheme='green' size='sm'/>
									<Text fontSize={fs} my='auto'>
										R$ 33,00
									</Text>
								</Box>
								<AccordionIcon />
							</AccordionButton>
							







							{/* ACCORDION PANEL   -   Elementos que são mostrados quando o accordion está aberto */}


							<AccordionPanel pb="-32px">
								<Flex mb="20px">
									<Box mr="7%">
										<Text mb="4px">Endereço:</Text>
										<Flex>
											<Menu>
												<MenuButton w="200px" mr="12px" borderWidth="1px" borderRadius="1px">
													<Flex justifyContent='space-between' px='4px'>
														<Text fontSize={fs}>{rua}</Text>
														<ChevronDownIcon my='auto'/>
													</Flex>
												</MenuButton>
												<MenuList>
													<MenuOptionGroup onChange={value=>setRua(value)}>
														{Ruas.map((rua, index)=>(
															<MenuItemOption key={index} value={rua}>{rua}</MenuItemOption>
														))}
													</MenuOptionGroup>
												</MenuList>
											</Menu>
											<NumberInput min={0} size="xs" flexDirection="row">
												<NumberInputField placeholder="Número" />
											</NumberInput>
										</Flex>
										<Input size="sm" mt="12px" placeholder="Complemento" />
									</Box>
									


									<Wrap direction="column" w="200px" bg="#ABC2D7" p="8px" borderRadius={updateProdutos? setUpdateProdutos(false)? "8px": "8px": "8px"}>
										{Object.keys(produtos).filter(key=>produtos[key]>0).map((key, index)=>(
											<WrapItem key={index} justifyContent="space-between">
												<Text>{key}</Text>
												<Text>{produtos[key]}</Text>
											</WrapItem>
										))}
									</Wrap>
									<Menu>
										<Flex h="45px" ml="8px">
											<MenuButton w="200px" h="45px" bg="#ddd" borderRadius="8px" ml="4px">
												<Flex justifyContent='center'>
													<Text fontSize="18px" isTruncated children={produto}/>
													<ChevronDownIcon my='auto'/>
												</Flex>
											</MenuButton>
											<NumberInput
												min={0}
												w="90px"
												ml='4px'
												my='auto'
												value={amount}
												allowMouseWheel
												onChange={value=>changeAmount(value)}
												>
												<NumberInputField />
												<NumberInputStepper>
													<NumberIncrementStepper />
													<NumberDecrementStepper />
												</NumberInputStepper>
											</NumberInput>
										</Flex>
										<MenuList>
											<MenuOptionGroup type='radio' onChange={value=> changeProduto(value)} value={produto}>
												{Object.keys(Produtos).map((Produto, index) => 
													<MenuItemOption value={Produto} key={index}>{Produto}</MenuItemOption>
												)}
											</MenuOptionGroup>
										</MenuList>
									</Menu>
								</Flex>
								<Divider />
							</AccordionPanel>
						</>
					)}
				</AccordionItem>
			</Accordion>
    )
  }














  return (
		<Box>
			<Flex
				px='15px'
				bg='#FAE511'
				pos='sticky'
			>
				<Text minW='200px' textAlign='center'>Endereço</Text>
				<Divider orientation='vertical' borderColor='#828282' my='3px' mx='auto' />
				<Text minW='200px' textAlign='center'>Produtos</Text>
				<Divider orientation='vertical' borderColor='#828282' my='3px' mx='auto' />
				<Text minW='200px' textAlign='center'>Observações</Text>
				<Divider orientation='vertical' borderColor='#828282' my='3px' mx='auto' />
				<Text minW='90px' textAlign='center'>Entregador</Text>
				<Divider orientation='vertical' borderColor='#828282' my='3px' mx='auto' />
				<Text minW='330px' textAlign='center'>Estatos do pedido</Text>
				<Divider orientation='vertical' borderColor='#828282' my='3px' mx='auto' />
				<Text minW='50px' textAlign='center'>Cartão</Text>
				<Divider orientation='vertical' borderColor='#828282' my='3px' mx='auto' />
				<Text minW='20px' textAlign='center'>Total</Text>
			</Flex>
			<Accordion allowMultiple>
				<Line />
				<Line />
				<Line />
				<Line />
				<Line />
				<Line />
				<Line />
				<Line />
				<Line />
			</Accordion>
			<Box w='240px' mx='auto'>
			<Button
				h='100px'
				w='240px'
				color='#fff'
				fontSize='28px'
				bg={cores.green}
				borderRadius='30px'
				textShadow='1px 1px 2px #000, -1px -1px 2px, 1px -1px 2px, -1px 1px 2px #000'
				_hover={{ bg: cores.green }}
				_active={{ bg: cores.green, transform: 'scale(0.95)' }}
				>
				Novo Pedido
			</Button>
			</Box>
		</Box>
  )

}