interface ProductsState {
    data: Product[]
    notify: (event: string, data?: any) => void
    listeners: StateListeners
}


export const productsState: ProductsState = {
    data: [],
    notify: () => {},
    listeners: {}
}

productsState.notify = (event, data) => Object.values(productsState.listeners).forEach(handle => handle(event, data))
