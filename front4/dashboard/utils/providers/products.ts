interface ProductsState {
    data: Product[]
    notify: (event: string, data?: any) => void
    listeners: StateListeners
}


export const state: ProductsState = {
    data: [],
    notify: () => {},
    listeners: {}
}

state.notify = (event, data) => Object.values(state.listeners).forEach(handle => handle(event, data))
