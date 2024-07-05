import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://aigymapp-server.vercel.app',
    headers: {
        'x-access-token': localStorage.getItem("token"),
    },
});

export default axiosInstance;