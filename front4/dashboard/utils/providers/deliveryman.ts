interface DeliverymanState {
    data: Deliveryman[]
    notify: (event: string, data?: any) => void
    listeners: StateListeners
}


export const deliverymanState: DeliverymanState = {
    data: [],
    notify: () => {},
    listeners: {}
}

deliverymanState.notify = (event, data) => Object.values(deliverymanState.listeners).forEach(handle => handle(event, data))
