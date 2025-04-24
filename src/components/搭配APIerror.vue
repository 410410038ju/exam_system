<template>
  <!-- 錯誤視窗 -->
  <ErrorModal
    v-model="showError"
    :message="errorMsg"
    @confirm="handleRedirect"
  />
</template>

<script setup>
import { ref } from "vue";
import ErrorModal from "../../components/APIerror.vue";
import axios from "axios"; // 假設使用 axios 發送 API 請求

// 控制錯誤視窗顯示與否
const showError = ref(false);

// 儲存錯誤訊息
const errorMsg = ref({
  status: 0,
  code: 0,
  message: "",
});

// 假設 API 請求
const fetchData = async () => {
  try {
    // 假設你有一個 API 請求
    const response = await axios.get("/api/your-endpoint");
    // 處理回傳結果
    console.log(response.data);
  } catch (error) {
    // 如果 API 回傳錯誤，設置錯誤訊息並顯示錯誤視窗
    if (
      error.response.data.message === "請求未提供token" ||
      error.response.data.message === "token無效或已過期，請重新登入"
    ) {
      // 來自伺服器的錯誤回應（例如 404, 500 等）
      errorMsg.value = {
        status: error.response.status,
        code: error.response.data.code,
        message: error.response.data.message || "null",
      };
    } else if (error.request) {
      // 請求已發送但沒有收到回應
      errorMsg.value = {
        status: "timeout",
        code: 0,
        message: "伺服器回應超時，請稍後再試",
      };
    } else {
      // 發生其他錯誤（例如設定錯誤等）
      errorMsg.value = {
        status: 0,
        code: 0,
        message: "發生未知錯誤，請稍後再試",
      };
    }
    // 顯示錯誤視窗
    showError.value = true;
  }
};

// 當錯誤視窗按下確認後跳轉到首頁
const handleRedirect = () => {
  showError.value = false; // 關閉錯誤視窗
  router.push("/"); // 跳轉到首頁
};

// 假設在組件初始化時發送請求
fetchData();
</script>

<style scoped>
/* 可以在這裡調整樣式 */
</style>
