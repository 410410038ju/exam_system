<!--
<template>
  <div>
    <h1>管理員控制台</h1>
    <router-link to="/">回首頁</router-link>
  </div>
</template>
  
<script>
  export default {
    name: 'AdminDashboard',
  };
</script>
-->

<template>
  <div class="background">
    <div class="container">
      <!-- 左側標語區 -->
      <div class="title">
        <img :src="cheerImage" alt="cheer" class="logo_image" />
        <div class="text-container">
          <h1 class="title_text">歡迎來到管理者介面</h1>
          <p class="subtitle">Welcome to the administrator interface~</p>
        </div>
      </div>

      <!-- 右側按鈕區 -->
      <div class="Buttons">
        <button @click="navigateTo('user_list')">人員管理</button>
        <button @click="navigateTo('create_question')">新增題庫</button>
        <button @click="navigateTo('modify_question')">修改題庫</button>
        <button @click="navigateTo('manage_question_bank_types')">
          管理題庫類別
        </button>
        <button @click="navigateTo('open_exam')">開放測驗</button>
        <button @click="navigateTo('view_exam_records')">查看測驗紀錄</button>
        <button @click="logout" class="logout-btn">登出</button>
      </div>
    </div>
  </div>
</template>

<!-- vue 2
<script>
import cheerImage from '@/assets/images/cheer.png';
export default {
  data() {
    return {
      cheerImage // 在 data 中保存圖片的路徑
    };
  },
  methods: {
    // 導航到指定頁面
    navigateTo(page) {
      this.$router.push(`/${page}`);
    },
    // 登出方法
    logout() {
      // 清除登入資訊
      localStorage.removeItem("loggedInUser");
      sessionStorage.clear();  // 確保 sessionStorage 也被清除

      // 跳轉到登入頁面
      this.$router.push('/');  // 假設首頁的路由是 '/'
    }
  },
  mounted() {
    document.body.style.backgroundImage = "url('https://i.imgur.com/l7KF7dm.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.height = "100vh";
  },
  beforeUnmount() {
    document.body.style.backgroundImage = ""; // 移除背景，避免影響其他頁面
  }
}
</script>
-->

<!-- 有vue3但不多
<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import cheerImage from "@/assets/images/cheer.png";

export default {
  setup() {
    const router = useRouter();
    const cheerImageRef = ref(cheerImage);

    // 導航到指定頁面
    const navigateTo = (page) => {
      router.push(`/${page}`);
    };

    // 登出方法
    const logout = () => {
      localStorage.removeItem("loggedInUser");
      sessionStorage.clear();
      router.push("/");
    };

    onMounted(() => {
      document.body.style.backgroundImage =
        "url('https://i.imgur.com/l7KF7dm.png')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.height = "100vh";
    });

    onBeforeUnmount(() => {
      document.body.style.backgroundImage = "";
    });

    return {
      cheerImage: cheerImageRef,
      navigateTo,
      logout,
    };
  },
};
</script>
-->

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import cheerImage from "../assets/images/cheer.png";
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// 檢查登入狀況
const checkLogin = () => {
  if (!loggedInUser) {
    alert("你尚未登入");
    router.push("/"); // 跳轉到 Home.vue（根路由）
  }
};

const router = useRouter();
const cheerImageRef = ref(cheerImage);

// 導航到指定頁面
const navigateTo = (page) => {
  router.push(`/${page}`);
};

// 登出方法
const logout = () => {
  localStorage.removeItem("loggedInUser");
  sessionStorage.clear();
  // localStorage.removeItem('authToken');
  // delete axios.defaults.headers['Authorization'];  // 清除預設 header
  router.push("/");
};

onMounted(() => {
  checkLogin();
  /*document.body.style.backgroundImage =
    "url('https://i.imgur.com/l7KF7dm.png')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.height = "100vh";*/
});

/*
onBeforeUnmount(() => {
  document.body.style.backgroundImage = "";
});
*/
</script>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  margin: 0 auto; /* 水平置中 */
  background-image: url('../assets/images/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 主要容器 */
.container {
  background-attachment: fixed; /* 讓背景固定不隨著滾動 */
  display: flex;
  justify-content: center;
  gap: 0px;
  align-items: center;
  width: 85%;
  height: 100%;
  margin: auto;
  padding: 20px;
  box-sizing: border-box;
}

/* 左側標語區 */
.title {
  flex: 1;
  text-align: left;
  color: rgb(2, 2, 33);
  text-shadow: 2px 2px 5px rgba(180, 166, 228, 0.5);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 200px 0;
}

/* 標誌圖片 */
.logo_image {
  width: 50px;
  margin-left: 10px;
}

/* 文字容器 */
.text-container {
  display: flex;
  flex-direction: column;
}

/* 標題文字 */
.title_text {
  font-size: 40px;
  margin: 0;
}

/* 副標題 */
.subtitle {
  font-size: 20px;
  color: #666;
  margin: 15px 0 0;
}

/* 右側按鈕區 */
.Buttons {
  flex: 1;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  padding: 30px;
  margin: auto;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* 按鈕樣式 */
button {
  width: 400px;
  padding: 15px;
  margin: 10px 0;
  background-color: #f8f5ed;
  border: 1px solid #4a4a3f;
  color: #4a4a3f;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s, transform 0.2s;
}

/* 按鈕 hover 效果 */
button:hover {
  background-color: #eae5d7;
  transform: scale(1.05);
}

.logout-btn {
  background-color: #fbccea;
}

.logout-btn:hover {
  background-color: #eaacd5;
}
</style>
