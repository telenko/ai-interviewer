import axios from "axios";

const BASE_API = import.meta.env.VITE_BACKEND_URL

console.log("BASE API", BASE_API);

const InterviewerApi = axios.create({
    baseURL: BASE_API,
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

export default InterviewerApi;