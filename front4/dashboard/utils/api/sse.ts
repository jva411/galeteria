import { v4 as uuid4 } from 'uuid'
import { NextApiResponse } from 'next'


export interface FlushableResponse extends NextApiResponse {
    flush: Function
}
interface SSEHandler {
    id: string
    res: FlushableResponse
}

interface Room {
    name: string
    handlers: {[key: string]: SSEHandler}
}

const rooms: {[key: string]: Room} = {}

async function sendSSEEvent(res: FlushableResponse, event: string, data: string) {
    res.write(`\nevent: ${event}\n\ddata: ${data}\n\n`)
    res.flush()
}

export function createRoom(name: string) {
    rooms[name] = {name, handlers: {}}
}

export function addHandler(room: string, res: FlushableResponse) {
    let id = uuid4()
    while (id in rooms[room].handlers) id = uuid4()

    rooms[room].handlers[id] = {
        id,
        res: res
    }

    res.setHeader('Content-Type', 'text/event-stream')
    sendSSEEvent(res, 'setup', id)
}

export async function sendEvent(handler_id: string, room: string, event: string, data: string) {
    for (const handler of Object.values(rooms[room].handlers)) {
        if (handler.id === handler_id) continue
        try {
            sendSSEEvent(handler.res, event, data)
        } catch (ex) {
            delete rooms[room].handlers[handler.id]
        }
    }
}
