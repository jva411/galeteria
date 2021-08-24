import cors from 'cors'
import db from './db.js'
import lodash from 'lodash'
import express from 'express'
import { DateTime } from 'luxon'
import cardapio from './config/cardapio.js'
import enderecos from './config/enderecos.js'
import entregadores from './config/entregadores.js'
import { Collection, ObjectId } from 'mongodb'

const app = express()
app.use(express.json())
app.use(cors())

/** @type {Collection} */
const pedido = (await db()).pedido
// console.log(pedido)

/**
 * @typedef Pedido
 * @type {object}
 * @property {ObjectId} [_id]
 * @property {('naoSaiu'|'saiu'|'erro'|'cancelou'|'entregue')} estado
 * @property {string} entregador
 * @property {object[]} produtos
 * @property {string} observacoes
 * @property {number} taxaEntrega
 * @property {number} taxaCartao
 * @property {number} total
 * @property {number} troco
 * @property {boolean} isCartao
 * @property {string} rua
 * @property {number} numero
 * @property {string} complemento
 * @property {string} telefone
 * @property {number} iniciado
 * @property {object[]} atualizacoes
 * @property {number} lastUpdate
 */

/**
 * @type {Pedido[]}
 */
let pedidos

const start = DateTime.fromMillis(Date.now()).startOf('day')
const end = DateTime.fromMillis(Date.now()).endOf('day')
// console.log(start.toMillis())
// console.log(end.toMillis())

pedidos = await pedido.find({iniciado: {$gte: start.toMillis(), $lt: end.toMillis()}}).toArray()
let lastUpdate = Date.now()
// console.log(pedidos)

if(pedidos.length < 30) {
    let i = pedidos.length
    while(i<30) {
        pedidos.push({
            estado: 'naoSaiu',
            entregador: entregadores[0],
            produtos: [],
            observacoes: '',
            taxaEntrega: 1,
            taxaCartao: 0,
            total: 1.0,
            isCartao: false,
            rua: '',
            numero: 0,
            complemento: '',
            lastUpdate: Date.now()
        })
        i++
    }
}

let queue = []




app.get('/cardapio', (req, res) => {
    res.json(cardapio)
})
app.get('/entregadores', (req, res) => {
    res.json(entregadores)
})
app.get('/enderecos', (req, res) => {
    res.json(enderecos)
})
app.get('/pedidos', (req, res) => {
    res.json(pedidos)
})
app.get('/pedidos/update', (req, res) => {
    res.json({lastUpdate})
})
app.get('/pedidos/size', (req, res) => {
    res.json({size: pedidos.length})
})
app.get('/pedido/:index', (req, res) => {
    const index = Number(index)

    res.json(pedidos[index])
})
app.get('/pedido/:index/update', (req, res) => {
    const index = Number(index)

    res.json({update: pedidos[index].lastUpdate})
})
app.get('/impressao', (req, res) => {
    let Pedido = {}
    if(queue.length){
        Pedido = queue[0]
        if(queue.length > 1) {
            if(Pedido.printed) Pedido = queue[1]
            queue.shift()
        }
        Pedido.printed = true
    }
    const pedido = {...Pedido}
    delete pedido.printed
    res.json({Pedido})
})
app.put('/impressao', (req, res) => {
    queue.push(req.body.Pedido)

    res.json({msg: 'Ok'})
})


app.post('/pedido/:amount', (req, res) => {
    const amount = Number(req.params.amount)

    for(let i=0; i<amount; i++)
        pedidos.push({
            estado: 'naoSaiu',
            entregador: entregadores[0],
            produtos: [],
            observacoes: '',
            taxaEntrega: 1,
            taxaCartao: 0,
            total: 1.0,
            isCartao: false,
            rua: '',
            numero: 0,
            complemento: '',
            lastUpdate: Date.now()
        })
    lastUpdate = Date.now()

    res.json({
        index: pedidos.length-1
    })
})

app.put('/pedido/:index', async (req, res) => {
    const index = Number(req.params.index)
    const Pedido = pedidos[index]
    const lastEstado = Pedido.estado
    const body = req.body

    Object.assign(Pedido, body)
    const now = Date.now()
    Pedido.lastUpdate = now
    if(lastEstado !== Pedido.estado) {
        Pedido.atualizacoes.push({
            estado: Pedido.estado,
            timestamp: now
        })
    }

    if(!Pedido._id){
        if(Pedido.rua !== '') {
            const result = await pedido.insertOne(Pedido)
            Pedido._id = result.insertedId
            Pedido.iniciado = now
        }
    } else {
        const doc = {...Pedido}
        delete doc._id
        const id = `${Pedido._id}`
        const res = await pedido.updateOne({_id: ObjectId(id)}, {$set: doc})
        // console.log(res)
    }

    pedidos[index] = {...Pedido}
    res.json({message: 'Ok'})
})

app.delete('/pedido/:index', async (req, res) => {
    const index = Number(req.params.index)
    const Pedido = pedidos[index]

    const arr1 = pedidos.slice(0, index)
    const arr2 = pedidos.slice(index+1, pedidos.length)
    pedidos = arr1.concat(arr2)

    if(Pedido._id) {
        await pedido.deleteOne({_id: Pedido._id})
    }

    res.json({message: 'Ok'})
})



app.listen(5005, '0.0.0.0', 'localhost', () => {
    console.log('API ouvindo na porta 5005')
})


export default {
    enderecos,
    entregadores
}
