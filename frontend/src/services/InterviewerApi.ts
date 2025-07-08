import axios from "axios";

export const BASE_API_URL = import.meta.env.VITE_BACKEND_URL

console.log("BASE_API_URL", BASE_API_URL);

const InterviewerApi = axios.create({
    baseURL: BASE_API_URL,
});

export default InterviewerApi;