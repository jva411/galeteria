import mongoose from 'mongoose'
import { getCollection } from 'utils/api/db'

export interface ProductData extends Omit<Product, '_id'> {}
export interface ProductFilter {
    _id?: string
    name?: string
    price?: number
    created_at?: number
}

export async function addProduct(data: ProductData) {
    const collection = await getCollection('product')
    return collection.insertOne(data)
}

export async function updateProduct(_id: string, data: ProductFilter) {
    const collection = await getCollection('product')
    return collection.updateOne({_id: new mongoose.Types.ObjectId(_id)}, {
        '$set': data
    })
}

export async function getProducts(filter: ProductFilter) {
    const collection = await getCollection('product')
    return collection.find(filter).toArray()
}

export async function removeProduct(_id: string) {
    const collection = await getCollection('product')
    return collection.deleteOne({_id})
}
