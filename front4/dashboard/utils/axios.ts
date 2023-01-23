import axios from 'axios'

interface DynamicOptions {
    id: string
}

export const dynamicOptions: DynamicOptions = {
    id: ''
}

const api = axios.create({
    'baseURL': 'http://localhost:3000/api/'
})

api.interceptors.request.use(req => {
    if (dynamicOptions.id) {
        (req.headers as any)['handler'] = dynamicOptions.id
    }
    return req
}, () => {})

export default api
