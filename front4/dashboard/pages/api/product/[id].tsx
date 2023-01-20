import { NextApiRequest, NextApiResponse } from 'next'
import { ProductFilter, updateProduct } from 'utils/api/product'


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'PUT': {
            const data = req.body as ProductFilter
            updateProduct(req.query['id'] as string, data)
            res.statusCode = 201
            res.end()
            break
        }
    }
}
