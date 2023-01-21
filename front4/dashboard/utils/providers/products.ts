interface ProductsState {
    data: Product[]
    notify: (event: string, data?: any) => void
    listeners: StateListeners
}


export const productState: ProductsState = {
    data: [],
    notify: () => {},
    listeners: {}
}

productState.notify = (event, data) => Object.values(productState.listeners).forEach(handle => handle(event, data))
