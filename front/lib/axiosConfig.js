import axios from 'axios';
// import https from 'https';

const instance = axios.create({
    baseURL: 'http://localhost:5001'
    // withCredentials: true,
    // httpsAgent: new https.Agent({  
    //     rejectUnauthorized: false
    // })
});

export default instance;
