<!--
<template>
  <nav>
    <ul class="nav-list">
      <li>
        <router-link
          :to="{ name: 'UserList' }"
          class="nav-item"
          active-class="active"
          >人員管理</router-link
        >
      </li>
      <li>
        <router-link
          :to="{ name: 'CreateQuestion' }"
          class="nav-item"
          active-class="active"
          >新增考題</router-link
        >
      </li>
      <li>
        <router-link
          :to="{ name: 'ModifyQuestion' }"
          class="nav-item"
          active-class="active"
          >修改考題</router-link
        >
      </li>
      <li>
        <router-link
          :to="{ name: 'OpenExam' }"
          class="nav-item"
          active-class="active"
          >開放考題</router-link
        >
      </li>
      <li>
        <router-link
          :to="{ name: 'ViewExamRecords' }"
          class="nav-item"
          active-class="active"
          >查看考試紀錄</router-link
        >
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
nav {
  background-color: #333;
  padding: 10px 20px;
}

.nav-list {
  display: flex;
  justify-content: space-around;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 10px;
}

.nav-item:hover,
.nav-item.active {
  background-color: #575757;
  /*border-radius: 4px;*/
}
</style>
-->
<!--
<template>
  <nav class="navbar">
    <ul class="nav-list">
      <li>
        <router-link :to="{ name: 'UserList' }" class="nav-item" active-class="active">人員管理</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'CreateQuestion' }" class="nav-item" active-class="active">新增考題</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'ModifyQuestion' }" class="nav-item" active-class="active">修改考題</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'OpenExam' }" class="nav-item" active-class="active">開放考題</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'ViewExamRecords' }" class="nav-item" active-class="active">查看考試紀錄</router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed; /* 固定在頂部 */
  top: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  padding: 10px 20px;
  z-index: 1000; /* 確保它在其他內容上方 */
}

.nav-list {
  display: flex;
  justify-content: space-around;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 10px;
}

.nav-item:hover,
.nav-item.active {
  background-color: #575757;
}

</style>
-->
<template>
  <div class="container">
    <nav class="navbar">
      <div class="nav-title">管理系統</div>
      <ul class="nav-list">
        <li>
          <router-link
            :to="{ name: 'UserList' }"
            class="nav-item"
            active-class="active"
            >人員管理</router-link
          >
        </li>
        <li>
          <router-link
            :to="{ name: 'CreateQuestion' }"
            class="nav-item"
            active-class="active"
            >新增題庫</router-link
          >
        </li>
        <li>
          <router-link
            :to="{ name: 'ModifyQuestion' }"
            class="nav-item"
            active-class="active"
            >修改題庫</router-link
          >
        </li>
        <li>
          <router-link
            :to="{ name: 'ManageQuestionBankTypes' }"
            class="nav-item"
            active-class="active"
            >管理題庫類別</router-link
          >
        </li>
        <li>
          <router-link
            :to="{ name: 'OpenExam' }"
            class="nav-item"
            active-class="active"
            >開放測驗</router-link
          >
        </li>
        <li>
          <router-link
            :to="{ name: 'ViewExamRecords' }"
            class="nav-item"
            active-class="active"
            >查看測驗紀錄</router-link
          >
        </li>
        <li>
          <button class="changepassword-btn" @click="modifyPassword">
            修改密碼
          </button>
        </li>
        <li>
          <button class="logout-btn" @click="logout">登出</button>
        </li>
      </ul>
    </nav>
    <!-- 修改密碼表單 -->
    <div v-if="showPasswordModal" class="modal">
      <div class="modal-content">
        <h2>
          修改密碼
          <span @click="cancelChangePassword" class="close-btn">&times;</span>
        </h2>
        <label for="oldPassword">舊密碼：</label>
        <input
          type="password"
          v-model="oldPassword"
          placeholder="輸入舊密碼"
          class="input-field"
        />

        <label for="newPassword">新密碼：</label>
        <input
          type="password"
          v-model="newPassword"
          placeholder="輸入新密碼"
          class="input-field"
        />

        <label for="confirmPassword">再次輸入新密碼：</label>
        <input
          type="password"
          v-model="confirmPassword"
          placeholder="再次輸入新密碼"
          class="input-field"
        />

        <div class="button-container">
          <button @click="saveNewPassword" class="btn-primary">
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
  name: "AdminNavBar",
  methods: {
    logout() {
      // 在這裡處理登出邏輯，比如清除用戶的登入狀態
      //this.$store.dispatch("logout");
      localStorage.removeItem("loggedInUser");
      sessionStorage.clear();
      this.$router.push("/");
    },
  },
};
</script>
-->

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const showPasswordModal = ref(false); // 控制修改密碼對話框顯示
const oldPassword = ref(""); // 舊密碼
const newPassword = ref(""); // 新密碼
const confirmPassword = ref(""); // 確認新密碼

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// 檢查登入狀況
const checkLogin = () => {
  if (!loggedInUser) {
    alert("你尚未登入");
    router.push("/"); // 跳轉到 Home.vue（根路由）
  }
};

const modifyPassword = () => {
  showPasswordModal.value = true;
};

/*
const saveNewPassword = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find((user) => user.id === userId.value);

  if (!user) {
    alert("用戶未找到");
    return;
  }

  if (oldPassword.value !== user.password) {
    alert("舊密碼錯誤");
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert("新密碼和確認密碼不一致");
    return;
  }

  user.password = newPassword.value;

  localStorage.setItem("users", JSON.stringify(users));
  alert("密碼已成功修改");

  oldPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  showPasswordModal.value = false;
};
*/
const saveNewPassword = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // 確認是否有登入用戶
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = loggedInUser ? loggedInUser.id : null;

  if (!userId) {
    alert("請先登入");
    router.push("/");  // 跳轉到首頁
    return;
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    alert("用戶未找到");
    return;
  }

  if (oldPassword.value !== user.password) {
    alert("舊密碼錯誤");
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert("新密碼和確認密碼不一致");
    return;
  }

  user.password = newPassword.value;

  localStorage.setItem("users", JSON.stringify(users));
  alert("密碼已成功修改");

  // 清空表單
  oldPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  showPasswordModal.value = false;
};

const cancelChangePassword = () => {
  showPasswordModal.value = false;
};

const logout = () => {
  // 清除登入資訊
  localStorage.removeItem("loggedInUser");
  sessionStorage.clear();
  // localStorage.removeItem('authToken');
  // delete axios.defaults.headers['Authorization'];  // 清除預設 header
  router.push("/");
};

onMounted(() => {
  checkLogin();
});
</script>

<style scoped>
/* 設置背景顏色、水藍色風格 */
.navbar {
  background-color: #00bcd4; /* 水藍色背景 */
  color: white; /* 字體顏色為白色 */
  padding: 10px 30px; /* 上下左右留一些空間 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Arial", sans-serif;
  position: fixed; /* 固定在畫面上方 */
  top: 0; /* 置頂 */
  left: 0; /* 置左 */
  right: 0; /* 置右 */
  z-index: 1000; /* 確保導航欄在最上層 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 為了讓導航欄與內容區分開來，加入陰影效果 */
}

/* 留空間給固定導航欄的內容 */
body {
  padding-top: 70px; /* 設置內容與固定導航欄的距離 */
}

/* 標題文字樣式 */
.nav-title {
  font-size: 24px;
  font-weight: bold;
}

/* 導覽列列表樣式 */
.nav-list {
  list-style-type: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

/* 每一個導覽項目的樣式 */
.nav-item {
  color: white;
  text-decoration: none;
  font-size: 20px;
  padding: 8px;
  border-radius: 5px;
  transition: background-color 0.3s;
  display: flex; /* 使用 flex 來使內容垂直居中 */
  align-items: center; /* 垂直居中 */
  height: 40px; /* 固定高度 */
}

/* 滑鼠懸停效果 */
.nav-item:hover {
  background-color: #0097a7; /* 懸停時變為較深的水藍色 */
}

/* 修改密碼按鈕 */
/* 登出按鈕 */
.changepassword-btn,
.logout-btn {
  background-color: #ff0a0a; /* 粉紅色背景 */
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 8px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center; /* 垂直居中 */
  height: 40px; /* 固定高度 */
}

/* 修改密碼按鈕懸停效果 */
/* 登出按鈕懸停效果 */
.changepassword-btn:hover,
.logout-btn:hover {
  background-color: #a40202; /* 懸停時顏色更深 */
}

/* modal 設置 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative; 
}

.modal-content h2 {
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 24px;
}

label {
  font-size: 16px;
  display: flex;
  justify-content: space-between; /* 使 label 文字靠左，並讓表單元素水平置中 */
  align-items: center;
  text-align: left;
  width: 85%;
}

.input-field {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

/* 按鈕區域 */
.button-container {
  display: flex;
  justify-content: space-between; /* 在同一行中分開兩個按鈕 */
  width: 100%; /* 讓按鈕容器佔據 100% 宽度 */
  margin-top: 20px; /* 調整間距 */
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  widows: 45%;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-secondary {
  background-color: #f44336;
  color: white;
}

.btn-secondary:hover {
  background-color: #c43228;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 20px;
  font-size: 30px;
  cursor: pointer;
  color: #888;
}

.close-btn:hover {
  color: #333;
}
</style>
