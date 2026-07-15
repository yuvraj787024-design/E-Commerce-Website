import axios from "axios"

const api = axios.create({
    baseURL: "https://e-commerce-website-0vzp.onrender.com/api/food",
    withCredentials:true,
});

export default api;