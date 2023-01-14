import { connect, set } from 'mongoose'


export function getConnection() {
    set('strictQuery', true)
    return connect('mongodb://localhost:27017/disk_frango')
}

export async function getCollection(name: string) {
    const conn = await getConnection()
    return conn.connection.db.collection(name)
}
