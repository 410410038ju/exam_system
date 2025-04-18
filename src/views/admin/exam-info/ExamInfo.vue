<template>
  <div class="container">
    <ErrorModal
    v-model="showError"
    :message="errorMsg"
    @confirm="handleRedirect"
  />
    <AdminNavBar />
    <div class="content">
      <button class="back-btn" @click="backTo">
        <i class="arrow-icon">＜</i> 返回
      </button>

      <div class="exam-info-card">
        <h2>{{ exam.examName }}</h2>
        <p>及格分數：60 分</p>
        <p>答題時間：30 分鐘</p>
        <p>總題數：20 題</p>
        <p>
          測驗進行日期：{{ exam.startDate?.replaceAll("-", "/") }} ~
          {{ exam.endDate?.replaceAll("-", "/") }}
          <button class="edit-time-btn" @click="showModal = true">
            修改測驗日期
          </button>
        </p>
      </div>

      <table class="exam-range-table">
        <thead>
          <tr>
            <th>業務種類</th>
            <th>章</th>
            <th>節</th>
            <th>題數</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>第 1 章</td>
            <td>第 1 節</td>
            <td>HTML 基礎</td>
            <td>5</td>
          </tr>
          <tr>
            <td>第 1 章</td>
            <td>第 2 節</td>
            <td>HTML 表單</td>
            <td>5</td>
          </tr>
          <!-- 這邊可依資料動態渲染 -->
        </tbody>
      </table>

      <div class="action-buttons">
        <button class="btn" @click="openMakeupExam">開啟補考測驗</button>
        <button class="btn" @click="viewMakeupRecords">查看補考紀錄</button>
        <button class="btn" @click="exportGrades">匯出成績</button>
      </div>

      <!-- 新增的表格 -->
      <table class="exam-records-table">
        <thead>
          <tr>
            <th>索引</th>
            <th>員工編號</th>
            <th>姓名</th>
            <th>交卷時間</th>
            <th>成績</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>2025001</td>
            <td>張三</td>
            <td>2025.04.14 11:20</td>
            <td>85</td>
            <td>
              <button class="view-record-btn" @click="viewAnswerRecord">
                答題記錄
              </button>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>2025002</td>
            <td>李四</td>
            <td>2025.04.14 11:25</td>
            <td>78</td>
            <td>
              <button class="view-record-btn" @click="viewAnswerRecord">
                答題記錄
              </button>
            </td>
          </tr>
          <!-- 可依據資料動態渲染 -->
        </tbody>
      </table>

      <!-- 彈出視窗 modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <button @click="showModal = false" class="close-btn">×</button>
          <h3>修改作答時間</h3>
          <label>開始時間：</label>
          <input type="date" v-model="newStartTime" />
          <label>結束時間：</label>
          <input type="date" v-model="newEndTime" />
          <div class="modal-actions">
            <button @click="confirmEdit" class="confirm-btn">確認</button>
            <button @click="showModal = false" class="cancel-btn">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminNavBar from "../../../components/AdminNavBar.vue";
import ErrorModal from "../../../components/APIerror.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

// 控制錯誤視窗顯示與否
const showError = ref(false);

// 儲存錯誤訊息
const errorMsg = ref({
  status: 0,
  code: 0,
  message: "",
});

const showModal = ref(false);
const newStartTime = ref("");
const newEndTime = ref("");

const exam = ref({});

const backTo = () => {
  router.push("/view_exam_records");
  localStorage.removeItem("selectedExam");
};

// 修改考試期間
/*
const confirmEdit = () => {
  console.log("新的開始時間為：", newStartTime.value);
  console.log("新的結束時間為：", newEndTime.value);
  // 更新 exam.startDate 和 exam.endDate
  exam.value.startDate = newStartTime.value;
  exam.value.endDate = newEndTime.value;

  // 可以在此加上 axios 發送 API 更新時間
  showModal.value = false;
};
*/

// 修改考試期間API
const confirmEdit = async () => {
  try {
    // 發送 PATCH 請求更新作答時間
    const token = localStorage.getItem("authToken");
    const examId = exam.value.examId;

    const response = await axios.patch(
      `http://172.16.46.163/csexam/admin/exam/${examId}`,
      {
        startDate: newStartTime.value,
        endDate: newEndTime.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // 設定 Authorization 標頭
        },
      }
    );

    if (response.data.code === "0000") {
      console.log("修改成功", response.data);
      // 更新當前測驗資料
      exam.value.startDate = newStartTime.value;
      exam.value.endDate = newEndTime.value;
      showModal.value = false;
    } else {
      alert("修改失敗，資料庫出現問題");
    }
  } catch (error) {
    console.error("修改作答時間失敗:", error);
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

const openMakeupExam = () => {
  console.log("開啟補考測驗");
  // 這裡可以執行開啟補考測驗的邏輯
};

const viewMakeupRecords = () => {
  console.log("查看補考紀錄");
  // 這裡可以執行查看補考紀錄的邏輯
};

const exportGrades = () => {
  console.log("匯出成績");
  // 這裡可以執行匯出成績的邏輯
};

const viewAnswerRecord = (index) => {
  console.log("查看答題記錄，索引：", index);
  router.push("/answer_record");
};

// 當錯誤視窗按下確認後跳轉到首頁
const handleRedirect = () => {
  showError.value = false; // 關閉錯誤視窗
  router.push("/"); // 跳轉到首頁
};

onMounted(() => {
  const stored = localStorage.getItem("selectedExam");
  if (stored) {
    exam.value = JSON.parse(stored);
    // 當頁面加載完成後，初始化新的開始和結束時間
    newStartTime.value = exam.value.startDate;
    newEndTime.value = exam.value.endDate;
  }
});
</script>

<style scoped>
.content {
  margin: 110px auto 20px;
  padding: 20px;
  max-width: 1100px;
  background-color: #e6ffcf;
}

.back-btn {
  margin: 0;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 14px;
  background-color: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background-color: #ccc;
}

.arrow-icon {
  margin-right: 0;
  font-style: normal;
  font-size: 16px;
}

.exam-info-card {
  background-color: #f9f9f9;
  padding: 20px 0;
  margin: 0 auto;
  margin-top: 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  /* max-width: 800px; */
}

.exam-info-card h2 {
  font-size: 20px;
  margin: 0;
  color: #333;
  text-align: left;
}

.exam-info-card p {
  text-align: left;
  margin: 5px 0;
  font-size: 16px;
  color: #555;
}

.edit-time-btn {
  margin-left: 12px;
  padding: 6px 12px;
  font-size: 14px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.edit-time-btn:hover {
  background-color: #45a049;
}

.exam-range-table {
  width: 80%;
  max-width: 800px;
  margin: 20px auto;
  border-collapse: collapse;
  font-size: 16px;
}

.exam-range-table th,
.exam-range-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ccc; /* 輕微的淡邊框 */
}

.exam-range-table th {
  background-color: #f0f0f0;
  font-weight: bold;
  color: #333;
}

.exam-range-table tr:nth-child(even) {
  background-color: #fcfcfc;
}

/* 按鈕容器 */
.action-buttons {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  width: 80%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* 按鈕樣式 */
.btn {
  padding: 8px 16px;
  margin: 0 10px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #45a049; /* 按鈕懸停時變色 */
}

.btn:nth-child(1) {
  background-color: #4caf50;
  color: white;
}

.btn:nth-child(2) {
  background-color: #2196f3;
  color: white;
}

.btn:nth-child(3) {
  background-color: #ff9800;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

.modal {
  position: relative;
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  margin-bottom: 16px;
  font-size: 18px;
  text-align: center;
}

.modal input {
  width: 90%;
  padding: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.confirm-btn,
.cancel-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-btn {
  background-color: #4caf50;
  color: white;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.close-btn {
  padding: auto;
  margin: auto;
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: black;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #333;
}

/* 答題紀錄表格樣式 */
.exam-records-table {
  width: 80%;
  max-width: 800px;
  margin: 20px auto;
  border-collapse: collapse;
  font-size: 16px;
}

.exam-records-table th,
.exam-records-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

.exam-records-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.exam-records-table tr:nth-child(even) {
  background-color: #fcfcfc;
}

/* 答題記錄按鈕樣式 */
.view-record-btn {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.view-record-btn:hover {
  background-color: #1976d2;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
