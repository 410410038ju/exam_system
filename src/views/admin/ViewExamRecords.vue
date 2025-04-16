<template>
  <div class="container">
    <AdminNavBar />
    <div class="content">
      <!-- 查詢考卷 -->
      <div class="search-container">
        <div class="query-form">
          <div class="form-group" id="examName-group">
            <label for="examName">考卷名稱</label>
            <input
              id="examName"
              v-model="query.examName"
              type="text"
              placeholder="輸入考卷名稱"
            />
          </div>

          <div class="form-group" id="startDate-group">
            <label for="startDate">測驗開始日期的起始日</label>
            <input
              id="startDate"
              v-model="query.startDate"
              type="date"
              placeholder="選擇開始日期"
            />
          </div>

          <div class="form-group" id="endDate-group">
            <label for="endDate">測驗開始日期的結束日</label>
            <input
              id="endDate"
              v-model="query.endDate"
              type="date"
              placeholder="選擇結束日期"
            />
          </div>

          <div class="form-group" id="status-group">
            <label for="status">狀態</label>
            <select id="status" v-model="query.status">
              <option value="">請選擇狀態</option>
              <option value="ongoing">進行中</option>
              <option value="done">已結束</option>
              <option value="canceled">已取消</option>
            </select>
          </div>

          <button @click="searchExam" class="search-btn">搜尋</button>
        </div>
      </div>

      <div class="table-info">
        <label for="size">每頁行數：</label>
        <select v-model.number="query.size" id="size" @change="searchExam">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <p v-if="totalCount === 0">從 0 - 0 筆 / 共 0 筆</p>
        <p v-else>
          從 {{ (query.page - 1) * query.size + 1 }} -
          {{ (query.page - 1) * query.size + filteredExams.length }} 筆 / 共
          {{ totalCount }} 筆
        </p>
        <div class="page-group">
          <button
            @click="prevPage"
            class="page-btn"
            :disabled="query.page <= 1"
          >
            上一頁
          </button>
          <p v-if="totalCount === 0">第 0 / 0 頁</p>
          <p v-else>第 {{ currentPage }} / {{ totalPages }} 頁</p>
          <button
            @click="nextPage"
            class="page-btn"
            :disabled="query.page >= totalPages"
          >
            下一頁
          </button>
        </div>
        <div
          class="gotopage"
          style="display: flex; align-items: center; gap: 8px"
        >
          <span>頁碼：</span>
          <input
            v-model.number="query.page"
            id="page"
            type="number"
            min="1"
            :max="totalPages"
            placeholder="頁碼"
            style="width: 40px"
            class="page-input"
          />
          <button
            @click="searchExam"
            :disabled="!query.page || query.page < 1 || query.page > totalPages"
            class="go-btn"
          >
            GO
          </button>
        </div>
      </div>

      <!-- 顯示查詢結果的表格 -->
      <div v-if="filteredExams.length > 0">
        <table>
          <thead>
            <tr>
              <th>編號</th>
              <th>考卷編號</th>
              <th>考卷名稱</th>
              <th>測驗開始日期</th>
              <th>測驗結束日期</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(exam, index) in filteredExams" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ exam.examId }}</td>
              <td>{{ exam.examName }}</td>
              <td>{{ exam.startDate }}</td>
              <td>{{ exam.endDate }}</td>
              <td>{{ getStatusName(exam.status) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="filteredExams.length === 0">沒有符合資料</div>

      <div v-if="filteredExams.length > 0" class="table-info">
        <label for="size">每頁行數：</label>
        <select v-model.number="query.size" id="size" @change="searchExam">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <p v-if="totalCount === 0">從 0 - 0 筆 / 共 0 筆</p>
        <p v-else>
          從 {{ (query.page - 1) * query.size + 1 }} -
          {{ (query.page - 1) * query.size + filteredExams.length }} 筆 / 共
          {{ totalCount }} 筆
        </p>
        <div class="page-group">
          <button
            @click="prevPage"
            class="page-btn"
            :disabled="query.page <= 1"
          >
            上一頁
          </button>
          <p v-if="totalCount === 0">第 0 / 0 頁</p>
          <p v-else>第 {{ currentPage }} / {{ totalPages }} 頁</p>
          <button
            @click="nextPage"
            class="page-btn"
            :disabled="query.page >= totalPages"
          >
            下一頁
          </button>
        </div>
        <div
          class="gotopage"
          style="display: flex; align-items: center; gap: 8px"
        >
          <span>頁碼：</span>
          <input
            v-model.number="query.page"
            id="page"
            type="number"
            min="1"
            :max="totalPages"
            placeholder="頁碼"
            style="width: 40px"
            class="page-input"
          />
          <button
            @click="searchExam"
            :disabled="!query.page || query.page < 1 || query.page > totalPages"
            class="go-btn"
          >
            GO
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- 沒有API -->
<script setup>
import AdminNavBar from "../../components/AdminNavBar.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// 查詢條件的狀態
const query = ref({
  examName: "",
  startDate: "",
  endDate: "",
  status: "",
  page: 1,
  size: 5,
});

// 假設的考卷資料（請根據實際情況替換成API資料）
// const exams = ref([]);
const exams = ref([
  {
    examId: 3,
    examName: "考卷1",
    startDate: "2025-04-01",
    endDate: "2025-04-10",
    status: "ongoing",
  },
  {
    examId: 5,
    examName: "考卷2",
    startDate: "2025-04-05",
    endDate: "2025-04-12",
    status: "done",
  },
  {
    examId: 8,
    examName: "考卷3",
    startDate: "2025-04-03",
    endDate: "2025-04-15",
    status: "canceled",
  },
]);

// 篩選後的考卷資料
const filteredExams = ref(exams.value);

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

// 查詢過濾函式
const searchExam = () => {
  filteredExams.value = exams.value.filter((exam) => {
    const matchesExamName =
      !query.value.examName || exam.examName.includes(query.value.examName);
    const matchesStartDate =
      !query.value.startDate || exam.startDate >= query.value.startDate;
    const matchesEndDate =
      !query.value.endDate || exam.endDate <= query.value.endDate;
    const matchesStatus =
      !query.value.status || exam.status === query.value.status;
    return (
      matchesExamName && matchesStartDate && matchesEndDate && matchesStatus
    );
  });
};
</script>
-->
<!-- API 
<script setup>
import AdminNavBar from "../../components/AdminNavBar.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// 查詢條件的狀態
const query = ref({
  examName: "",
  startDate: "",
  endDate: "",
  status: "",
  page: 1,
  size: 5,
});

const filteredExams = ref([]); // 顯示用的資料
const totalCount = ref(0); // 總筆數
const totalPages = ref(1); // 總頁數
const currentPage = ref(1); // 現在頁數

// 篩選後的考卷資料
// const filteredExams = ref(exams.value);

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

// 查詢考卷API
const searchExam = async () => {
  const token = localStorage.getItem("authToken");

  // 檢查結束時間是否小於開始時間
  if (new Date(query.value.endDate) < new Date(query.value.startDate)) {
    alert("結束日期不能小於開始日期");
    return;
  }

  try {
    const response = await axios.get(
      "http://172.16.46.163/csexam/admin/exam/search",
      {
        headers: {
          Authorization: `Bearer ${token}`, // 在 headers 中帶上 token
        },
        params: {
          examName: query.value.examName || undefined,
          startDate: query.value.startDate || undefined,
          endDate: query.value.endDate || undefined,
          status: query.value.status || undefined,
          page: query.value.page - 1, // 後端是從 0 開始，所以要 -1
          size: query.value.size,
        },
      }
    );

    if (response.data.code === "0000") {
      const result = response.data.data;
      filteredExams.value = result.content;
      totalCount.value = result.totalElements;
      totalPages.value = result.totalPages;
      currentPage.value = result.number + 1; // 後端是從 0 開始，要 +1
    } else {
      alert("搜尋失敗，資料庫出現問題");
      console.error("搜尋錯誤: 資料格式異常");
    }
  } catch (error) {
    console.error("搜尋考卷失敗：", error);
  }
};

const prevPage = () => {
  if (query.value.page > 1) {
    query.value.page--;
    searchExam();
  }
};

const nextPage = () => {
  if (query.value.page < totalPages.value) {
    query.value.page++;
    searchExam();
  }
};
</script>
-->
<style scoped>
.container {
  /* position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0 auto; */

  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 60px;
}

.content {
  padding: 0;
}

.search-container {
  background-color: #f9f9f9;
  padding: 20px 30px;
  border-radius: 0;
}

.query-form {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  gap: 2rem;
  margin: auto;
  align-items: flex-end;
  justify-content: space-between;
}

.form-group {
  /*flex: 1 1 200px;  */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.form-group#examName-group {
  flex-grow: 1;
}

.form-group#startDate-group {
  flex-grow: 1;
}

.form-group#endDate-group {
  flex-grow: 1;
}

.form-group#status-group {
  flex-grow: 1;
}

/* 標籤文字 */
.form-group label {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
  margin-left: 10px;
}

/* 輸入欄位與下拉選單 */
.form-group input,
.form-group select {
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  height: 25px;
}

.form-group select {
  height: 42.6px;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
  outline: none;
}

.query-form label {
  display: block;
  margin-bottom: 5px;
}

.query-form input,
.query-form select {
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  padding: 8px 16px;
  margin-top: 20px;
}

.search-btn {
  background-color: #20bec8;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 30px;
  height: 40px;
  cursor: pointer;
  font-size: 16px;
  border: 1px solid #20bec8;
  flex-grow: 0;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.search-btn:hover {
  background-color: #169da6;
}

table {
  width: 100%;
  /* border-collapse: collapse; */
  border-collapse: separate;
  border-spacing: 0;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 0;
  overflow: hidden;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

/* 表頭 */
thead {
  background-color: #ca00c7;
  color: white;
  text-align: left;
}

thead th {
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
}

/* 表格內容 */
tbody td {
  padding: 8px 12px;
  border-top: 1px solid #eee;
  color: #333;
}

/* 斑馬條紋 */
tbody tr:nth-child(odd) {
  background-color: #feeff6;
}

tbody tr:nth-child(even) {
  background-color: #fff3e0;
}

/* Hover 效果 */
tbody tr:hover {
  background-color: #e0f7fa;
}

.table-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  font-size: 14px;
}

.table-info label {
  margin: auto 0;
  font-weight: normal;
  color: #555;
  font-size: 16px;
}

.table-info select {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
}

.table-info p {
  margin: auto 0;
  color: #555;
  font-size: 16px;
}

.table-info input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.page-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-group p {
  margin: auto;
  color: #20bec8;
  font-size: 16px;
  margin-top: 7px;
}

.page-btn {
  font-size: 16px;
  padding: 6px 12px;
  margin: auto;
  border: none;
  background-color: rgba(0, 0, 0, 0);
  color: #20bec8;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.page-btn:hover {
  background-color: #20bec8;
  color: white;
}

.page-btn:disabled {
  cursor: not-allowed;
}

.gotopage span {
  font-size: 16px;
}

.go-btn {
  background-color: #20bec8;
  color: white;
  padding: 8px 12px;
  margin: 0;
  border-radius: 4px;
  border: none;
}

.go-btn:disabled {
  background-color: #67e6ef; /* 禁用狀態下的背景顏色 */
  color: white; /* 禁用狀態下的文字顏色 */
  cursor: not-allowed; /* 禁用狀態下的鼠標樣式 */
}
</style>
