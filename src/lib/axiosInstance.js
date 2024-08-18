import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://ai.exploreit.nu',
    headers: {
        'x-access-token': localStorage.getItem("token"),
    },
});
export default axiosInstance;