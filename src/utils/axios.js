import axios from 'axios';
import { useErrorMessage } from '@/composables/useErrorMessage';

const { showError } = useErrorMessage();

const axiosInstance = axios.create({
  baseURL: '/api', // 修改為你的 API 基本 URL
  timeout: 10000, // 設定超時
});

axiosInstance.interceptors.response.use(
  (response) => response,  // 正常響應直接返回
  (error) => {
    showError(error);  // 捕捉錯誤並顯示
    return Promise.reject(error); // 讓錯誤繼續向下傳遞
  }
);

export default axiosInstance;
// import axiosInstance from '@/utils/axios'; // 引入已配置的 axios 實例