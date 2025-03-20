<template>
  <div class="container">
    <AdminNavBar />
    <div class="content">
      <div class="header">
        <h1>管理題庫類別</h1>

        <!-- 搜尋欄位 -->
        <div class="search">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜尋業務種類、章、節..."
            class="search-input"
          />
          <button @click="search" class="search-button">搜尋</button>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>
              業務種類
              <button @click="addCategory" class="form-button">
                新增業務種類
              </button>
            </th>
            <th>章</th>
            <th>節</th>
          </tr>
        </thead>

        <tbody v-for="category in filteredCategories" :key="category">
          <template
            v-for="(chapter, chapterIndex) in Object.keys(examData[category])
              .length
              ? Object.keys(examData[category])
              : ['暫無章']"
          >
            <tr
              v-for="(section, sectionIndex) in examData[category][chapter] &&
              examData[category][chapter].length
                ? examData[category][chapter]
                : ['暫無節']"
              :key="`${category}-${chapter}-${sectionIndex}`"
            >
              <!-- 業務種類 -->
              <td
                v-if="chapterIndex === 0 && sectionIndex === 0"
                :rowspan="getCategoryRowSpan(category) || 1"
              >
                {{ category }}
                <div class="buttons-container">
                  <button
                    v-if="category !== '暫無章'"
                    @click="addChapter(category)"
                    class="form-button"
                  >
                    新增章
                  </button>
                  <button
                    v-if="category !== '暫無章'"
                    @click="editCategory(category)"
                    class="edit-button"
                  >
                    編輯
                  </button>
                  <button
                    v-if="category !== '暫無章'"
                    @click="deleteCategory(category)"
                    class="delete-button"
                  >
                    刪除
                  </button>
                </div>
              </td>

              <!-- 章 -->
              <td
                v-if="sectionIndex === 0"
                :rowspan="
                  examData[category][chapter] &&
                  examData[category][chapter].length
                    ? examData[category][chapter].length
                    : 1
                "
              >
                <span>{{ chapter }}</span>
                <template v-if="chapter !== '暫無章'">
                  <div class="buttons-container">
                    <button
                      @click="addSection(category, chapter)"
                      class="form-button"
                    >
                      新增節
                    </button>
                    <button
                      @click="editChapter(category, chapter)"
                      class="edit-button"
                    >
                      編輯
                    </button>
                    <button
                      @click="deleteChapter(category, chapter)"
                      class="delete-button"
                    >
                      刪除
                    </button>
                  </div>
                </template>
              </td>

              <!-- 節 -->
              <td>
                <span>{{ section }}</span>
                <template v-if="section !== '暫無節'">
                  <div class="buttons-container">
                    <button
                      @click="editSection(category, chapter, sectionIndex)"
                      class="edit-button"
                    >
                      編輯
                    </button>
                    <button
                      @click="deleteSection(category, chapter, sectionIndex)"
                      class="delete-button"
                    >
                      刪除
                    </button>
                  </div>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import AdminNavBar from "../../components/AdminNavBar.vue";

const examData = JSON.parse(localStorage.getItem("examData")) || {};

// 使用 reactive 來處理 categories，並且使用 ref 來控制過濾結果
const categories = reactive(Object.keys(examData));
const searchQuery = ref("");
const filteredCategories = ref([...categories]); // 用來儲存過濾後的結果

// 重新載入頁面
const refreshCategories = () => {
  // categories.splice(0, categories.length, ...Object.keys(examData)); // 使用 splice 進行更新

  // 清空 categories，然後重新賦值以觸發重新渲染
  categories.splice(0, categories.length); // 清空 categories
  categories.push(...Object.keys(examData)); // 重新賦值
  searchQuery.value = ""; // 可選，重置搜尋框
  location.reload(); // 重新整理頁面
};

// 關鍵字搜尋
const search = () => {
  const query = searchQuery.value.toLowerCase();
  if (query) {
    filteredCategories.value = categories.filter((category) => {
      if (category.toLowerCase().includes(query)) return true;

      return Object.keys(examData[category]).some((chapter) => {
        if (chapter.toLowerCase().includes(query)) return true;

        return examData[category][chapter].some((section) =>
          section.toLowerCase().includes(query)
        );
      });
    });
  } else {
    filteredCategories.value = [...categories]; // 若搜尋框為空，顯示所有類別
  }
};

const getCategoryRowSpan = (category) => {
  const chapters = Object.keys(examData[category] || {});
  if (chapters.length === 0) return 1; // 沒有章時，回傳 1

  return chapters.reduce((total, chapter) => {
    const sections = examData[category][chapter] || [];
    return total + (sections.length > 0 ? sections.length : 1); // 沒有節時，至少要回傳 1
  }, 0);
};

/* 修改的第二份(還沒測試) 
const getCategoryRowSpan = (category) => {
  const chapters = Object.keys(examData[category] || {});
  if (chapters.length === 0) return 1; // 沒有章時，回傳 1

  return chapters.reduce((total, chapter) => {
    const sections = examData[category][chapter] || [];
    return total + Math.max(sections.length, 1); // 確保至少回傳 1
  }, 0);
};

*/

// 新增業務種類
const addCategory = () => {
  const newCategory = prompt("請輸入新的業務種類名稱:");
  if (newCategory && !examData[newCategory]) {
    examData[newCategory] = {};
    localStorage.setItem("examData", JSON.stringify(examData));
    refreshCategories();
  } else if (!newCategory) {
    return;
  } else {
    alert("此業務種類已存在！");
  }
};

// 編輯業務種類
const editCategory = (category) => {
  const newCategoryName = prompt("請輸入新的業務種類名稱:", category);
  if (newCategoryName && newCategoryName !== category) {
    examData[newCategoryName] = examData[category];
    delete examData[category];
    localStorage.setItem("examData", JSON.stringify(examData));
    refreshCategories();
  }
};

// 刪除業務種類
const deleteCategory = (category) => {
  if (confirm(`確定要刪除 ${category} 嗎？`)) {
    delete examData[category];
    localStorage.setItem("examData", JSON.stringify(examData));
    refreshCategories();
  }
};

// 新增章
const addChapter = (category) => {
  const newChapter = prompt("請輸入新的章名稱:");
  if (newChapter && !examData[category][newChapter]) {
    examData[category] = examData[category] || {}; // 確保該類別存在
    examData[category][newChapter] = [];
    localStorage.setItem("examData", JSON.stringify(examData));
    refreshCategories();
  } else if (!newChapter) {
    return;
  } else {
    alert("此章已存在！");
  }
};

// 編輯章
const editChapter = (category, chapter) => {
  const newChapterName = prompt("請輸入新的章名稱:", chapter);
  if (newChapterName && newChapterName !== chapter) {
    examData[category][newChapterName] = examData[category][chapter];
    delete examData[category][chapter];
    localStorage.setItem("examData", JSON.stringify(examData));
    refreshCategories();
  }
};

// 刪除章
const deleteChapter = (category, chapter) => {
  if (confirm(`確定要刪除 ${chapter} 嗎？`)) {
    delete examData[category][chapter];
    localStorage.setItem("examData", JSON.stringify(examData));
    refreshCategories();
  }
};

// 新增節
const addSection = (category, chapter) => {
  const newSection = prompt("請輸入新的節名稱:");
  if (newSection) {
    // 確保節名稱在該章節中是唯一的
    if (!examData[category][chapter].includes(newSection)) {
      examData[category][chapter] = examData[category][chapter] || []; // 保證章節存在
      examData[category][chapter].push(newSection); // 新增節
      localStorage.setItem("examData", JSON.stringify(examData)); // 儲存至本地
      refreshCategories(); // 刷新頁面，保證資料正確顯示
    } else {
      alert("此節已存在！");
    }
  }
};

// 編輯節
const editSection = (category, chapter, index) => {
  const newSectionName = prompt(
    "請輸入新的節名稱:",
    examData[category][chapter][index]
  );
  if (newSectionName) {
    examData[category][chapter][index] = newSectionName;
    localStorage.setItem("examData", JSON.stringify(examData));
    refreshCategories();
  }
};

// 刪除節
const deleteSection = (category, chapter, index) => {
  if (confirm(`確定要刪除此節嗎？`)) {
    examData[category][chapter].splice(index, 1);
    localStorage.setItem("examData", JSON.stringify(examData));
    refreshCategories();
  }
};
</script>

<!--
<style scoped>
.container {
  padding: 20px;
}
.content {
  max-width: 900px;
  margin: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.data-table th,
.data-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}
.edit-button,
.delete-button,
.form-button {
  margin-left: 5px;
}

.search-input {
  padding: 8px;
  margin-bottom: 15px;
  width: 80%;
  font-size: 14px;
}

.search-button {
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
}
</style>
-->

<!-- 第一版 -->
<style scoped>
/* 容器樣式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  width: 80%;
}

/* 內容區域 */
.content {
  background-color: #f4f4f4;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* h1標題 */
.header h1 {
  font-size: 36px;
  color: #333;
  margin: 0;
  flex-grow: 1; /* 讓標題佔用剩餘的空間 */
  text-align: left;
}

/* 搜尋欄位 */
.search {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-button {
  height: 40px;
  width: 30%;
  margin: 10px auto;
  margin-left: 10px;
  padding: 10px;
  font-size: 16px;
  background-color: #ad1ed1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #8c00b3;
}

/* 表格樣式 */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

.data-table th {
  background-color: #ff97ec;
  font-weight: bold;
  font-size: 24px;
}

.data-table td {
  background-color: #fff;
  text-align: center; /* 讓文字靠左 */
  vertical-align: middle; /* 垂直置中 */
  font-size: 20px;
}

/* 按鈕樣式 */
.form-button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-button:hover {
  background-color: #218838;
}

.edit-button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #eaff00;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #e0a800;
  color: white;
}

.delete-button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c82333;
}

/* 表格按鈕間距 */
button {
  margin-left: 10px;
  display: inline-block;
  margin-left: 10px;
  white-space: nowrap; 
  vertical-align: middle; /* 讓按鈕垂直對齊 */
}



td {
  text-align: center; 
  vertical-align: middle; 
  padding-right: 10px; 

  justify-content: space-between; 
  align-items: center;  
}

/* td span {
  display: block;
  text-align: center; 
} */

.buttons-container {
  display: flex;
  justify-content: center; 
  align-items: center; 
}

/* 表格內容設置 */
td[rowspan] {
  vertical-align: middle;
}

td button {
  white-space: nowrap; /* 防止換行 */
  display: inline-block; /* 保持在同一行 */
  text-align: center;
}

/* 按鈕的樣式 */
button {
  margin-left: 10px;
}
</style>


<!-- 第二版 
<style scoped>
/* 容器樣式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  width: 80%;
}

/* 內容區域 */
.content {
  background-color: #f8e6f1; /* 淡粉紫色 */
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* h1標題 */
.header h1 {
  font-size: 36px;
  color: #4b3f72; /* 深紫色 */
  margin: 0;
  flex-grow: 1;
  text-align: left;
}

/* 搜尋欄位 */
.search {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #e1bee7; /* 淡紫色邊框 */
  border-radius: 4px;
}

.search-button {
  height: 40px;
  width: 30%;
  margin: 10px auto;
  margin-left: 10px;
  padding: 10px;
  font-size: 16px;
  background-color: #a46cb8; /* 紫色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #7e4b96; /* 深紫色 */
}

/* 表格樣式 */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

.data-table th {
  background-color: #e1bee7; /* 淡紫色 */
  font-weight: bold;
  font-size: 24px;
  color: #4b3f72; /* 深紫色 */
}

.data-table td {
  background-color: #ffffff;
  text-align: center;
  vertical-align: middle;
  font-size: 20px;
  color: #5d5d5d; /* 中灰色 */
}

/* 按鈕樣式 */
.form-button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #d1a7d9; /* 淡紫色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-button:hover {
  background-color: #a46cb8; /* 紫色 */
}

.edit-button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #ffb3d9; /* 淺粉色 */
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #ff8ab3; /* 深粉色 */
  color: white;
}

.delete-button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #e57373; /* 淺紅色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c75b5b; /* 深紅色 */
}

/* 表格按鈕間距 */
button {
  margin-left: 10px;
  display: inline-block;
  white-space: nowrap;
  vertical-align: middle;
}

td {
  text-align: center;
  vertical-align: middle;
  padding-right: 10px;
  justify-content: space-between;
  align-items: center;
}

.buttons-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 表格內容設置 */
td[rowspan] {
  vertical-align: middle;
}

td button {
  white-space: nowrap;
  display: inline-block;
  text-align: center;
}

/* 按鈕的樣式 */
button {
  margin-left: 10px;
}
</style>
-->

<!-- 第三版 
<style scoped>
/* 容器樣式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  width: 80%;
}

/* 內容區域 */
.content {
  background-color: #e7f4f5; /* 淡藍綠色 */
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* h1標題 */
.header h1 {
  font-size: 36px;
  color: #333; /* 深灰色 */
  margin: 0;
  flex-grow: 1;
  text-align: left;
}

/* 搜尋欄位 */
.search {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #c9e2e7; /* 淡藍邊框 */
  border-radius: 4px;
}

.search-button {
  height: 40px;
  width: 30%;
  margin: 10px auto;
  margin-left: 10px;
  padding: 10px;
  font-size: 16px;
  background-color: #ff6f61; /* 鮮豔橘紅色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #ff4f3a; /* 深一點的橘紅色 */
}

/* 表格樣式 */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

.data-table th {
  background-color: #f1d0b5; /* 淡粉橙色 */
  font-weight: bold;
  font-size: 24px;
  color: #563d34; /* 深棕色 */
}

.data-table td {
  background-color: #ffffff;
  text-align: center;
  vertical-align: middle;
  font-size: 20px;
  color: #5d5d5d; /* 中灰色 */
}

/* 按鈕樣式 */
.form-button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #56cfe1; /* 輕藍色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-button:hover {
  background-color: #02a8b5; /* 深藍色 */
}

.edit-button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #ffcc00; /* 鮮黃金色 */
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #e0a800; /* 深金色 */
  color: white;
}

.delete-button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #d32f2f; /* 鮮紅色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #b71c1c; /* 深紅色 */
}

/* 表格按鈕間距 */
button {
  margin-left: 10px;
  display: inline-block;
  white-space: nowrap;
  vertical-align: middle;
}

td {
  text-align: center;
  vertical-align: middle;
  padding-right: 10px;
  justify-content: space-between;
  align-items: center;
}

.buttons-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 表格內容設置 */
td[rowspan] {
  vertical-align: middle;
}

td button {
  white-space: nowrap;
  display: inline-block;
  text-align: center;
}

/* 按鈕的樣式 */
button {
  margin-left: 10px;
}
</style>
-->

<!-- 第四版(粉紫漸層) 
<style scoped>
/* 容器樣式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  width: 80%;
}

/* 內容區域 */
.content {
  background: linear-gradient(135deg, #f8e6f1, #d0a6d3); /* 漸層的粉紫色背景 */
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* h1標題 */
.header h1 {
  font-size: 36px;
  color: #6a4c91; /* 更深的紫色 */
  margin: 0;
  flex-grow: 1;
  text-align: left;
}

/* 搜尋欄位 */
.search {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #d2a7d8; /* 淡紫色邊框 */
  border-radius: 4px;
  background-color: #fff7f8; /* 淺粉色背景 */
}

.search-button {
  height: 40px;
  width: 30%;
  margin: 10px auto;
  margin-left: 10px;
  padding: 10px;
  font-size: 16px;
  background-color: #9b4b92; /* 深紫色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.search-button:hover {
  background-color: #7a3580; /* 深紫色 */
}

/* 表格樣式 */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #e1bee7; /* 淡紫色邊框 */
}

.data-table th {
  background: linear-gradient(135deg, #f4c4e0, #d1a7d9); /* 漸層背景 */
  font-weight: bold;
  font-size: 24px;
  color: #4b3f72; /* 深紫色 */
}

.data-table td {
  background-color: #ffffff;
  text-align: center;
  vertical-align: middle;
  font-size: 20px;
  color: #6a4c91; /* 更深的紫色 */
}

/* 按鈕樣式 */
.form-button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #e0aad7; /* 淺紫色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-button:hover {
  background-color: #9b4b92; /* 紫色 */
}

.edit-button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #f0c9e6; /* 淺粉色 */
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-button:hover {
  background-color: #e6b0d6; /* 更深粉紫色 */
  color: white;
}

.delete-button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #f9c6d9; /* 淺紅色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delete-button:hover {
  background-color: #f27b6a; /* 深紅色 */
}

/* 表格按鈕間距 */
button {
  margin-left: 10px;
  display: inline-block;
  white-space: nowrap;
  vertical-align: middle;
}

td {
  text-align: center;
  vertical-align: middle;
  padding-right: 10px;
  justify-content: space-between;
  align-items: center;
}

.buttons-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 表格內容設置 */
td[rowspan] {
  vertical-align: middle;
}

td button {
  white-space: nowrap;
  display: inline-block;
  text-align: center;
}

/* 按鈕的樣式 */
button {
  margin-left: 10px;
}
</style>
-->


