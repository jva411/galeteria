type PaymentMethod = 'money' | 'card' | 'pix' | 'fiado'
type PaymentState = 'pendent' | 'complete' | 'canceled'
type OrderState = 'new' | 'in_progress' | 'complete' | 'canceled'

type Nullables<T> = {
    [K in keyof T]?: T[K]
}

interface Deliveryman {
    _id: string
    name: string
    active: boolean
    description: string
    created_at: number
}

interface Product {
    _id: string
    name: string
    price: number
    created_at: number
}

interface ProductOrder {
    name: string
    price: number
    amount: number
}

interface Address {
    address: string
    number: number
    note: string
}

interface Order {
    _id: string
    count: number
    address: Address
    products: ProductOrder[]
    total: number
    tax: number
    payment: number
    note: string
    deliveryman_id: string
    payment_method: PaymentMethod
    payment_state: PaymentState
    order_state: OrderState
    toDelivery: boolean
    created_at: number
}



interface StateListeners {
    [key: string]: (event: string, data?: any) => void
}
