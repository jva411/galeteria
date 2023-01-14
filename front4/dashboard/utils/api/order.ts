import { getCollection } from 'utils/api/db'

export interface OrderData extends Omit<Order, '_id'> {}
export interface OrderFilter {
    _id: string
    deliveryman_id: string
    payment_method: PaymentMethod
}

export async function addOrder(data: OrderData) {
    const collection = await getCollection('order')
    return collection.insertOne(data)
}

export async function updateOrder(_id: string, data: OrderFilter) {
    const collection = await getCollection('order')
    return collection.updateOne({_id}, data)
}

export async function getOrders(filter: OrderFilter) {
    const collection = await getCollection('order')
    return collection.find(filter).toArray()
}

export async function removeOrder(_id: string) {
    const collection = await getCollection('order')
    return collection.deleteOne({_id})
}
