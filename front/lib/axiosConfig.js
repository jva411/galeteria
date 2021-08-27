import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://192.168.2.142:5001'
});

export default instance;
