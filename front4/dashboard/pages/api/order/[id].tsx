import { NextApiRequest, NextApiResponse } from 'next'
import { OrderData, OrderFilter, updateOrder } from 'utils/api/order'
import { sendEvent } from 'utils/api/sse'


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'PUT': {
            const data = req.body as OrderFilter & {_id?: string}
            const id = data['_id']
            const updateData = {...data}
            delete updateData['_id']
            delete updateData['created_at']
            updateOrder(id!, updateData)
            const handler = req.headers['handler'] as string
            sendEvent(handler, 'orders', 'update-order', JSON.stringify(data))
            res.statusCode = 201
            res.end()
            break
        }
    }
}
