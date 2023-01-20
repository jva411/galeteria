import { NextApiRequest, NextApiResponse } from 'next'
import { addProduct, getProducts, ProductData } from 'utils/api/product'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            const data = await getProducts({})
            res.json(data)
            break
        }
        case 'POST': {
            const data = req.body as ProductData
            data.name = data.name.toLowerCase()
            data.created_at = new Date().getTime()
            addProduct(data)
            res.statusCode = 201
            res.end()
            break
        }
    }
}
