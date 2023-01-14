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

interface Order {
    _id: string
    address: string
    products: ProductOrder[]
    total: number
    deliveryman_id: string
    payment_method: PaymentMethod
    payment_state: PaymentState
    order_state: OrderState
    created_at: number
}
