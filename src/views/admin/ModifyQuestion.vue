<template>
  <div class="container">
    <AdminNavBar />
    <div class="search-container">
      <!-- 查詢模式按鈕 -->
      <div class="search-mode-buttons">
        <div
          :class="{ active: searchMode === 'category-chapter' }"
          @click="setSearchMode('category-chapter')"
          class="search-btn scope-search-btn"
          tabindex="0"
        >
          範圍查詢
        </div>
        <div
          :class="{ active: searchMode === 'keyword' }"
          @click="setSearchMode('keyword')"
          class="search-btn keyword-search-btn"
          tabindex="0"
        >
          關鍵字查詢
        </div>
      </div>

      <div class="search-content">
        <!-- 業務種類查詢（僅在選擇業務種類與章節查詢時顯示） -->
        <div v-if="searchMode === 'category-chapter'">
          <div class="form-group-container">
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
                <option
                  v-for="chapter in chapters"
                  :key="chapter"
                  :value="chapter"
                >
                  {{ chapter }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="search-section">測驗範圍（節）</label>
              <select v-model="searchSection">
                <option disabled value="">請選擇節</option>
                <option
                  v-for="section in sections"
                  :key="section"
                  :value="section"
                >
                  {{ section }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- 關鍵字查詢（僅在選擇關鍵字查詢時顯示） -->
        <div v-if="searchMode === 'keyword'">
          <div class="form-group keyword-group">
            <label for="search-keyword">請輸入題目或選項的關鍵字</label>
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="請輸入關鍵字"
            />
          </div>
        </div>

        <!-- 查詢按鈕 -->
        <div class="form-group">
          <button class="button" @click="searchQuestions">查詢</button>
        </div>
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

    <!-- 修改題目彈出視窗 -->
    <div v-if="editingQuestion" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="cancelEdit">x</button>

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

        <div class="modal-actions">
          <button class="button" @click="saveEdit">儲存</button>
          <button class="button cancel-btn" @click="cancelEdit">取消</button>
        </div>
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
const searchKeyword = ref(""); // 新增關鍵字查詢
const searchMode = ref("category-chapter"); // 查詢模式，預設是依業務種類與章節查詢
const questions = ref([]);
const editingQuestion = ref(null);
const noQuestions = ref(false); // 新增，顯示查無結果訊息

let examData = {};

const setSearchMode = (mode) => {
  searchMode.value = mode;
};

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
  if (searchMode.value === "category-chapter") {
    // 根據業務種類、章節、節查詢
    const storageKey = `Q${searchCategory.value}_${searchChapter.value}-${searchSection.value}`;
    questions.value = JSON.parse(localStorage.getItem(storageKey)) || [];
  } else if (searchMode.value === "keyword") {
    // 根據關鍵字查詢
    questions.value = [];
    const allQuestions = JSON.parse(localStorage.getItem("allQuestions")) || [];
    questions.value = allQuestions.filter(
      (question) =>
        question.text.includes(searchKeyword.value) ||
        question.options.some((option) => option.includes(searchKeyword.value))
    );
  }

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

<!-- 第一版 
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
</style> -->

<!-- 第二版 
<style scoped>
.container {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  top: 80px;
  left: 0;
  right: 0;
  width: 80%;
  margin: 0 auto; /* 水平置中 */
}

/* 修改查詢模式按鈕位置 */
.search-container {
  width: 80%;
  height: 200px;
  background-color: #f0f0f0;
  /*background-image: url('../../assets/images/search.png');
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;*/
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  position: relative;
}

/*.search-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9); 
  z-index: -1; 
}*/

/* 修改查詢模式按鈕位置 */
.search-mode-buttons {
  flex: 1;
  display: flex;
  flex-direction: column; /* 垂直排列 */
  gap: 10px; /* 控制按鈕間距 */
  background-color: yellow;
  padding: 20px;
}

.search-mode-buttons button {
  padding: 10px 20px;
  margin-right: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn {
  color: black;
  background-color: white;
}

.search-content {
  flex: 4;
  padding: 10px;
  background-color: #f48f8f;
}

h1,
h2 {
  text-align: center;
  color: #333;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  min-width: 180px;
  flex: 1; /* 讓所有元素平均分配空間 */
}

.form-group label {
  text-align: center;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

select,
input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
}

/* 查詢按鈕 */
.button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.button:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
}

.cancel-btn:hover {
  background-color: #d32f2f;
}

/* 題目表格 */
.question-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.question-table th,
.question-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.question-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.question-table td {
  background-color: #fff;
}

/* 按鈕區 */
button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s;
}

/* 無題目時的提示 */
.no-questions-message {
  text-align: center;
  font-size: 18px;
  color: #777;
  margin-top: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  position: relative; /* 讓關閉按鈕相對於此容器定位 */
  background-color: white;
  padding: 30px;
  border-radius: 12px; /* 更圓的邊角 */
  width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* 增加陰影的強度 */
  text-align: center;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  background-color: white;
  color: rgb(0, 0, 0);
}

/* 修改題目區塊 (懸浮視窗) */
/*.edit-question-container {
  background: rgba(0, 0, 0, 0.5);
  background-color: #f7c5c5;
  padding: 30px;
  border-radius: 12px; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); 
  position: fixed; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%); 
  z-index: 1000;
  width: 80%; 
  max-width: 800px; 
  box-sizing: border-box;
  overflow: hidden;
}*/

/* 遮罩層 */
/*.edit-question-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999; 
}*/
</style>
-->

<!-- 第三版 -->
<style scoped>
/* 基本設定 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 容器 */
.search-container {
  width: 100%;
  max-width: 800px;
  min-height: 275px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
}

/* 查詢模式按鈕 */
.search-mode-buttons {
  display: flex;
  margin-bottom: 20px;
}

.search-btn {
  flex: 1;
  text-align: center;
  padding: 10px;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn.active {
  background-color: #007bff;
  color: white;
}

.search-btn:hover {
  background-color: #007bff;
  color: white;
}

/* 表單內容 */
.search-content {
  display: flex;
  flex-direction: column;
}

.form-group-container {
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
  width: 100%;
}

/* 表單組件 */
.form-group {
  flex: 1;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

.keyword-group {
  margin-top: 24px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 20px;
}

select,
input[type="text"] {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

select:focus,
input[type="text"]:focus {
  border-color: #007bff;
}

input[type="text"] {
  height: 36px;
}

.questions-list {
  margin: 0;
  position: absolute;
  top: 400px;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.questions-list h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: fixed;
}

th,
td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

th {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

td {
  background-color: #f9f9f9;
}

td button {
  padding: 5px 10px;
  margin: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

td button:hover {
  background-color: #0056b3;
}

.no-questions-message {
  position: absolute;
  top: 400px;
  left: 0;
  right: 0;
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
  color: #555;
}

/* 查詢按鈕 */
.button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  position: relative; /* 讓關閉按鈕相對於此容器定位 */
  background-color: white;
  padding: 30px;
  border-radius: 12px; /* 更圓的邊角 */
  width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* 增加陰影的強度 */
  text-align: center;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  background-color: white;
  color: rgb(0, 0, 0);
}

/* 在小螢幕下，適應視窗大小 */
@media (max-width: 768px) {
  .search-container {
    padding: 15px;
  }

  .search-btn {
    font-size: 14px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .button {
    width: 100%;
  }
}
</style>
