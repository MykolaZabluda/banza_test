import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://learning.banzait.com/back/api/Event/",
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers["Authorization"] = `Bearer ${localStorage.getItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQb3J0YWwvdXNlcm5hbWUiOiJaYWJsdWRhTXlrb2xhIiwiUG9ydGFsL3VzZXJpZCI6IjY4ZDFhMzM2LTI1NzUtNDYyNy05NDdmLWMxYjhmMGFlZjNhOSIsImp0aSI6IjcxODJiNjRjLWVlMDUtNDJiNi04Njg4LTlmODAwNzc2ZTNkMCIsIlBvcnRhbC90b2tlbnZlcnNpb24iOiIxIiwiUG9ydGFsL2NvbnRhY3RpZCI6ImJlNTcwNGFmLTU0MjgtNGM5YS1hMGI2LWQ1NGQ2MjFiMDU3MiIsIlBvcnRhbC9tb2RpZmllZG9uIjoiNjM4NTMxOTQ5Nzk0NjgzMjIwIiwiZXhwIjoxNzE4NDYyMTc5LCJpc3MiOiJMZWFybmluZyIsImF1ZCI6IkxlYXJuaW5nIGNsaWVudCJ9.Q6CX6SoP1xuzNe5qiuNeBO7cszBuH6ITbdbEniABABo')}`;
        config.headers["Content-Type"] = "application/json";
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
