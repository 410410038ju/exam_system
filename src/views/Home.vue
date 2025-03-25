<template>
  <div class="background">
    <div id="home-app" class="container">
      <div class="left-section">
        <img src="../assets/images/water.jpg" alt="圖片描述" class="image" />
      </div>

      <div class="right-section">
        <div v-if="!showChangePassword" class="login-container">
          <h1>歡迎進入考試系統</h1>
          <br />
          <label for="username">帳號：</label>
          <input
            type="text"
            v-model="username"
            placeholder="帳號"
            class="input-field"
          />

          <label for="password">密碼：</label>
          <input
            type="password"
            v-model="password"
            placeholder="密碼"
            class="input-field"
          />

          <button @click="login" class="btn-primary">登入</button>
          <button @click="toggleChangePassword" class="btn-secondary">
            修改密碼
          </button>
        </div>

        <div v-if="showChangePassword" class="login-container">
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
          />

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
          <button @click="cancelChangePassword" class="btn-secondary">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- vue 2
<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "", // 確認密碼
      showChangePassword: false,
      loggedInUser: null, // 用於儲存已登入用戶的資料
    };
  },
  methods: {
    /* login() {
      if (!this.username.trim() || !this.password.trim()) {
        alert("請輸入帳號和密碼");
        return;
      }

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(user => user.id === this.username && user.password === this.password);

      if (user) {
        if (user.role === "User") {
          this.$router.push('/user');  // 考生畫面
        } else if (user.role === "Admin") {
          this.$router.push('/admin');  // 管理者畫面
        }
      } else {
        alert("帳號或密碼錯誤");
        // 清空帳號和密碼輸入框的內容
        this.username = '';
        this.password = '';
      }
    },*/
    login() {
      if (!this.username.trim() || !this.password.trim()) {
        alert("請輸入帳號和密碼");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      let user = users.find((user) => user.id === this.username);

      // 如果使用者不存在，則返回錯誤
      if (!user) {
        alert("此帳號不存在");
        this.username = "";
        this.password = "";
        return;
      }

      // 檢查帳號是否已鎖定
      if (user.locked) {
        alert("此帳號已被鎖定，請聯絡管理員");
        return;
      }

      // 檢查密碼是否正確
      if (user.password === this.password) {
        // 密碼正確，重置錯誤次數
        user.failedAttempts = 0;
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedInUser", JSON.stringify(user)); // 儲存登入用戶資料

        // 根據角色跳轉到不同的頁面
        if (user.role === "User") {
          this.$router.push("/user"); // 考生畫面
        } else if (user.role === "Admin") {
          this.$router.push("/admin"); // 管理者畫面
        }
      } else {
        // 密碼錯誤，增加錯誤次數
        user.failedAttempts = (user.failedAttempts || 0) + 1;

        if (user.failedAttempts >= 3) {
          user.locked = true;
          alert("密碼錯誤 3 次，帳號已被鎖定！");
        } else {
          alert(`密碼錯誤，還剩下 ${3 - user.failedAttempts} 次機會`);
        }

        // 更新 users 陣列並儲存到 localStorage
        localStorage.setItem("users", JSON.stringify(users));
      }

      // 清空密碼輸入框
      this.password = "";
    },

    initializeAdmin() {
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const hasAdmin = users.some((user) => user.id === "admin");

      if (!hasAdmin) {
        users.push({
          name: "系統管理員",
          id: "admin",
          password: "1111",
          role: "Admin",
          locked: false, // 初始狀態下為未鎖定
          failedAttempts: 0, // 初始錯誤次數為 0
        });
        localStorage.setItem("users", JSON.stringify(users));
        console.log("已新增預設管理員帳號 admin");
      }
    },

    toggleChangePassword() {
      this.showChangePassword = !this.showChangePassword;
    },

    cancelChangePassword() {
      this.showChangePassword = false;
    },

    changePassword() {
      if (this.username === "admin") {
        alert("無法修改系統管理員密碼！");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((user) => user.id === this.username);

      if (user && user.password !== this.oldPassword) {
        alert("舊密碼錯誤，無法修改密碼！");
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        alert("兩次輸入的新密碼不一致，請重新輸入！");
        return;
      }

      if (user) {
        user.password = this.newPassword;
        localStorage.setItem("users", JSON.stringify(users));
        alert("密碼已成功更新！");
        this.cancelChangePassword(); // 完成後返回登入畫面
      } else {
        alert("無法找到該使用者，請檢查帳號是否正確！");
      }
    },
  },
  created() {
    this.initializeAdmin();
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      this.loggedInUser = loggedInUser; // 儲存登入的用戶資料
    }
  },
  mounted() {
    document.body.style.backgroundImage =
      "url('https://i.imgur.com/T63tNyz.jpeg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.height = "100vh";
  },
  beforeUnmount() {
    document.body.style.backgroundImage = ""; // 移除背景，避免影響其他頁面
  },
};
</script>
-->

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

// 使用 reactive 和 ref 來管理狀態
const username = ref("");
const password = ref("");
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const showChangePassword = ref(false);
const loggedInUser = ref(null);

const login = () => {
  if (!username.value.trim() || !password.value.trim()) {
    alert("請輸入帳號和密碼");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find((user) => user.id === username.value);

  if (!user) {
    alert("此帳號不存在");
    username.value = "";
    password.value = "";
    return;
  }

  if (user.locked) {
    alert("此帳號已被鎖定，請聯絡管理員");
    return;
  }

  if (user.password === password.value) {
    user.failedAttempts = 0;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    if (user.role === "EXAM_TAKER") {
      router.push("/user");
    } else if (user.role === "MANAGER") {
      router.push("/admin");
    } else if (user.role === "ADMIN") {
      router.push("/admin");
    }
  } else {
    user.failedAttempts = (user.failedAttempts || 0) + 1;

    if (user.failedAttempts >= 3) {
      user.locked = true;
      alert("密碼錯誤 3 次，帳號已被鎖定！");
    } else {
      alert(`密碼錯誤，還剩下 ${3 - user.failedAttempts} 次機會`);
    }

    localStorage.setItem("users", JSON.stringify(users));
  }

  password.value = "";
};

/* 登入API
const login = async () => {
  if (!username.value.trim() || !password.value.trim()) {
    alert("請輸入帳號和密碼");
    return;
  }

  try {
    const response = await axios.post("http://172.16.46.163/csexam/api/login", {
      empId: username.value,
      password: password.value,
    });

    const data = response.data;

    if (data.code === "0000") {
      const userData = data.data;

      
      // 存儲 token 到 localStorage
      // localStorage.setItem("token", userData.token);
      localStorage.setItem('authToken', userData.token);
    
      // 設置 axios 預設的 Authorization header
      axios.defaults.headers['Authorization'] = `Bearer ${userData.token}`;
    
      localStorage.setItem("loggedInUser", JSON.stringify(userData));

      const roles = userData.roleList.map((role) => role.roleName);
      if (roles.includes("ADMIN")) {
        router.push("/admin");
      } else if (roles.includes("MANAGER")) {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } else {
      alert(data.message || "登入失敗");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data.code === "UE002") {
        alert(error.response.data.message); //使用者不存在
      } else if (error.response.data.code === "UE006") {
        alert(error.response.data.message); //密碼錯誤，剩餘N次機會
      } else if (error.response.data.code === "UE003") {
        alert(error.response.data.message); //帳號被鎖住
      } else if (error.response.data.code === "9999") {
        alert(error.response.data.message); //系統忙碌中(其他問題)(在密碼被鎖住後，還沒解鎖前，登入第二次(含以後)都會出現這個)
      } else {
        alert("錯誤訊息:", error.response.data.message);
      }
    } else {
      alert("發生錯誤，請稍後再試");
    }
    console.error("登入失敗:", error);
  }
  username.value = "";
  password.value = "";
};
*/

const initializeAdmin = () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const hasAdmin = users.some((user) => user.id === "admin");

  if (!hasAdmin) {
    users.push({
      name: "系統管理員",
      id: "admin",
      password: "1111",
      role: "ADMIN",
      locked: false,
      failedAttempts: 0,
    });
    localStorage.setItem("users", JSON.stringify(users));
    console.log("已新增預設管理員帳號 admin");
  }
};

const toggleChangePassword = () => {
  showChangePassword.value = !showChangePassword.value;
};

const cancelChangePassword = () => {
  showChangePassword.value = false;
};

const changePassword = () => {
  if (username.value === "admin") {
    alert("無法修改系統管理員密碼！");
    return;
  }

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

  if (user) {
    user.password = newPassword.value;
    localStorage.setItem("users", JSON.stringify(users));
    alert("密碼已成功更新！");
    cancelChangePassword();
  } else {
    alert("無法找到該使用者，請檢查帳號是否正確！");
  }
};

/* 生命週期的處理
onMounted(() => {
  document.body.style.backgroundImage = "url('https://i.imgur.com/3IbGwzc.jpeg')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.height = "100vh";
});

onBeforeUnmount(() => {
  document.body.style.backgroundImage = ""; // 移除背景
});
*/

// 呼叫初始化 admin 用戶
initializeAdmin();
const loggedInUserData = JSON.parse(localStorage.getItem("loggedInUser"));
if (loggedInUserData) {
  loggedInUser.value = loggedInUserData;
}
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
  position: relative;  /* 讓container能夠被absolute定位 */
  top: 50%;  /* 距離父元素的50% */
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


