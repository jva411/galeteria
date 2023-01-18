interface DeliverymanState {
    data: Deliveryman[]
    notify: (event: string, data?: any) => void
    listeners: StateListeners
}


export const state: DeliverymanState = {
    data: [],
    notify: () => {},
    listeners: {}
}

state.notify = (event, data) => Object.values(state.listeners).forEach(handle => handle(event, data))
