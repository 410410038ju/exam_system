<!-- 
 <template>
  <div class="change-password-container">
    <h2>修改密碼</h2>
    <label for="old-password">舊密碼：</label>
    <input
      type="password"
      v-model="oldPassword"
      placeholder="輸入舊密碼"
      class="input-field"
    />

    <label for="new-password">新密碼：</label>
    <input
      type="password"
      v-model="newPassword"
      placeholder="輸入新密碼"
      class="input-field"
      :class="{ 'invalid-input': !isPasswordValid }"
      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$"
      title="密碼需至少 12 個字元，包含大寫字母、小寫字母和數字"
    />
    <div v-if="!isPasswordValid" class="message error-message">
      密碼需至少 12 個字元，包含大寫字母、小寫字母和數字
    </div>
    <div v-if="isPasswordValid" class="message correct-message">
      密碼符合規定
    </div>

    <label for="confirm-password">再次輸入新密碼：</label>
    <input
      type="password"
      v-model="confirmPassword"
      placeholder="再次輸入新密碼"
      class="input-field"
    />

    <button @click="changePassword" class="btn-primary">儲存新密碼</button>
    <button @click="cancelChangePassword" class="btn-secondary">取消</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isPasswordValid = ref(false);

// 檢查密碼是否符合要求
watch(newPassword, () => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;
  isPasswordValid.value = regex.test(newPassword.value);
});

const changePassword = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((user) => user.id === "admin"); // 假設這是登入的帳號ID

  if (user && user.password !== oldPassword.value) {
    alert("舊密碼錯誤，無法修改密碼！");
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert("兩次輸入的新密碼不一致，請重新輸入！");
    return;
  }

  if (!isPasswordValid.value) {
    alert("密碼不符合要求");
    return;
  }

  if (user) {
    user.password = newPassword.value;
    localStorage.setItem("users", JSON.stringify(users));
    alert("密碼已成功更新！");
    router.push("/home"); // 修改密碼後跳轉回首頁或其他頁面
  } else {
    alert("無法找到該使用者，請檢查帳號是否正確！");
  }
};

const cancelChangePassword = () => {
  router.push("/home"); // 取消修改密碼後跳轉回首頁
};
</script>

<style scoped>
/* 可以將CSS樣式移動到此頁面 */
.change-password-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f4f4f9;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

input {
  margin: 10px 0;
  padding: 12px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  width: 100%;
  cursor: pointer;
  margin-top: 20px;
}

.btn-primary {
  background-color: #42b883;
  color: white;
}

.btn-primary:hover {
  background-color: #369d6d;
}

.btn-secondary {
  background-color: #f4f4f9;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.message {
  height: 50px;
}

.error-message {
  color: red;
}

.correct-message {
  color: green;
}
</style>
 -->

<template>
  <div class="background">
    <div id="home-app" class="container">
      <div class="left-section">
        <img src="../assets/images/lake.jpg" alt="圖片描述" class="image" />
      </div>

      <div class="right-section">
        <div class="login-container">
          <h2>修改密碼</h2>
          <label for="old-password">舊密碼：</label>
          <input
            type="password"
            v-model="oldPassword"
            placeholder="輸入舊密碼"
            class="input-field"
          />

          <label for="new-password">新密碼：</label>
          <input
            type="password"
            v-model="newPassword"
            placeholder="輸入新密碼"
            class="input-field"
            :class="{ 'invalid-input': !isPasswordValid }"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$"
            title="密碼需至少 12 個字元，包含大寫字母、小寫字母和數字"
          />
          <div v-if="!isPasswordValid" class="message error-message">
            <i class="fas fa-times-circle" style="color: red"></i>
            密碼需至少 12 個字元，包含大寫字母、小寫字母和數字
          </div>
          <div v-if="isPasswordValid" class="message correct-message">
            <i class="fas fa-check-circle" style="color: green"></i>
            密碼符合規定
          </div>

          <label for="confirm-password">再次輸入新密碼：</label>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="再次輸入新密碼"
            class="input-field"
          />

          <button @click="changePassword" class="btn-primary">
            儲存新密碼
          </button>
          <!-- <button @click="cancelChangePassword" class="btn-secondary">
            取消
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

// 使用 reactive 和 ref 來管理狀態
const username = ref("");
const password = ref("");
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isPasswordValid = ref(false);
const empId = JSON.parse(localStorage.getItem("empid"));

// 檢查密碼是否符合要求
// 監聽密碼變更，並且檢查密碼是否合法
watch(newPassword, () => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;
  isPasswordValid.value = regex.test(newPassword.value);
});

// 修改密碼
/*
const changePassword = () => {

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((user) => user.id === username.value);

  if (user && user.password !== oldPassword.value) {
    alert("舊密碼錯誤，無法修改密碼！");
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert("兩次輸入的新密碼不一致，請重新輸入！");
    return;
  }

  if (!isPasswordValid.value) {
    alert("密碼不符合要求");
    return;
  }

  if (user) {
    user.password = newPassword.value;
    localStorage.setItem("users", JSON.stringify(users));
    alert("密碼已成功更新！");
    router.push("/"); //改成跳轉到首頁
  } else {
    alert("無法找到該使用者，請檢查帳號是否正確！");
  }
};
*/

// 修改密碼API
const changePassword = async () => {
  const empId = localStorage.getItem("empid"); // 從 localStorage 取得 empId

  if (!empId) {
    alert("找不到員工 ID，請重新登入！");
    router.push("/"); // 若找不到 empId，導回首頁
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert("兩次輸入的新密碼不一致，請重新輸入！");
    return;
  }

  if (!isPasswordValid.value) {
    alert("密碼不符合要求");
    return;
  }

  try {
    const response = await axios.put(
      "http://172.16.46.163/csexam/api/change-password",
      {
        empId: empId,
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
        // 舊密碼和新密碼一樣，API會給過
      }
    );

    alert("密碼已成功更新，請重新登入");
    router.push("/"); // 修改成功後跳轉到首頁
  } catch (error) {
    if (error.response) {
      if (error.response.data.code === "UE006") {
        alert("舊密碼錯誤", error.response.data.message.slice(-6)); 
        // alert(error.response.data.message.slice(-6));
      } else if (error.response.data.code) {
        alert(error.response.data.message);
        // UE002 使用者不存在
        // UE003 帳號被鎖住，找主管解鎖->帳號被鎖時，無法自行更改密碼
        // UE006 密碼錯誤，剩餘N次機會
        // 9999  系統忙碌中(其他問題)
        // UE005 密碼過期，可是不能改密碼
      } else {
        alert("錯誤訊息:", error.response.data.message);
      }
    } else {
      alert("發生錯誤，請稍後再試");
    }
    console.error("修改密碼失敗", error);
    alert(error.response?.data?.message || "修改密碼失敗，請稍後再試！");
  }

  oldPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
};

onMounted(() => {
  // 刪除 localStorage 中的 authToken
  localStorage.removeItem("authToken");
});
</script>

<!-- 原始版本 -->
<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: #af198c;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  margin: 0 auto; /* 水平置中 */
  background-image: url("../assets/images/home.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/*
  #app {
    display: flex;
    width: 90%;
    overflow: hidden;
    justify-content: center;
    align-items: center;
  }
  
  .container {
    display: flex;
    width: 100%;
    height: 500px;
    max-width: 1200px; 
    margin: 0; 
    border: 1px solid #8fffff; 
    border-radius: 12px; 
    background-color: #8fffff;
    overflow: hidden;
    justify-content: center;
    align-items: center;
  }*/

#home-app {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: auto;
  position: relative; /* 讓container能夠被absolute定位 */
  top: 50%; /* 距離父元素的50% */
  transform: translateY(-50%); /* 使元素垂直置中 */
}

.container {
  height: 500px;
  max-width: 80%;
  border: 2rem solid #8fffff;
  border-radius: 12px;
  background-color: #8fffff;
}

.left-section,
.right-section {
  overflow: hidden;
}

.left-section {
  flex: 1;
  position: relative;
  height: 100%;
  object-fit: cover;
}

.image {
  width: 100%;
  height: 500px;
  object-fit: cover;
}

.right-section {
  flex: 0 0 350px; /* 固定寬度 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #8fffff;
  margin: 0;
  padding: 0;
}

.login-container {
  background-color: #8fffff;
  padding: 30px;
  /*border-radius: 15px;*/
  /*box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);*/
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column; /* 讓元素垂直排列 */
  gap: 5px; /* 元素之間的間隔 */
}

label {
  font-size: 16px;
  display: block;
  text-align: left;
  color: #333;
  margin: 0;
}

.input-field {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
}

.input-field:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 5px rgba(66, 184, 131, 0.5);
}

.message {
  height: 50px;
}

.error-message {
  color: red;
  justify-content: center; /* 水平置中 */
  align-items: center;
}

.correct-message {
  color: green;
  /* display: flex;
    justify-content: center; 
    align-items: center;  */
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  width: 100%;
  cursor: pointer;
  margin-top: 20px;
  font-size: 16px;
}

.btn-primary {
  background-color: #42b883;
  color: #fff;
}

.btn-primary:hover {
  background-color: #369d6d;
}

.btn-secondary {
  background-color: #f4f4f9;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

h1 {
  color: #333;
  font-size: 32px;
  margin-bottom: 20px;
}

h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}
/*
  h3 {
    color: #333;
    font-size: 18px;
    margin-bottom: 10px;
  }
  */
</style>
