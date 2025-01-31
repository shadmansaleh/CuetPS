import Axios from "axios";

export default Axios.create({
  baseURL: __BACKEND_URL__,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
