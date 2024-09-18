import axios from "axios";

console.log(import.meta.env.VITE_API_URI)
const axiosConfig = axios.create({ baseURL: import.meta.env.VITE_API_URI });

export default axiosConfig;