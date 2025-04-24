<template>
  <div class="container">
    <ErrorModal
      v-model="showError"
      :message="errorMsg"
      @confirm="handleRedirect"
    />
    <AdminNavBar />
    <div class="content">
      <button class="back-btn" @click="goBack">
        <i class="arrow-icon">＜</i> 返回
      </button>

      <div class="exam-info-card">
        <h2>{{ exam.examName }}</h2>
        <div :class="['status-wrapper', exam.status]">
          <p class="status-tag">
            <span class="status-icon">
              <i
                v-if="exam.status === 'ongoing'"
                class="fas fa-hourglass-half"
                :class="'icon-ongoing'"
              ></i>
              <i
                v-else-if="exam.status === 'done'"
                class="fas fa-check-circle"
                :class="'icon-done'"
              ></i>
              <i
                v-else-if="exam.status === 'canceled'"
                class="fas fa-times-circle"
                :class="'icon-canceled'"
              ></i>
            </span>
            測驗{{ getStatusName(exam.status) }}
          </p>
        </div>

        <div class="exam-info-content">
          <p>及格分數：{{ exam.targetScore }}</p>
          <p>答題時間：{{ exam.limitTime }}</p>
          <!-- <p>總題數：20 題</p> -->
          <p>測驗出題者：{{ exam.creatorId }}</p>
          <p>
            測驗進行日期：{{ exam.startDate?.replaceAll("-", "/") }} ~
            {{ exam.endDate?.replaceAll("-", "/") }}
            <button class="edit-time-btn" @click="showModal = true">
              修改測驗日期
            </button>
          </p>
        </div>
      </div>

      <!-- <table class="exam-range-table">
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
         
        </tbody>
      </table> -->

      <div class="action-buttons">
        <button class="btn" @click="openMakeupExam">開啟補考測驗</button>
        <button class="btn" @click="viewMakeupRecords">查看補考紀錄</button>
        <button class="btn" @click="exportGrades">匯出成績</button>
      </div>

      <!-- 成績表格 
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
     
        </tbody>
      </table>-->

      <!-- 修改作答時間 modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <button @click="showModal = false" class="close-btn">×</button>
          <h3>修改作答時間</h3>
          <label class="modal-label">
            <span class="label-text">開始時間：</span>
            <input type="date" v-model="newStartTime" class="modal-input" />
          </label>
          <label class="modal-label">
            <span class="label-text">結束時間：</span>
            <input type="date" v-model="newEndTime" class="modal-input" />
          </label>
          <div class="modal-actions">
            <button @click="confirmEdit" class="confirm-btn">確認</button>
            <button @click="showModal = false" class="cancel-btn">取消</button>
          </div>
        </div>
      </div>

      <!-- 補考設定 Modal -->
      <div v-if="showMakeupModal" class="makeup-modal-overlay">
        <div class="makeup-modal">
          <button @click="showMakeupModal = false" class="close-btn">×</button>
          <h3>設定補考測驗</h3>
          <div class="form-group">
            <label>測驗名稱：</label>
            <p class="exam-name">{{ exam.examName }}</p>
          </div>
          <div class="form-group">
            <label>開始日期：</label>
            <input type="date" v-model="makeupStartDate" class="date-input" />
          </div>
          <div class="form-group">
            <label>結束日期：</label>
            <input type="date" v-model="makeupEndDate" class="date-input" />
          </div>
          <div class="form-group">
            <label>及格分數：</label>
            <input
              type="number"
              v-model="makeupTargetScore"
              min="1"
              @keyup.enter="submitMakeupExam"
            />
          </div>
          <div class="form-group">
            <label>答題時間(分鐘)：</label>
            <input
              type="number"
              v-model="makeupLimitTime"
              min="1"
              @keyup.enter="submitMakeupExam"
            />
          </div>
          <div class="modal-actions">
            <button @click="submitMakeupExam" class="confirm-btn">確認</button>
            <button @click="showMakeupModal = false" class="cancel-btn">
              取消
            </button>
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
import { useIdleLogout } from "../../../composables/useIdleLogout";

useIdleLogout();

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

const showMakeupModal = ref(false);
const makeupLimitTime = ref("");
const makeupStartDate = ref("");
const makeupEndDate = ref("");
const makeupTargetScore = ref("");

const exam = ref({});

// 狀態英文名稱轉中文名稱
const getStatusName = (status) => {
  switch (status) {
    case "ongoing":
      return "進行中";
    case "done":
      return "已結束";
    case "canceled":
      return "已取消";
    default:
      return status;
  }
};

const goBack = () => {
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

    // 檢查 endDate 是否大於等於 startDate
    if (newEndTime.value <= newStartTime.value) {
      alert("結束時間不能早於開始時間！");
      return; // 終止後續操作
    }

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
    }
    // 顯示錯誤視窗
    showError.value = true;
  }
};

const openMakeupExam = () => {
  showMakeupModal.value = true;
  // console.log("開啟補考測驗");
  // alert("功能尚未實作");
};

const submitMakeupExam = () => {
  if (
    !makeupLimitTime.value ||
    !makeupStartDate.value ||
    !makeupEndDate.value ||
    !makeupTargetScore.value
  ) {
    alert("請填寫所有欄位！");
    return;
  }
  // 這邊可接 API 發送邏輯
  console.log({
    limitTime: makeupLimitTime.value,
    startDate: makeupStartDate.value,
    endDate: makeupEndDate.value,
    targetScore: makeupTargetScore.value,
  });
  
  // 清空資料
  makeupLimitTime.value = "";
  makeupStartDate.value = "";
  makeupEndDate.value = "";
  makeupTargetScore.value = "";
  showMakeupModal.value = false;
  alert("已開啟補考測驗");
  // EE003 補考考試已存在
};

const viewMakeupRecords = () => {
  console.log("查看補考紀錄");
  alert("功能尚未實作");
  // 這裡可以執行查看補考紀錄的邏輯
};

const exportGrades = () => {
  console.log("匯出成績");
  alert("功能尚未實作");
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
html,
body {
  background-color: #eee;
  margin: 0;
  padding: 0;
  height: 100%;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #eee;
}

.content {
  margin: 110px auto 20px;
  padding: 20px;
  max-width: 1100px;
  background-color: #fff;
  border: 2px solid #dfdfdf;
}

.back-btn {
  margin: 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 14px;
  color: #0c029a;
  background-color: #e7e7e7;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  color: #060053;
  background-color: #d3d3d3;
}

.arrow-icon {
  margin-right: 0;
  font-style: normal;
  font-size: 16px;
}

.exam-info-card {
  background-color: #fff;
  padding: 20px 0;
  margin: 0 auto;
  margin-top: 0;
  border-radius: 0;
  width: 100%;
  /* max-width: 800px; */
}

.exam-info-card h2 {
  font-size: 24px;
  margin: 0;
  margin-bottom: 10px;
  color: #333;
  text-align: left;
}

.exam-info-card p {
  text-align: left;
  margin: 5px 0;
  font-size: 16px;
  color: #555;
}

.status-wrapper {
  box-sizing: border-box;
  width: 100%;
}

.status-wrapper.ongoing {
  background-color: #fff3cd;
  color: #856404;
  border: 2px solid #856404;
}

.status-wrapper.done {
  background-color: #d4edda;
  color: #155724;
  border: 2px solid #155724;
}

.status-wrapper.canceled {
  background-color: #f8d7da;
  color: #721c24;
  border: 2px solid #721c24;
}

.status-tag {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1rem;
  margin: 0;
  padding: 0.25rem 1rem;
}

.status-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.icon-ongoing {
  color: #856404; /* 黃色 */
}

.icon-done {
  color: #155724; /* 綠色 */
}

.icon-canceled {
  color: #721c24; /* 紅色 */
}

.exam-info-content {
  box-sizing: border-box;
  margin-top: 20px;
  padding: 10px 20px;
  width: 100%;
  background-color: #eee;
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
  background-color: #38833c;
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
  width: 80%;
  max-width: 800px;
  margin-top: 10px;
  margin-left: 0;
}

/* 按鈕樣式 */
.btn {
  padding: 8px 16px;
  margin: 0 10px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #38833c; /* 按鈕懸停時變色 */
}

/*
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
*/

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
  margin: 0;
  margin-bottom: 15px;
  font-size: 24px;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.modal-label {
  display: flex;
  flex-direction: column;
}

.label-text {
  text-align: left; /* 將文字對齊到左邊 */
  margin-bottom: 5px;
  font-size: 16px;
}

.modal-input {
  padding: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}
/*
.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}*/

.makeup-modal-overlay {
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

.makeup-modal {
  position: relative;
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.makeup-modal h3 {
  margin: 0;
  margin-bottom: 15px;
  font-size: 24px;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.form-group label {
  width: 130px;
  text-align: center;
}

.form-group input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.exam-name {
  font-size: 16px;
  padding: 0;
  margin: 0;
  color: #333;
}

.confirm-btn,
.cancel-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-btn {
  background-color: #4caf50;
  color: white;
}

.confirm-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #d7372d;
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
