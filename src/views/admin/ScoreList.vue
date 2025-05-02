<template>
  <div class="container">
    <AdminNavBar />
    <div class="content">
      <!-- 查詢測驗 -->
      <div class="search-container">
        <div class="query-form">
          <div class="form-group" id="examName-group">
            <label for="examName">測驗名稱</label>
            <input
              id="examName"
              v-model="query.examName"
              type="text"
              placeholder="輸入測驗名稱"
              @keyup.enter="searchScore"
            />
          </div>

          <div class="form-group" id="creatorId-group">
            <label for="creatorId">測驗出題者員編</label>
            <input
              id="creatorId"
              v-model="query.creatorId"
              type="text"
              placeholder="輸入測驗出題者員編"
              @keyup.enter="searchScore"
            />
          </div>

          <div class="form-group" id="empId-group">
            <label for="empId">客服員編</label>
            <input
              id="empId"
              v-model="query.empId"
              type="text"
              placeholder="輸入客服員編"
              @keyup.enter="searchScore"
            />
          </div>

          <div class="form-group" id="userName-group">
            <label for="userName">客服姓名</label>
            <input
              id="userName"
              v-model="query.userName"
              type="text"
              placeholder="輸入客服姓名"
              @keyup.enter="searchScore"
            />
          </div>

          <div class="form-group" id="time-group">
            <label for="time">時間</label>
            <input
              id="time"
              v-model="query.time"
              type="date"
            />
          </div>

          <button @click="searchScore" class="search-btn">搜尋</button>
        </div>
      </div>

      <div class="score-list">
        <div class="table-info">
          <label for="size">每頁行數：</label>
          <select v-model.number="query.size" id="size" @change="searchScore">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <p v-if="totalCount === 0">從 0 - 0 筆 / 共 0 筆</p>
          <p v-else>
            從 {{ (query.page - 1) * query.size + 1 }} -
            {{ (query.page - 1) * query.size + scores.length }} 筆 / 共
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
              @click="searchScore"
              :disabled="
                !query.page || query.page < 1 || query.page > totalPages
              "
              class="go-btn"
            >
              GO
            </button>
          </div>
        </div>

        <table class="score-table">
          <thead>
            <tr>
              <th>員工編號</th>
              <th>姓名</th>
              <th>測驗名稱</th>
              <th>測驗出題者員編</th>
              <th>原始成績</th>
              <th>補考成績</th>
              <th>答題紀錄</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in scores" :key="record.empId">
              <td>{{ record.empId }}</td>
              <td>{{ record.userName }}</td>
              <td>{{ record.examName }}</td>
              <td>{{ record.creatorId }}</td>
              <td>{{ record.originalScore }}</td>
              <td>{{ record.makeupScore || "無" }}</td>
              <td>
                <button
                  @click="viewAnswerRecord(record, false)"
                  class="exam-btn"
                >
                  原始測驗
                </button>
                <button
                  @click="viewAnswerRecord(record, true)"
                  class="exam-btn"
                  v-if="record.makeupScore !== null"
                >
                  補考測驗
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="table-info">
          <label for="size">每頁行數：</label>
          <select v-model.number="query.size" id="size" @change="searchScore">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <p v-if="totalCount === 0">從 0 - 0 筆 / 共 0 筆</p>
          <p v-else>
            從 {{ (query.page - 1) * query.size + 1 }} -
            {{ (query.page - 1) * query.size + scores.length }} 筆 / 共
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
              @click="searchScore"
              :disabled="
                !query.page || query.page < 1 || query.page > totalPages
              "
              class="go-btn"
            >
              GO
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar.vue";
import ErrorModal from "../../components/APIerror.vue";
import { useIdleLogout } from "../../composables/useIdleLogout";

useIdleLogout();
const router = useRouter();

// const searchKeyword = ref("");

// 查詢條件的狀態
const query = ref({
  examName: "",
  creatorId: "",
  empId: "",
  userName: "",
  time: "",
  startDate: "",
  endDate: "",
  page: 1,
  size: 5,
});

// 模擬資料
const scores = ref([
  {
    id: 1,
    empId: "A001",
    userName: "小明",
    examName: "期中考",
    creatorId: "023",
    originalScore: 85,
    makeupScore: 90,
    submitTime: "2025-04-20 14:30",
  },
  {
    id: 2,
    empId: "A002",
    userName: "小美",
    examName: "期中考",
    creatorId: "023",
    originalScore: 92,
    makeupScore: null, // 沒有補考成績
    submitTime: "2025-04-20 15:00",
  },
  {
    id: 3,
    empId: "A003",
    userName: "小強",
    examName: "期中考",
    creatorId: "023",
    originalScore: 76,
    makeupScore: 80, // 補考成績
    submitTime: "2025-04-18 10:20",
  },
  {
    id: 4,
    empId: "A004",
    userName: "小華",
    examName: "期末考",
    creatorId: "089",
    originalScore: 65,
    makeupScore: 70, // 補考成績
    submitTime: "2025-04-22 09:00",
  },
  {
    id: 5,
    empId: "A005",
    userName: "小麗",
    examName: "期末考",
    creatorId: "023",
    originalScore: 88,
    makeupScore: null, // 沒有補考成績
    submitTime: "2025-04-21 13:45",
  },
]);

// 全部資料（原始不分頁版本，用來查詢與分頁）
const allScores = ref([...scores.value]);

// 總筆數
const totalCount = ref(scores.value.length);

// 分頁：目前頁數與總頁數
const currentPage = computed(() => query.value.page);
const totalPages = computed(() =>
  Math.ceil(totalCount.value / query.value.size)
);

/*
const filteredScores = computed(() =>
  scores.value.filter((record) =>
    `${record.employeeId}${record.studentName}${record.examTitle}`.includes(
      searchKeyword.value.trim()
    )
  )
);
*/

// 分頁資料重新整理邏輯
const searchScore = () => {
  const filtered = allScores.value.filter((record) => {
    return (
      (query.value.examName === "" ||
        record.examName.includes(query.value.examName)) &&
      (query.value.creatorId === "" ||
        record.creatorId.includes(query.value.creatorId)) &&
      (query.value.empId === "" || record.empId.includes(query.value.empId)) &&
      (query.value.userName === "" ||
        record.userName.includes(query.value.userName)) &&
      (query.value.time === "" ||
        record.submitTime.startsWith(query.value.time))
    );
  });

  totalCount.value = filtered.length;

  const start = (query.value.page - 1) * query.value.size;
  const end = start + query.value.size;
  scores.value = filtered.slice(start, end);
};

// 當頁數或查詢條件變更時，自動查詢
watch(
  () => [
    query.value.examName,
    query.value.creatorId,
    query.value.empId,
    query.value.userName,
    query.value.time,
  ],
  () => {
    query.page = 1; // 回到第 1 頁
    searchScore();
  }
);

// 上一頁
const prevPage = () => {
  if (query.value.page > 1) {
    query.value.page--;
    searchScore();
    window.scrollTo({ top: 0, behavior: "smooth" }); // ✨滾到上方
  }
};

// 下一頁
const nextPage = () => {
  if (query.value.page < totalPages.value) {
    query.value.page++;
    searchScore();
    window.scrollTo({ top: 0, behavior: "smooth" }); // ✨滾到上方
  }
};

// 查看答題紀錄
const viewAnswerRecord = (record, isMakeup) => {
  console.log("查看", isMakeup ? "補考" : "原始", "答題紀錄", record);
  router.push("/answer_record");
};

// 當畫面初次掛載時執行
onMounted(() => {
  searchScore();
});
</script>

<style scoped>
.container {
  min-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 100px;
}

.content {
  padding: 0;
}

.search-container {
  background-color: #f9f9f9;
  padding: 20px;

  border-radius: 0;
}

.query-form {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  gap: 1rem;
  margin: auto;
  align-items: flex-end;
  justify-content: space-around;
}

.form-group {
  /*flex: 1 1 200px;  */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  /* flex-basis: 200px; */
}

/* 標籤文字 */
.form-group label {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  text-align: center;
  line-height: 1;
}

/* 輸入欄位與下拉選單 */
.form-group input{
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  height: 20px;         /* 統一高度 */
  line-height: normal;  /* 避免 date 類型拉高 */
}

.form-group input:focus{
  border-color: #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
  outline: none;
}

.search-btn {
  background-color: #20bec8;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  height: 37.6px;
  cursor: pointer;
  font-size: 16px;
  border: 1px solid #20bec8;
  flex-grow: 0;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.search-btn:hover {
  background-color: #169da6;
}

.score-list {
  padding: 20px;
  padding-top: 0;
}

.title {
  font-size: 24px;
  margin-bottom: 16px;
}

.filter-bar {
  margin-bottom: 12px;
}

.filter-bar input {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.score-table {
  width: 100%;
  border-collapse: collapse;
}
.score-table th,
.score-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.score-table th {
  background-color: #dbcafe;
}


.score-table tr:nth-child(odd) {
  background-color: #fefde6;
}

.score-table tr:nth-child(even) {
  background-color: #fcfcfc;
}

.score-table tr:hover {
  background-color: #e0f7fa;
}

.exam-btn {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px; /* 讓按鈕之間有空隙 */
}

.exam-btn:nth-child(1) {
  background-color: #4caf50; /* 綠色背景表示原始測驗 */
  color: white;
}

.exam-btn:nth-child(1):hover {
  background-color: #45a049; /* 原始測驗按鈕 hover 時的顏色 */
}

.exam-btn:nth-child(2) {
  background-color: #ff9800; /* 橙色背景表示補考測驗 */
  color: white;
}

.exam-btn:nth-child(2):hover {
  background-color: #f57c00; /* 補考測驗按鈕 hover 時的顏色 */
}

.table-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 0;
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
