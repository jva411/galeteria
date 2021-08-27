import React from 'react'
import lodash from 'lodash'
import { BiSave } from 'react-icons/bi'
import instance from '~/lib/axiosConfig'
import { openPopup } from '../confirmation-popup'
import { AddIcon, SmallCloseIcon } from '@chakra-ui/icons'
import { useGlobalContext } from '~/lib/globalContext'
import { Input, Box, SimpleGrid, NumberInput, NumberInputField, Flex, InputGroup, IconButton, Center } from '@chakra-ui/react'


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))


const Card = ({ r, index, novoCard, css: styles, setCreating }) => {

    const [Rua, setRua] = React.useState({...r})
    const Ref = React.useRef()
    const Ref2 = React.useRef()

    React.useEffect(() => {
        setRua({...r})
    }, [r])


    function handleChange(key, value) {
        Rua[key] = value
        setRua({...Rua})
    }

    async function handleCreate() {
        try{
            const res = await instance.post('/endereco', Rua)
            setCreating(false)
        } catch (err) {
            console.log(err)
        }
    }

    function handleUpdate() {
        const toSend = {...Rua}
        Object.keys(r).filter(key => r[key] === toSend[key]).map(key => delete toSend[key]) 
        if(lodash.isEmpty(toSend)) return
        console.log(toSend, r)
    
        openPopup({
            message: 'Atualizar esse endereço?',
            action: 'Atualizar',
            confirmation: async () => {
                try {
                    const res = await instance.put(`/endereco/${Rua._id}`, Rua)
                } catch(err) {
                    console.log(err)
                }
            },
            ref: Ref2
        })
    }

    function handleDelete() {
        openPopup({
            message: 'Você deseja realmente apagar esse endereço?',
            action: 'Apagar',
            confirmation: () => {
                console.log("Deletar!")
            },
            ref: Ref
        })
    }


    if(novoCard) return (
        <Box className={styles.novaRuaCard}>
            <Flex className={styles.buttons}>
                <IconButton icon={<BiSave />} title='salvar' onClick={handleCreate} />
                <IconButton icon={<SmallCloseIcon />} title='deletar' onClick={() => setRua(false) || setCreating(false)} />
            </Flex>
            <label htmlFor='rua-novo'>Endereço:</label>
            <Input id='rua-novo' value={Rua.Rua} placeholder='Rua' onChange={e => handleChange('Rua', e.target.value)} />

            <Flex className={styles.minMax}>
                <NumberInput min={1} max={10000} className={styles.minMaxInput} value={Rua.min} onChange={value => handleChange('min', Math.floor(Number(value)))}>
                    <label htmlFor='min-novo'>Min:</label>
                    <NumberInputField id='min-novo' placeholder='min' />
                </NumberInput>
                <NumberInput min={1} max={10000} className={styles.minMaxInput} value={Rua.max} onChange={value => handleChange('max', Math.floor(Number(value)))}>
                    <label htmlFor='max-novo'>Max:</label>
                    <NumberInputField id='max-novo' placeholder='max' />
                </NumberInput>
            </Flex>
        </Box>
    )
    
    return (
        <Box className={styles.ruaCard}>
            <Flex className={styles.buttons}>
                <IconButton icon={<BiSave />} title='salvar' ref={Ref2} onClick={handleUpdate} />
                <IconButton icon={<SmallCloseIcon />} title='deletar' ref={Ref} onClick={handleDelete} />
            </Flex>
            <label htmlFor={`rua-${index}`}>Endereço:</label>
            <Input id={`rua-${index}`} value={Rua.Rua} placeholder={Rua.Rua} onChange={e => handleChange('Rua', e.target.value)}/>

            <Flex className={styles.minMax}>
                <NumberInput min={1} max={10000} className={styles.minMaxInput} value={Rua.min} onChange={value => handleChange('min', Math.floor(Number(value)))}>
                    <label htmlFor={`min-${index}`}>Min:</label>
                    <NumberInputField id={`min-${index}`} placeholder='min' />
                </NumberInput>
                <NumberInput min={1} max={10000} className={styles.minMaxInput} value={Rua.max} onChange={value => handleChange('max', Math.floor(Number(value)))}>
                    <label htmlFor={`max-${index}`}>Max:</label>
                    <NumberInputField id={`max-${index}`} placeholder='max' />
                </NumberInput>
            </Flex>
        </Box>
    )
}


export default function Enderecos({ css: styles }) {

    const {Ruas, setRuas} = useGlobalContext()
    const [creating, setCreating] = React.useState(false)


    React.useEffect(async () => {
        if(Ruas.lastUpdate){
            let last = await (await instance.get('/enderecos/update')).data.lastUpdate
            while(last === Ruas.lastUpdate) {
                await sleep(1000)
                last = await (await instance.get('/enderecos/update')).data.lastUpdate
            }

            const enderecos = await instance.get('/enderecos')
            setRuas(enderecos.data)
        }
    })


    if(!Ruas.lastUpdate) return <></>

    return (
        <>
            <SimpleGrid className={styles.enderecos}>
                {Ruas.ruas.map((r, idx) => <Card key={idx} r={r} index={idx} css={styles} />)}

                {creating
                    ? <Card novoCard r={{Rua: '', min: 1, max: 10000}} css={styles} setCreating={setCreating} />
                    : <Center className={styles.addButton}>
                        <IconButton icon={<AddIcon />} title='Adicionar novo endereço' onClick={() => setCreating(true)} />
                    </Center>
                }
            </SimpleGrid>
        </>
    )
}
