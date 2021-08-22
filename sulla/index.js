// import sulla from 'sulla'
import lodash from 'lodash'
import { DateTime } from 'luxon'
import colors from './colors.js'
import { db, pedido } from './db'
import sulla from '@open-wa/wa-automate'
import cardapio from './config/cardapio.js'



/**
 * @typedef Endereco
 * @type {object}
 * @property {string} rua
 * @property {number} numero
 * @property {string} [complemento]
 */

/**
 * @typedef Produto
 * @type {object}
 * @property {string} nome
 * @property {number} [preco]
 * @property {number} quantidade
 * @property {number} cod
 * @property {{nome:string,preco:number}[]} [variacoes]
 */

/**
 * @typedef Cliente
 * @type {object}
 * @property {DateTime} timestamp
 * @property {string} chatId
 * @property {('inicio'|'selecionando'|'selecionando2'|'quantificando'|'quantidade'|'decidindo'|'lugar'|'removendo'|'fechando'|'concluido'|'pagamento')} status
 * @property {number} attempts
 * @property {Produto[]} produtos
 * @property {number} taxa
 * @property {number} total
 * @property {Produto} produto
 * @property {Endereco} endereco
 * @property {string} observacao
 */


const client = await sulla.create()

/**
 * @type {Object.<string, Cliente>}
 */
const clientes = {}

function captalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1, str.length)
}


const Cardapio = Object.keys(cardapio).map(cod => {
    const produto = cardapio[cod]
    if (produto.preco) return `${cod} - ${produto.nome}:  R$${produto.preco.toFixed(2)}`
    return `${cod} - ${produto.nome} - Ver opções`
}).join('\n')

/**
 * @param {string} from 
 * @param {Cliente} cliente 
 */
function resumo(from, cliente) {
    const {produtos} = cliente
    const produtosResumo = produtos.filter(produto => produto.quantidade).map(produto => `${produto.quantidade}x ${produto.nome}:  ${produto.preco * produto.quantidade}`)
    client.sendText(from,
        'Resumo do pedido:\n\n' +
        `${produtosResumo.join('\n')}\n\n` +
        `Taxa: ${cliente.taxa}\n` +
        `Total: ${cliente.total}`
    )
}

function enviarCardapio(from) {
    client.sendText(from, `Veja o nosso cardápio:\n${Cardapio}`)
}


client.onMessage(message => {
    const {chatId} = message
    if (chatId !== '558589713291@c.us' && chatId !== '558594312015@c.us') return console.log(chatId)
    const msg = message.body.toLowerCase()
        .replace(/[áâàäã]/giu, 'a')
        .replace(/[éêèë]/giu, 'e')
        .replace(/[íîìï]/giu, 'i')
        .replace(/[óôòöõ]/giu, 'o')
        .replace(/[úûùü]/giu, 'u') // ç -> c,  ý -> y
        .replace(/[^a-z 0-9\n]/gu, '')


    let cliente = clientes[chatId]
    if (!cliente) {
        cliente = {
            chatId,
            timestamp: DateTime.now(),
            status: 'inicio',
            attempts: 0,
            taxa: 1,
            total: 1,
            produtos: []
        }
        clientes[chatId] = cliente
    }
    let saudacao = cliente.timestamp.hour < 12 ? 'bom dia' : 'boa tarde'
    saudacao = captalize(saudacao)

    try {

        if (cliente.status === 'inicio') {
            client.sendText(message.from, `${saudacao}\n\n`)
            enviarCardapio(message.from)
            cliente.status = 'selecionando'
        } else if (cliente.status === 'decidindo') {
            const opcao = parseInt(msg, 10)
            if (isNaN(opcao) || opcao < 0 || opcao > 3){
                cliente.attempts += 1
                client.sendText(message.from, 'Desculpe, mas essa não é uma opção válida!\nEscolha uma das opções fornecidas')
                return;
            }
            cliente.attempts = 0
            switch(opcao) {
                case 1:
                    cliente.status = 'lugar';
                    cliente.sendText(message.from, 'Por favor, digite o seu endereço no seguinte formato:\nRua\nNúmero\nComplemento (opcional)\n\n(Ex:)\nMaria Júlia\n480\nEsquina com José Martins')
                    break;
                case 2:
                    client.sendText(message.from, `${saudacao}\n\n`)
                    enviarCardapio(message.from)
                    cliente.status = 'selecionando'
                    break;
                case 3:
                    resumo(message.from, cliente)
                    cliente.status = 'removendo'
                    let lista = cliente.produtos.map((prd, idx) => `${idx+1} - ${prd.quantidade}x${prd.nome}`).join('\n')
                    lista += `\n0 - Para voltar ao menu`
                    client.sendText(message.from, `Selecione o item que deseja retirar do seu pedido:\n${lista}`)
                    break;
                case 0:
                    delete clientes[cliente.chatId]
                    cliente.status = 'inicio'
                    break;
            }
        } else if (cliente.status === 'selecionando') {
            const cod = Number(msg)
            const produto = cardapio[msg]
            if (isNaN(cod) || !produto) {
                cliente.attempts += 1
                client.sendText(message.from, 'Desculpe, mas essa não é uma opção válida!\nEscolha uma das opções fornecidas')
                return;
            }
            let produto2 = cliente.produtos.find(prod => prod.cod === cod)
            let novo = false
            if (!produto2) {
                produto2 = {...produto}
                produto2.quantidade = 0
                novo = true
            }
            produto2.cod = cod
            cliente.produto = produto2
            if (produto2.variacoes) {
                cliente.status = 'selecionando2'
                cliente.novo = true
                const cardapioOpcoes = produto2.variacoes.map((variacao, idx) => `${idx+1} - ${variacao.nome}:  R$${variacao.preco.toFixed(2)}`)
                client.sendText(message.from, `Estas são as nossas opções para ${produto2.nome}:\n${cardapioOpcoes.join('\n')}`)
            } else {
                if (novo) cliente.produtos.push(produto2)
                cliente.status = 'quantificando'
                client.sendText(message.from, 'Digite a quantidade')
            }
            cliente.attempts = 0
        } else if (cliente.status === 'selecionando2') {
            const cod = parseInt(msg, 10)
            const produto = cliente.produto.variacoes[cod-1]
            if (isNaN(cod) || !produto) {
                cliente.attempts += 1
                client.sendText(message.from, 'Desculpe, mas essa não é uma opção válida!\nEscolha uma das opções fornecidas')
                return;
            }
            cliente.produto = {...produto}
            delete cliente.produto.variacoes
            cliente.produto.quantidade = 0
            if(cliente.novo) {
                cliente.produtos.push(cliente.produto)
                delete cliente.novo
            }
            cliente.status = 'quantificando'
            client.sendText(message.from, 'Digite a quantidade')
        } else if (cliente.status === 'quantificando') {
            const qntd = parseInt(msg, 10)
            if (isNaN(qntd)){
                cliente.attempts += 1
                client.sendText(message.from, 'Por favor, digite um número válido!')
                return;
            }
            const {produto} = cliente
            produto.quantidade += qntd
            cliente.total += qntd * produto.preco
            cliente.status = 'decidindo'
            cliente.attempts = 0
            resumo(message.from, cliente)
            client.sendText(message.from, 'Por favor, selecione uma das opções abaixo:\n' +
                '1 - Para fechar o seu pedido\n' +
                '2 - Para adicionar outro produto\n' +
                '3 - Para remover um produto\n' +
                '0 - Para cancelar o seu pedido'
            )
        } else if (cliente.status === 'removendo') {
            const opcao = parseInt(msg, 10)
            const n = cliente.produtos.length
            if (isNaN(opcao) || opcao < 0 || opcao > n + 1){
                cliente.attempts += 1
                client.sendText(message.from, 'Desculpe, mas essa não é uma opção válida!\nEscolha uma das opções fornecidas')
                return;
            }
            if (opcao !== 0) {
                const produto = cliente.produtos[opcao - 1]
                cliente.total -= produto.preco * produto.quantidade
                const arr1 = cliente.produtos.slice(0, opcao-1)
                const arr2 = cliente.produtos.slice(opcao, cliente.produtos.length)
                cliente.produtos = arr1.concat(arr2)
            }
            cliente.attempts = 0

            if(cliente.produtos.length === 0) {
                client.sendText(message.from, 'Por favor, selecione uma das opções abaixo:\n')
                enviarCardapio(message.from)
                cliente.status = 'selecionando'
                return;
            }

            cliente.status = 'decidindo'
            resumo(message.from, cliente)
            client.sendText(message.from, 'Por favor, selecione uma das opções abaixo:\n' +
                '1 - Para fechar o seu pedido\n' +
                '2 - Para adicionar outro produto\n' +
                '3 - Para remover um produto\n' +
                '0 - Para cancelar o seu pedido'
            )
        } else if (cliente.status === 'lugar') {
            const endereco = msg.split('\n')
            let numero = 0
            try {
                numero = Number(endereco[1])
                if(isNaN(numero) || numero < 1 ||  numero > 5000) {
                    client.sendText(message.from, 'Desculpe, não consegui identificar o endereço, veja o exemplo acima e tente novamente')
                    return
                }
            } catch (ex) {
                client.sendText(message.from, 'Desculpe, não entendi o endereço, veja o exemplo acima e tente novamente')
                return
            }
            const [rua] = endereco
            const complemento = endereco.splice(2, endereco.length).join('\n')
            cliente.endereco = {
                numero,
                rua,
                complemento
            }
            if (!complemento) delete cliente.endereco.complemento

            cliente.status = 'pagamento'
            cliente.sendText(message.from, 'Selecione a forma de pagamento:\n')
        }

    } catch (err) {
        console.log(`${colors.FgRed}Internal Error`)
        console.log(cliente)
        throw err
    }
    
})
