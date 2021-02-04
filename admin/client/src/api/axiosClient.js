import axios from 'axios';
import queryString from 'query-string';
import { rootlink } from 'config'
const axiosClient = axios.create({
    baseURL: `${rootlink}holiday-effects/admin/server/product.php`,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {

    return config;
})
axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    // Handle errors
    throw error;
});
export default axiosClient;
