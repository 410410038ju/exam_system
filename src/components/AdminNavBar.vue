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
        <button class="logout-btn" @click="logout">登出</button>
      </li>
    </ul>
  </nav>
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
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  // 清除登入資訊
  localStorage.removeItem("loggedInUser");
  sessionStorage.clear();
  router.push("/");
};
</script>

<style scoped>
/* 設置背景顏色、水藍色風格 */
.navbar {
  background-color: #00bcd4;  /* 水藍色背景 */
  color: white;  /* 字體顏色為白色 */
  padding: 10px 30px;  /* 上下左右留一些空間 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Arial', sans-serif;
  position: fixed;  /* 固定在畫面上方 */
  top: 0;  /* 置頂 */
  left: 0;  /* 置左 */
  right: 0;  /* 置右 */
  z-index: 1000;  /* 確保導航欄在最上層 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);  /* 為了讓導航欄與內容區分開來，加入陰影效果 */
}

/* 留空間給固定導航欄的內容 */
body {
  padding-top: 70px;  /* 設置內容與固定導航欄的距離 */
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
  display: flex;  /* 使用 flex 來使內容垂直居中 */
  align-items: center;  /* 垂直居中 */
  height: 40px;  /* 固定高度 */
}

/* 滑鼠懸停效果 */
.nav-item:hover {
  background-color: #0097a7;  /* 懸停時變為較深的水藍色 */
}

/* 登出按鈕樣式 */
.logout-btn {
  background-color: #ff0a0a;  /* 粉紅色背景 */
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 8px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;  /* 垂直居中 */
  height: 40px;  /* 固定高度 */
}

/* 登出按鈕懸停效果 */
.logout-btn:hover {
  background-color: #a40202;  /* 懸停時顏色更深 */
}

</style>

