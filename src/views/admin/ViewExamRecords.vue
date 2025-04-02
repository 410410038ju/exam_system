<template>
  <div class="container">
    <AdminNavBar />
    <div class="content">
      <!-- 多重查詢表單 -->
      <div class="query-form">
      <div class="form-group">
        <label for="examName">考卷名稱</label>
        <input id="examName" v-model="query.examName" type="text" placeholder="輸入考卷名稱" />
      </div>
      
      <div class="form-group">
        <label for="startDate">開始日期</label>
        <input id="startDate" v-model="query.startDate" type="date" placeholder="選擇開始日期" />
      </div>

      <div class="form-group">
        <label for="endDate">結束日期</label>
        <input id="endDate" v-model="query.endDate" type="date" placeholder="選擇結束日期" />
      </div>

      <div class="form-group">
        <label for="status">狀態</label>
        <select id="status" v-model="query.status">
          <option value="">請選擇狀態</option>
          <option value="已完成">已完成</option>
          <option value="未完成">未完成</option>
        </select>
      </div>

      <button @click="search">查詢</button>
    </div>

      <!-- 顯示查詢結果的表格 -->
      <table>
        <thead>
          <tr>
            <th>考卷名稱</th>
            <th>開始日期</th>
            <th>結束日期</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(exam, index) in filteredExams" :key="index">
            <td>{{ exam.examName }}</td>
            <td>{{ exam.startDate }}</td>
            <td>{{ exam.endDate }}</td>
            <td>{{ exam.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import AdminNavBar from "../../components/AdminNavBar.vue";
import { ref } from "vue";

// 查詢條件的狀態
const query = ref({
  examName: "",
  startDate: "",
  endDate: "",
  status: "",
});

// 假設的考卷資料（請根據實際情況替換成API資料）
const exams = ref([
  {
    examName: "考卷1",
    startDate: "2025-04-01",
    endDate: "2025-04-10",
    status: "已完成",
  },
  {
    examName: "考卷2",
    startDate: "2025-04-05",
    endDate: "2025-04-12",
    status: "未完成",
  },
  {
    examName: "考卷3",
    startDate: "2025-04-03",
    endDate: "2025-04-15",
    status: "已完成",
  },
]);

// 篩選後的考卷資料
const filteredExams = ref(exams.value);

// 查詢過濾函式
const search = () => {
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

<style scoped>
.container {
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  width: 80%;
  margin: 0 auto; /* 水平置中 */
}

.query-form {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.query-form .form-group {
  flex: 1 1 200px; /* 每個欄位至少 200px 寬度，並可自動調整 */
}

.query-form label {
  display: block;
  margin-bottom: 5px;
}

.query-form input, .query-form select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  padding: 8px 16px;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
</style>
