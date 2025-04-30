<template>
  <div class="container">
    <AdminNavBar />
    <div class="score-list">
      <h2 class="title">成績列表</h2>

      <div class="filter-bar">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜尋員工編號或姓名"
        />
      </div>

      <table class="score-table">
        <thead>
          <tr>
            <th>員工編號</th>
            <th>姓名</th>
            <th>考試名稱</th>
            <th>及格與否</th>
            <th>得分</th>
            <th>交卷時間</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredScores" :key="record.id">
            <td>{{ record.employeeId }}</td>
            <td>{{ record.studentName }}</td>
            <td>{{ record.examTitle }}</td>
            <td>{{ record.pass ? "及格" : "不及格" }}</td>
            <td>{{ record.score }}</td>
            <td>{{ record.submitTime }}</td>
          </tr>
        </tbody>
      </table>
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

const searchKeyword = ref("");

const scores = ref([
  {
    id: 1,
    employeeId: "A001",
    studentName: "小明",
    examTitle: "期中考",
    score: 85,
    pass: true,
    submitTime: "2025-04-20 14:30",
  },
  {
    id: 2,
    employeeId: "A002",
    studentName: "小美",
    examTitle: "期中考",
    score: 92,
    pass: true,
    submitTime: "2025-04-20 15:00",
  },
  {
    id: 3,
    employeeId: "A003",
    studentName: "小強",
    examTitle: "小考",
    score: 76,
    pass: false,
    submitTime: "2025-04-18 10:20",
  },
]);

const filteredScores = computed(() =>
  scores.value.filter((record) =>
    `${record.employeeId}${record.studentName}${record.examTitle}`.includes(
      searchKeyword.value.trim()
    )
  )
);
</script>

<style scoped>
.score-list {
  padding: 20px;
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
  background-color: #f4f4f4;
}
</style>
