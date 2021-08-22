import { MongoClient, Db, Collection } from 'mongodb'

const uri = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(uri)


let DB = {}

async function init() {
    try {
        await client.connect()
        const db = client.db('galeteria')
        const pedido = db.collection('pedido')
        DB = {
            db,
            pedido
        }
    } catch (err) {
        console.error(err)
    }

    return DB
}


export default init
