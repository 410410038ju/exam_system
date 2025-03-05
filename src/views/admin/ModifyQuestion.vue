<template>
  <div class="container">
    <AdminNavBar />
    <div class="search-container">
      <h1>查詢與修改題目</h1>

      <div class="form-group">
        <label for="search-category">業務種類</label>
        <select v-model="searchCategory">
          <option disabled value="">請選擇業務種類</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="search-chapter">測驗範圍（章）</label>
        <select v-model="searchChapter">
          <option disabled value="">請選擇章</option>
          <option v-for="chapter in chapters" :key="chapter" :value="chapter">
            {{ chapter }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="search-section">測驗範圍（節）</label>
        <select v-model="searchSection">
          <option disabled value="">請選擇節</option>
          <option v-for="section in sections" :key="section" :value="section">
            {{ section }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <button class="button" @click="searchQuestions">查詢</button>
      </div>
    </div>

    <div v-if="questions.length > 0" class="questions-list">
      <h2>查詢結果</h2>
      <table
        border="1"
        style="width: 100%; margin-top: 20px; border-collapse: collapse"
      >
        <thead>
          <tr>
            <th>題號</th>
            <th>題型</th>
            <th>題目</th>
            <th>選項</th>
            <th>正確答案</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(question, index) in questions" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              {{
                question.type === "true-false"
                  ? "是非題"
                  : question.type === "single-choice"
                  ? "單選題"
                  : "複選題"
              }}
            </td>
            <td>{{ question.text }}</td>
            <td>{{ question.options.join(", ") }}</td>
            <td>{{ question.correctAnswer }}</td>
            <td>
              <button @click="editQuestion(question)">修改</button>
              <button @click="deleteQuestion(index)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="noQuestions" class="no-questions-message">
      <p>尚無該範圍的題目</p>
    </div>

    <div v-if="editingQuestion" class="edit-question-container">
      <h2>修改題目</h2>

      <div class="form-group">
        <label for="edit-question-text">題目</label>
        <input
          type="text"
          v-model="editingQuestion.text"
          placeholder="修改題目"
        />
      </div>

      <div v-if="editingQuestion.type === 'single-choice'" class="form-group">
        <label>選項</label>
        <div v-for="(option, index) in editingQuestion.options" :key="index">
          <input
            type="text"
            v-model="editingQuestion.options[index]"
            :placeholder="'選項 ' + (index + 1)"
          />
        </div>
      </div>

      <div class="form-group">
        <label>正確答案</label>
        <input
          type="text"
          v-model="editingQuestion.correctAnswer"
          placeholder="修改正確答案"
        />
      </div>

      <div class="form-group">
        <button class="button" @click="saveEdit">保存修改</button>
        <button class="button" @click="cancelEdit">取消修改</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";

import AdminNavBar from "../../components/AdminNavBar.vue";

const categories = ref([]);
const chapters = ref([]);
const sections = ref([]);
const searchCategory = ref("");
const searchChapter = ref("");
const searchSection = ref("");
const questions = ref([]);
const editingQuestion = ref(null);
const noQuestions = ref(false); // 新增，顯示查無結果訊息

let examData = {};

// 當 searchCategory 變更時，更新章節選單
watch(searchCategory, (newCategory) => {
  if (newCategory && examData[newCategory]) {
    chapters.value = Object.keys(examData[newCategory]);
  } else {
    chapters.value = [];
  }

  searchChapter.value = "";

  sections.value = [];

  searchSection.value = "";
});

// 當 searchChapter 變更時，更新節選單
watch(searchChapter, (newChapter) => {
  if (newChapter && searchCategory.value) {
    sections.value = examData[searchCategory.value][newChapter] || [];
  } else {
    sections.value = [];
  }

  searchSection.value = "";
});

const searchQuestions = () => {
  const storageKey = `Q${searchCategory.value}_${searchChapter.value}-${searchSection.value}`;
  questions.value = JSON.parse(localStorage.getItem(storageKey)) || [];

  // 如果查詢結果為空，顯示尚無題目訊息
  noQuestions.value = questions.value.length === 0;
};

const editQuestion = (question) => {
  editingQuestion.value = { ...question };
};

const deleteQuestion = (index) => {
  if (confirm("確定刪除此題目嗎？")) {
    questions.value.splice(index, 1);
    updateStoredQuestions();
  }
};

const saveEdit = () => {
  const index = questions.value.findIndex(
    (q) => q.text === editingQuestion.value.text
  );
  if (index !== -1) {
    questions.value[index] = { ...editingQuestion.value };
    updateStoredQuestions();
    editingQuestion.value = null;
  }
};

const cancelEdit = () => {
  editingQuestion.value = null;
};

const updateStoredQuestions = () => {
  const storageKey = `Q${searchCategory.value}_${searchChapter.value}-${searchSection.value}`;
  localStorage.setItem(storageKey, JSON.stringify(questions.value));
};

onMounted(() => {
  examData = JSON.parse(localStorage.getItem("examData")) || {};
  categories.value = Object.keys(examData);
});
</script>

<style scoped>
.container {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.button:hover {
  background-color: #45a049;
}

.questions-list table {
  width: 100%;
  border-collapse: collapse;
}

.questions-list th,
.questions-list td {
  padding: 10px;
  text-align: center;
}

.edit-question-container {
  margin-top: 20px;
  border-top: 2px solid #ccc;
  padding-top: 20px;
}
</style>
