interface DeliverymansState {
    data: Deliveryman[]
    notify: (event: string, data?: any) => void
    listeners: StateListeners
}


export const deliverymansState: DeliverymansState = {
    data: [],
    notify: () => {},
    listeners: {}
}

deliverymansState.notify = (event, data) => Object.values(deliverymansState.listeners).forEach(handle => handle(event, data))
