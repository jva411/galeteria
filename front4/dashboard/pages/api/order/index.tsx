import { stringify } from 'json5'
import { NextApiRequest, NextApiResponse } from 'next'
import { addOrder, getOrders, OrderData, OrderFilter } from 'utils/api/order'
import { addHandler, createRoom, FlushableResponse, sendEvent } from 'utils/api/sse'


interface ControlledOrder extends Order {
    saved: boolean
    locked: boolean
}

function getEmptyOrder(index: number): ControlledOrder {
    return {
        _id: '',
        count: index,
        address: {
            address: '',
            number: 0,
            note: ''
        },
        created_at: new Date().getTime(),
        deliveryman_id: '',
        note: '',
        order_state: 'new',
        payment_method: 'money',
        payment_state: 'pendent',
        products: [],
        tax: 2.0,
        toDelivery: true,
        total: 0.0,
        saved: false,
        locked: false
    }
}

const today: Date = new Date()
const orders: ControlledOrder[] = []
getOrders({}, today).then(data => {
    orders.push(...data.map(order => Object.assign(order, {saved: true})) as unknown as ControlledOrder[])
    for (let i=orders.length; i<100; i++) orders.push(getEmptyOrder(i))
})
createRoom('orders')


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            const { day, ...query } = req.query
            if (day == null) {
                res.json(orders)
                break
            }
            if ('sse' in query) {
                addHandler('orders', res as FlushableResponse)
                break
            }

            const data = await getOrders(query as unknown as OrderFilter, Number(day) || undefined)
            res.json(data)
            break
        }
        case 'POST': {
            const data = req.body as OrderData & {_id?: string, saved: boolean, locked: boolean}
            delete data['_id']
            const result = await addOrder(data)
            data['_id'] = result.insertedId.toString()
            data['saved'] = true
            data['locked'] = false
            orders[data.count] = data as ControlledOrder
            res.json(data)
            const handler = req.headers['handler'] as string
            sendEvent(handler, 'orders', 'update-order', stringify(data))
            break
        }
        case 'PATCH': {
            const handler = req.headers['handler'] as string
            const count = Number(req.query['count'])
            const lock = req.query['lock'] === 'true'
            orders[count].locked = lock
            sendEvent(handler, 'orders', lock? 'lock': 'unlock', count.toString())
            res.statusCode = 201
            res.end()
        }
    }
}
