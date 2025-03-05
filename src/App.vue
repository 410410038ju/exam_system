<!--
<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
-->

<!--
<template>
  <div id="app">
    <h1>歡迎來到 Vue 3！</h1>
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
-->

<!--
<template>
  <div id="app">
    <div v-if="!showChangePassword" class="login-container">
      <h1>歡迎進入考試系統</h1>
      <h3>登入</h3>
      <label for="username">帳號：</label>
      <input type="text" v-model="username" placeholder="帳號">
      
      <label for="password">密碼：</label>
      <input type="password" v-model="password" placeholder="密碼">
      
      <button @click="login">登入</button>
      <button @click="toggleChangePassword">修改密碼</button>
    </div>

    <div v-if="showChangePassword" class="login-container">
      <h3>修改密碼</h3>
      <label for="old-password">舊密碼：</label>
      <input type="password" v-model="oldPassword" placeholder="輸入舊密碼">

      <label for="new-password">新密碼：</label>
      <input type="password" v-model="newPassword" placeholder="輸入新密碼">
      
      <label for="confirm-password">再次輸入新密碼：</label>
      <input type="password" v-model="confirmPassword" placeholder="再次輸入新密碼">
      
      <button @click="changePassword">儲存新密碼</button>
      <button @click="cancelChangePassword">取消</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      showChangePassword: false,
    };
  },
  methods: {
    // 登入方法
    login() {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(user => user.id === this.username && user.password === this.password);

      if (user) {
        if (user.role === "User") {
          window.location.href = "exam_dashboard.html"; // 考生畫面
        } else if (user.role === "Admin") {
          window.location.href = "admin_dashboard.html"; // 管理者畫面
        }
      } else {
        alert("帳號或密碼錯誤");
      }
    },
    
    // 初始化時檢查是否已有管理員帳號
    initializeAdmin() {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const hasAdmin = users.some(user => user.id === "admin");

      if (!hasAdmin) {
        users.push({ name: "系統管理員", id: "admin", password: "1111", role: "Admin" });
        localStorage.setItem("users", JSON.stringify(users));
        console.log("已新增預設管理員帳號 admin");
      }
    },

    // 顯示修改密碼界面
    toggleChangePassword() {
      this.showChangePassword = !this.showChangePassword;
    },

    // 取消修改密碼，回到登入畫面
    cancelChangePassword() {
      this.showChangePassword = false;
    },

    // 修改密碼
    changePassword() {
      if (this.username === "admin") {
        alert("無法修改系統管理員密碼！");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(user => user.id === this.username);

      if (user && user.password !== this.oldPassword) {
        alert("舊密碼錯誤，無法修改密碼！");
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        alert("兩次輸入的密碼不一致，請重新輸入！");
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
    }
  },
  created() {
    this.initializeAdmin();
  }
}
</script>

<style scoped>
.login-container {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  width: 300px;
  margin: auto;
}

input {
  display: block;
  margin-bottom: 10px;
}

button {
  margin-top: 10px;
}
</style>

-->

<template>
  <router-view />
  <!--<div id="app" class="app"></div>-->
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>

.content {
  padding-top: 20px; 
}
</style>