import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import 'font-awesome/css/font-awesome.css';

createApp(App).use(createPinia()).use(router).mount("#app");

// 根據瀏覽器外觀顏色(淺/深)自動切換
// const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
// document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
