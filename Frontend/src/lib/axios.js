import axios from 'axios'

const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true//Brower will send cokkies automaticaly to the server on every single req
});
export default axiosInstance;