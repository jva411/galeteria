type PaymentMethod = 'money' | 'card' | 'pix' | 'fiado'
type PaymentState = 'pendent' | 'complete' | 'canceled'
type OrderState = 'new' | 'in_progress' | 'complete' | 'canceled'


interface Deliveryman {
    _id: string
    name: string
    active: boolean
    description: string
    created_at: number
}

interface Product {
    _id: string
    code: number
    name: string
    description: string
    price: number
    created_at: number
}

interface ProductOrder {
    _id: string
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
    address: Address
    products: ProductOrder[]
    total: number
    tax: number
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
