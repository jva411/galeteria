import { NextApiRequest, NextApiResponse } from 'next'
import { addDeliveryman, DeliverymanData, DeliverymanFilter, getDeliverymans, removeDeliveryman, updateDeliveryman } from 'utils/api/deliveryman'


export default async function handler(req: NextApiRequest, res: NextApiResponse & {flush: Function}) {
    switch (req.method) {
        case 'GET': {
            const filter: DeliverymanFilter = {}
            if (typeof req.query.active === 'string') filter.active = req.query.active === 'true'
            const data = await getDeliverymans(filter)
            res.json(data)
            break
        }

        case 'POST': {
            const data = req.body as DeliverymanData
            data.created_at = new Date().getTime()
            data.active = true
            addDeliveryman(data)
            res.statusCode = 201
            res.end()
            break
        }

        case 'PUT': {
            const newData = req.body as DeliverymanFilter
            const { _id } = newData
            delete newData._id
            updateDeliveryman(_id!, newData)
            res.statusCode = 201
            res.end()
            break
        }

        case 'DELETE': {
            const { _id } = req.body as Deliveryman
            removeDeliveryman(_id)
            res.statusCode = 204
            res.end()
            break
        }
    }
}
