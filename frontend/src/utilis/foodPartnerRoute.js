import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000/api/food-partner",
    withCredentials:true,
});

export default api;