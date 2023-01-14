import { Axios } from 'axios'


const api = new Axios({
    'baseURL': 'http://localhost:3000/api/'
})


export default api
