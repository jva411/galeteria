import { ControlledOrder } from 'pages/api/order'

export interface OrderState {
    order: ControlledOrder,
    listeners: StateListeners
    notify: (event: string, data?: any) => void
}


interface OrdersState {
    orders: OrderState[]
    notify: (event: string, data?: any) => void
    listeners: StateListeners
}


export const ordersState: OrdersState = {
    orders: [],
    notify: () => {},
    listeners: {}
}

ordersState.notify = (event, data) => Object.values(ordersState.listeners).forEach(handle => handle(event, data))

export function addOrders(...orders: ControlledOrder[]) {
    for (const order of orders) {
        const os: OrderState = {
            order,
            listeners: {},
            notify: () => {}
        }
        os.notify = (event, data) => Object.values(os.listeners).forEach(handle => handle(event, data))
        ordersState.orders.push(os)
        ordersState.notify('add-orders')
    }
}

export function updateOrder(order: ControlledOrder, changesOnly = false) {
    const os = ordersState.orders[order.count]
    os.order = changesOnly? {...os.order, ...order} : order
    os.notify('update-order', os.order)
}
