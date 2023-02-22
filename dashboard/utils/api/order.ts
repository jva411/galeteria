import { Types } from 'mongoose'
import { getCollection } from 'utils/api/db'

export interface OrderData extends Omit<Order, '_id'> {}
export interface OrderFilter extends Nullables<OrderData> {
    created_at?: number | any
}

export async function addOrder(data: OrderData) {
    const collection = await getCollection('order')
    return collection.insertOne(data)
}

export async function updateOrder(_id: string, data: OrderFilter) {
    const collection = await getCollection('order')
    return collection.updateOne({_id: new Types.ObjectId(_id)}, {
        '$set': data
    })
}

export async function getOrder(id: string) {
    const collection = await getCollection('order')
    return collection.findOne({_id: new Types.ObjectId(id)})
}

export async function getOrders(filter: OrderFilter, day?: Date | number) {
    const collection = await getCollection('order')
    const query = {...filter}
    delete query['created_at']
    if (day instanceof Date) {
        day.setUTCHours(0, 0, 0, 0)
        query['created_at'] = {
            '$gte': day.getTime(),
            '$lt': day.getTime() + 86400000
        }
    } else if (typeof day === 'number') {
        query['created_at'] = {
            '$gte': day,
            '$lt': day + 86400000
        }
    }
    return collection.find(query, {sort: {count: 'asc'}}).toArray()
}

export async function removeOrder(_id: string) {
    const collection = await getCollection('order')
    return collection.deleteOne({_id})
}
