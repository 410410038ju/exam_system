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

        <!-- 顯示題型 -->
        <div class="modal-form-group question-type-div">
          <label>題型</label>
          <input
            type="text"
            :value="getQuestionType(editingQuestion.type)"
            disabled
            class="question-type"
          />
        </div>

        <!-- 題目 -->
        <div class="modal-form-group">
          <label for="edit-question-text">題目</label>
          <textarea
            v-model="editingQuestion.text"
            placeholder="請輸入題目敘述"
            required
            rows="3"
            cols="30"
          ></textarea>
        </div>

        <!-- 是非題 -->
        <div
          v-if="editingQuestion.type === 'true-false'"
          class="form-group option-form-group"
        >
          <label>正確答案</label>
          <div class="answer-group">
            <!-- 是非題的正確答案選項 -->
            <input
              type="radio"
              id="trueOption"
              value="是"
              v-model="editingQuestion.correctAnswer"
            />
            <label for="trueOption" class="answer-option">是</label>

            <input
              type="radio"
              id="falseOption"
              value="否"
              v-model="editingQuestion.correctAnswer"
            />
            <label for="falseOption" class="answer-option">否</label>
          </div>
        </div>

        <!-- 單選題 -->
        <div
          v-if="editingQuestion.type === 'single-choice'"
          class="form-group option-form-group"
        >
          <!-- 單選題選項編輯 -->
          <div
            v-for="(option, index) in editingQuestion.options"
            :key="index"
            class="option-group"
          >
            <label
              :for="'single-choice-option' + (index + 1)"
              class="option-label"
              >選項 {{ index + 1 }}</label
            >
            <!-- <input
              type="text"
              v-model="editingQuestion.options[index]"
              :placeholder="'選項 ' + (index + 1)"
              required
            /> -->
            <textarea
              v-model="editingQuestion.options[index]"
              :placeholder="'選項 ' + (index + 1)"
              required
              rows="1"
              cols="30"
            ></textarea>
          </div>

          <!-- 單選題的正確答案 -->
          <label>正確答案</label>
          <div class="answer-group">
            <div
              v-for="(option, index) in editingQuestion.options"
              :key="index"
              class="answer"
            >
              <input
                type="radio"
                :id="'single-choice-option' + (index + 1)"
                :value="option"
                v-model="editingQuestion.correctAnswer"
              />
              <label :for="'single-choice-option' + (index + 1)"
                >選項 {{ index + 1 }}</label
              >
            </div>
          </div>
        </div>

        <!-- 複選題 -->
        <div
          v-if="editingQuestion.type === 'multiple-choice'"
          class="form-group option-form-group"
        >
          <!-- 複選題選項編輯 -->
          <div
            v-for="(option, index) in editingQuestion.options"
            :key="index"
            class="option-group"
          >
            <label
              :for="'multiple-choice-option' + (index + 1)"
              class="option-label"
              >選項 {{ index + 1 }}</label
            >
            <!-- <input
              type="text"
              v-model="editingQuestion.options[index]"
              :placeholder="'選項 ' + (index + 1)"
              required
            /> -->
            <textarea
              v-model="editingQuestion.options[index]"
              :placeholder="'選項 ' + (index + 1)"
              required
              rows="1"
              cols="30"
            ></textarea>
          </div>

          <!-- 複選題的正確答案 -->
          <label>正確答案</label>
          <div class="answer-group">
            <div
              v-for="(option, index) in editingQuestion.options"
              :key="index"
              class="answer"
            >
              <input
                type="checkbox"
                v-model="editingQuestion.correctAnswer"
                :value="option"
                :id="'multiple-choice-option' + (index + 1)"
              />
              <label :for="'multiple-choice-option' + (index + 1)">
                選項 {{ index + 1 }}
              </label>
            </div>
          </div>
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
import axios from "axios";

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
const isValidEdit = ref(true); // 用來驗證表單的狀態

let examData = {};

// 顯示題型名稱
const getQuestionType = (type) => {
  switch (type) {
    case "true-false":
      return "是非題";
    case "single-choice":
      return "單選題";
    case "multiple-choice":
      return "複選題";
    default:
      return "未知題型";
  }
};

const setSearchMode = (mode) => {
  searchMode.value = mode;
};

// 當 searchCategory 變更時，更新章選單
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

/*
const saveEdit = () => {
  // 檢查題目與選項是否都已填寫
  isValidEdit.value =
    editingQuestion.value.text &&
    editingQuestion.value.correctAnswer &&
    editingQuestion.value.options.every((option) => option);

  if (!isValidEdit.value) {
    alert("請填寫完整題目！");
    return; // 如果驗證不通過，則不儲存
  }

  // 以題目內容查找題目
  // const index = questions.value.findIndex(
  //   (q) => q.text === editingQuestion.value.text
  // );

  // 如果有唯一的 ID，可以改為這樣查找題目
  const index = questions.value.findIndex(
    (q) => q.questionId === editingQuestion.value.questionId
  );

  if (index !== -1) {
    // 更新問題
    questions.value[index] = { ...editingQuestion.value };
    updateStoredQuestions();

    // 清空編輯表單
    editingQuestion.value = null;
  } else {
    alert("找不到要修改的題目！");
  }
};
*/

watch(
  () => editingQuestion.value?.options, // 使用可選鏈接 (?.) 避免 `editingQuestion.value` 為 null
  (newOptions) => {
    if (!editingQuestion.value || !newOptions) return; // 確保 `editingQuestion.value` 存在

    const { type, correctAnswer } = editingQuestion.value;

    if (type === "single-choice") {
      // 單選題：如果原本的正確答案已不存在，則清空
      if (!newOptions.includes(correctAnswer)) {
        editingQuestion.value.correctAnswer = "";
      }
    } else if (type === "multiple-choice") {
      // 多選題：過濾掉所有已經刪除的選項
      editingQuestion.value.correctAnswer = correctAnswer.filter((ans) =>
        newOptions.includes(ans)
      );
    }
  },
  { deep: true }
);


const saveEdit = () => {
  if (!editingQuestion.value) {
    alert("無編輯中的題目！");
    return;
  }

  // 先確保正確答案仍然存在於選項內
  if (editingQuestion.value.type === "single-choice") {
    if (
      !editingQuestion.value.options.includes(
        editingQuestion.value.correctAnswer
      )
    ) {
      editingQuestion.value.correctAnswer = ""; // 清空錯誤答案
      alert("正確答案已不存在於選項內，請重新選擇！");
      return;
    }
  } else if (editingQuestion.value.type === "multiple-choice") {
    editingQuestion.value.correctAnswer =
      editingQuestion.value.correctAnswer.filter((ans) =>
        editingQuestion.value.options.includes(ans)
      );

    if (editingQuestion.value.correctAnswer.length === 0) {
      alert("正確答案已不存在於選項內，請重新選擇！");
      return;
    }
  }

  // 確保題目和選項都有填寫
  isValidEdit.value =
    editingQuestion.value.text &&
    editingQuestion.value.correctAnswer &&
    editingQuestion.value.options.length > 0 &&
    editingQuestion.value.options.every((option) => option.trim() !== "");

  if (!isValidEdit.value) {
    alert("請填寫完整題目及正確答案！");
    return;
  }

  // 以 questionId 查找題目
  const index = questions.value.findIndex(
    (q) => q.questionId === editingQuestion.value.questionId
  );

  if (index !== -1) {
    // 更新問題
    questions.value[index] = { ...editingQuestion.value };
    updateStoredQuestions();
    editingQuestion.value = null;
  } else {
    alert("找不到要修改的題目！");
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
  background-color: #9f84bd;
  color: white;
}

.search-btn:hover {
  /* background-color: #9f84bd; */
  background-color: #8a6fa0;
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
  width: 100%;
}

.question-type-div {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.keyword-group {
  margin-top: 24px;
}

.option-form-group {
  margin: 0;
  gap: 5px;
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

h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 16px;
}

textarea,
input[type="text"] {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
  height: auto; /* 調整高度 */
  line-height: 1.5; /* 保持字距 */
  text-align: left; /* 讓文字靠左 */
  vertical-align: top; /* 讓游標顯示在上方 */
  white-space: pre-wrap; /* 讓文字在超過邊界時自動換行 */
  word-wrap: break-word; /* 防止長單字超出邊界 */
  resize: none;
}

textarea:focus,
input[type="text"]:focus {
  border-color: #007bff;
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
  z-index: 9999;
}

.modal-content {
  position: relative; /* 讓關閉按鈕相對於此容器定位 */
  background-color: white;
  padding: 30px;
  border-radius: 12px; /* 更圓的邊角 */
  width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch; /* 確保內部元素填滿 */
  text-align: center;
}

.modal-content label {
  width: 100%;
  text-align: left;
  margin-right: 0;
}

.modal-content input[type="text"],
.modal-content textarea {
  width: 100%; /* 讓輸入框填滿 */
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 40%;
  margin: 0 auto;
}

.modal-actions button {
  flex: 1;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-actions button:hover {
  background-color: #0056b3;
}

.modal-form-group {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;
}

.modal-form-group label {
  flex-basis: 15%;
  margin: 0;
}

.modal-form-group input,
.modal-form-group textarea {
  flex-grow: 1; /* 讓內容區域填滿剩餘空間 */
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

.answer-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  gap: 12px;
  width: 100%;
}

.answer-group input {
  flex-grow: 1;
}

.answer {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.answer input {
  margin: 0; /* 移除默認的 margin */
}

.answer label {
  font-size: 16px; /* 調整字型大小 */
  margin: 0;
}

.answer-option {
  margin: 0;
}

.option-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  gap: 12px;
  width: 100%;
}

.option-group textarea {
  width: 900%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.option-group input:focus {
  border-color: #007bff;
}

.option-label {
  margin: auto;
  display: inline-block;
  margin-right: 8px;
  font-size: 14px;
}

.cancel-btn {
  background-color: #ccc;
}

.cancel-btn:hover {
  background-color: #bbb;
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
