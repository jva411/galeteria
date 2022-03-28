import axios from 'axios'

const ipv4 = process.env.IPv4

const instance = axios.create({
    baseURL: `http://${ipv4}:5001`
});

export default instance;
