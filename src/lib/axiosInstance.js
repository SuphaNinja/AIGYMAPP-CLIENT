import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://aigymapp-server.vercel.app',
    headers: {
        'x-access-token': localStorage.getItem("token"),
    },
    withCredentials: true, // This is important for sending cookies and other credentials
});

export default axiosInstance;