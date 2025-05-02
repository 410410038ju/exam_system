<template>
  <div class="profile-page">
    <!-- 頁面頭部 -->
    <div class="header">
      <div class="user-info">
        <span class="user-id">員編：{{ userId }}</span>
        <span class="name">姓名：{{ userName }}</span>
      </div>
      <div class="actions">
        <button @click="modifyPassword" class="button">修改密碼</button>
        <button @click="logout" class="button logout-btn">登出</button>
      </div>
    </div>

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

        <label for="confirmPassword">再次輸入新密碼：</label>
        <input
          type="password"
          v-model="confirmPassword"
          placeholder="再次輸入新密碼"
          class="input-field"
          @keyup.enter="saveNewPassword"
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

    <!-- 測驗資料表格 -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>測驗名稱</th>
            <th>考試類型</th>
            <th>答題時間</th>
            <th>及格分數</th>
            <th>測驗進行日期</th>
            <th>出題者</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in exams" :key="exam.examId">
            <td>{{ exam.title }}</td>
            <td>{{ getKindName(exam.kind) }}</td>
            <td>{{ exam.limitTime }} 分鐘</td>
            <td>{{ exam.targetScore }} 分</td>
            <td>
              {{ exam.startDate?.replaceAll("-", "/") }} 至
              {{ exam.endDate?.replaceAll("-", "/") }}
            </td>
            <td>{{ exam.creatorId }}</td>
            <td>
              <button
                v-if="exam.status === 'ongoing'"
                @click="startExam(exam.examId)"
                class="start-exam-btn"
              >
                開始測驗
              </button>
              <span v-else-if="exam.status === 'done'">已結束</span>
              <span v-else>已取消</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<!-- vue 2
<script>
export default {
  data() {
    return {
      userName: "",
      userId: "",
      exams: [
        {
          id: 1,
          name: "數學期末考",
          scope: "代數、幾何",
          duration: 60,
          startTime: "2025-02-20 09:00",
          endTime: "2025-02-20 10:00",
          passingScore: 60, // 及格分數
          creator: "李老師", // 出題者
          category: "數學", // 業務種類
          questionsCount: 50, // 題數
          examType: "一般考試", // 考試類型
          status: "notStarted", // 考試狀態
        },
        {
          id: 2,
          name: "英文聽力測驗",
          scope: "聽力理解",
          duration: 30,
          startTime: "2025-02-21 14:00",
          endTime: "2025-02-21 14:30",
          passingScore: 40, // 及格分數
          creator: "王老師", // 出題者
          category: "語言", // 業務種類
          questionsCount: 30, // 題數
          examType: "補考", // 考試類型
          status: "completed", // 考試狀態
        },
      ],
      showPasswordModal: false, // 控制修改密碼對話框顯示
      oldPassword: "", // 舊密碼
      newPassword: "", // 新密碼
      confirmPassword: "", // 確認新密碼
    };
  },
  mounted() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      this.userName = loggedInUser.name;
      this.userId = loggedInUser.id;
    }
  },
  methods: {
    // 顯示修改密碼表單
    modifyPassword() {
      this.showPasswordModal = true; // 顯示修改密碼對話框
    },
    saveNewPassword() {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // 找到當前登入的用戶
      const user = users.find((user) => user.id === this.userId);

      if (!user) {
        alert("用戶未找到");
        return;
      }

      // 檢查舊密碼是否正確
      if (this.oldPassword !== user.password) {
        alert("舊密碼錯誤");
        return;
      }

      // 檢查新密碼和確認密碼是否一致
      if (this.newPassword !== this.confirmPassword) {
        alert("新密碼和確認密碼不一致");
        return;
      }

      // 更新密碼
      user.password = this.newPassword;

      // 將更新後的用戶資料存回 localStorage
      localStorage.setItem("users", JSON.stringify(users));
      /*
      const user = JSON.parse(localStorage.getItem("users")).find(
        (user) => user.id === this.userId
      );
      // 檢查舊密碼是否正確
      if (this.oldPassword !== user.password) {
        alert("舊密碼錯誤");
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        alert("兩次輸入的新密碼不一致，請重新輸入！");
        return;
      }

      // 更新密碼
      user.password = this.newPassword;
      const users = JSON.parse(localStorage.getItem("users")) || [];
      localStorage.setItem("users", JSON.stringify(users));
      */
      alert("密碼已成功修改");

      // 清空密碼輸入框並關閉對話框
      this.oldPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
      this.showPasswordModal = false;
    },
    //取消修改密碼
    cancelChangePassword() {
      this.showPasswordModal = false; // 取消修改
    },
    logout() {
      // 清除登入資訊
      localStorage.removeItem("loggedInUser");
      sessionStorage.clear(); // 確保 sessionStorage 也被清除

      // 跳轉到登入頁面
      this.$router.push("/"); // 假設首頁的路由是 '/'
    },
    startExam(examId) {
      // 根據 examId 開始測驗的邏輯
      alert(`開始測驗：${examId}`);
      const exam = this.exams.find((exam) => exam.id === examId);
      exam.status = "completed";
    },
  },
};
</script>
-->

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useIdleLogout } from "../composables/useIdleLogout";
import { useExamStore } from "../stores/examStore";

useIdleLogout();

const router = useRouter();
const examStore = useExamStore();

const userName = ref("");
const userId = ref("");
// 模擬測驗資料
const mockExams = [
  {
    examId: 8,
    title: "testest",
    status: "ongoing",
    targetScore: 80,
    limitTime: 100,
    startDate: "2025-04-01",
    endDate: "2025-05-29",
    creatorId: "123",
    kind: "first",
  },
  {
    examId: 20,
    title: "testest(補考)",
    status: "done",
    targetScore: 80,
    limitTime: 20,
    startDate: "2025-04-14",
    endDate: "2025-06-20",
    creatorId: "123",
    kind: "makeup",
  },
  {
    examId: 21,
    title: "0411測驗(補考)",
    status: "canceled",
    targetScore: 80,
    limitTime: 20,
    startDate: "2025-04-14",
    endDate: "2025-06-20",
    creatorId: "123",
    kind: "makeup",
  },
  {
    examId: 23,
    title: "測試",
    status: "ongoing",
    targetScore: 50,
    limitTime: 30,
    startDate: "2025-04-15",
    endDate: "2025-06-27",
    kind: "first",
    creatorId: "1213213",
  },
  {
    examId: 41,
    title: "0423test",
    status: "ongoing",
    targetScore: 60,
    limitTime: 40,
    startDate: "2025-04-23",
    endDate: "2025-04-30",
    kind: "first",
    creatorId: "123456",
  },
];
const exams = ref([]); // 存儲測驗資料

const showPasswordModal = ref(false); // 控制修改密碼對話框顯示
const oldPassword = ref(""); // 舊密碼
const newPassword = ref(""); // 新密碼
const confirmPassword = ref(""); // 確認新密碼
const isPasswordValid = ref(false); // 確認密碼是否符合規定

// 考試種類英文名稱轉中文名稱
const getKindName = (kind) => {
  switch (kind) {
    case "first":
      return "一般考試";
    case "makeup":
      return "補考";
    default:
      return kind;
  }
};

// 檢查登入狀況
const checkLogin = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("尚未登入");
    router.push("/"); // 跳轉到 Home.vue（根路由）
  } else {
    userName.value = loggedInUser.username;
    userId.value = loggedInUser.empId;
  }
};

// 取得測驗資料
const fetchExams = async () => {
  // 模擬等待效果
  await new Promise((resolve) => setTimeout(resolve, 500));
  exams.value = mockExams;
};

// 取得測驗資料API
/*
const fetchExams = async () => {
  const token = localStorage.getItem("authToken"); // 取得存儲的 TOKEN
  try {
    const response = await axios.get("http://172.16.46.163/csexam/user/exam", {
      headers: {
        Authorization: `Bearer ${token}`, // 加入 TOKEN 到請求頭部
      },
    });
    if (response.data.code === "0000") {
      exams.value = response.data.data.examList; // 更新測驗資料
    } else {
      alert("無法取得測驗資料");
    }
  } catch (error) {
    console.error("無法取得測驗資料", error);
    alert("取得測驗資料發生錯誤");
  }
};*/

const modifyPassword = () => {
  showPasswordModal.value = true;
};

watch(newPassword, () => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;
  isPasswordValid.value = regex.test(newPassword.value);
});

// 儲存新密碼
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

  if (!isPasswordValid.value) {
    alert("密碼不符合要求");
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

// 儲存新密碼/修改密碼API
/*
const saveNewPassword = async () => {

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const empId = loggedInUser.empId;
  if (!loggedInUser || !empId) {
    alert("尚未登入！");
    router.push("/"); // 若找不到 empId，導回首頁
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert("兩次輸入的新密碼不一致，請重新輸入！");
    confirmPassword.value = "";
    return;
  }

  if (!isPasswordValid.value) {
    alert("密碼不符合要求");
    return;
  }

  try {
    const response = await axios.put(
      "http://172.16.46.163/csexam/api/change-password", // 修改密碼的 API
      {
        empId: empId, // 傳送 empId
        oldPassword: oldPassword.value, // 舊密碼
        newPassword: newPassword.value, // 新密碼
      }
    );

    if (response.data.code === "0000") {
      alert("密碼已成功更新，請重新登入");
      router.push("/");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data.code === "UE006") {
        alert("舊密碼錯誤，" + error.response.data.message.slice(-6));
        // alert(error.response.data.message.slice(-6));
      } else if (error.response.data.code) {
        alert(error.response.data.message);
        // 針對其他錯誤代碼顯示不同的錯誤訊息
        // UE002 使用者不存在
        // UE006 密碼錯誤，剩餘N次機會
        // 9999 密碼規則不符合(其他問題)
      } else {
        alert("錯誤訊息:", error.response.data.message);
      }
    } else {
      alert("發生錯誤，請稍後再試");
    }
    console.error("修改密碼失敗", error);
    alert(error.response?.data?.message || "修改密碼失敗，請稍後再試！");
  }

  // 清空輸入框內容
  oldPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  showPasswordModal.value = false;
};
*/

const cancelChangePassword = () => {
  showPasswordModal.value = false;
};

const logout = () => {
  localStorage.removeItem("loggedInUser");
  sessionStorage.clear();
  // localStorage.clear();
  // localStorage.removeItem('authToken');
  // delete axios.defaults.headers['Authorization'];  // 清除預設 header
  router.push("/");
};

const startExam = (examId) => {
  // alert(`開始測驗：${examId}`);
  // const exam = exams.value.find((exam) => exam.id === examId);
  // exam.status = "completed";

  const exam = exams.value.find((e) => e.examId === examId);
  if (!exam) return;
  examStore.setCurrentExam(exam);

  localStorage.setItem("examId", examId);
  router.push("/testing");
};

onMounted(() => {
  checkLogin();
  fetchExams();
});
</script>

<style scoped>
#app {
  margin: 0;
  padding: 0;
}
/* 頁面整體容器 */
.profile-page {
  background-color: #f4f4f9; /* 淺灰背景 */
  background-attachment: fixed;
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0 auto;
  padding-top: 30px;
  height: calc(100vh - 100px);
}

/* 頁面頭部 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px; /* 可調整為你需要的間距 */
  background-color: #2000a1; /* 背景色，讓header不會透明 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 加入陰影效果 */
  z-index: 1000; /* 確保 header 在其他內容上方 */
}

/* 用戶信息區域 */
.user-info {
  display: flex;
  flex-direction: row; /* 改為水平排列 */
  align-items: center; /* 垂直居中對齊 */
}

.name {
  font-size: 20px;
  margin: 0 20px;
  color: white;
}

.user-id {
  font-size: 20px;
  margin: 0 20px;
  color: white;
}

/* 頁面頭部的動作區域 */
.actions {
  display: flex;
  justify-content: flex-start; /* 按鈕靠左對齊 */
  gap: 30px; /* 兩個按鈕之間的間距 */
}

.button {
  margin-left: 0;
}

.logout-btn {
  margin-right: 50px;
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

.message {
  width: 340px;
  margin: 10px 0;
}

.error-message {
  color: red;
}

.correct-message {
  color: green;
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
  /*
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  */
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

/* 表格區域 */
.table-container {
  padding: 20px;
}

/* 調整表格 */
table {
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #ccc;
  background-color: #ffffff;
  table-layout: fixed;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

table tr {
  border-bottom: 1px solid #ddd; /* 只設定每一行底部的邊框 */
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

table th,
table td {
  word-wrap: break-word;
  height: 70px;
  border: none;
  padding: 10px;
}

/* 表格表頭 */
table th {
  background-color: #d8d8d8; /* 綠色背景 */
  color: black;
  text-align: center;
  font-size: 20px;
  height: 30px;
}

/* 表格單元格 */
table td {
  border: 1px solid #ddd;
  text-align: center;
  font-size: 16px;
}

table th:nth-child(1),
table td:nth-child(1) {
  width: 120px;
}

table th:nth-child(5),
table td:nth-child(5) {
  width: 300px;
}

/* 提高按鈕的可讀性 */
button {
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 6px;
}

/* 邊框樣式 */
button:focus {
  outline: none;
  border-color: #369d6d;
  box-shadow: 0 0 5px rgba(66, 184, 131, 0.5);
}

/* 增加按鈕的顏色 */
button:hover {
  background-color: #369d6d;
  color: #fff;
}

/* 開始測驗的按鈕樣式 */
button {
  background-color: #42b883; /* 綠色背景 */
  color: white;
  border: none;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 6px;
}

button:hover {
  background-color: #369d6d;
}

/* 已完成的文本 */
span {
  font-size: 14px;
  color: black;
  font-weight: bold;
}

.actions .logout-btn {
  background-color: #ff4d4d;
  color: white;
}

.start-exam-btn {
  background-color: #ab47bc;
  color: white;
}

.start-exam-btn:hover {
  background-color: #962da8;
}
</style>
