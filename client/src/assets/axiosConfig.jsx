import axios from "axios";

const apiAxios = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});
//http://localhost:5000/api/login
export default apiAxios;
