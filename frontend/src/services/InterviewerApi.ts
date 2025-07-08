import axios from "axios";

const BASE_API = import.meta.env.VITE_BACKEND_URL

console.log("BASE API", BASE_API);

const InterviewerApi = axios.create({
    baseURL: BASE_API,
});

export default InterviewerApi;