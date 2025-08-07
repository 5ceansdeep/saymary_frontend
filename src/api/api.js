import axios from "axios";

const api = axios.create({
  baseURL: "https://api.saymary.site/api",
  withCredentials: true, // ✅ 세션 쿠키 자동 포함
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.warn("세션 만료. 로그인 페이지로 이동합니다.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
