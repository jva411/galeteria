import { getCollection } from 'utils/api/db'

export interface DeliverymanData extends Omit<Deliveryman, '_id'> {}
export interface DeliverymanFilter {
    _id?: string
    name?: string
    active?: boolean
    description?: string
}

export async function addDeliveryman(data: DeliverymanData) {
    const collection = await getCollection('deliveryman')
    return collection.insertOne(data)
}

export async function updateDeliveryman(_id: string, data: DeliverymanFilter) {
    const collection = await getCollection('deliveryman')
    return collection.updateOne({_id}, data)
}

export async function getDeliverymans(filter: DeliverymanFilter) {
    const collection = await getCollection('deliveryman')
    const cursor = collection.find(filter)
    return cursor.toArray()
}

export async function removeDeliveryman(_id: string) {
    const collection = await getCollection('deliveryman')
    return collection.deleteOne({_id})
}
