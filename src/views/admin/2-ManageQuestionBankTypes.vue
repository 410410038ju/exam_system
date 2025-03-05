<!-- 第一版
<template>
  <div class="container">
    <AdminNavBar />
    <div class="content">
      <h1>管理題庫類別</h1>
      
      <div class="form-group">
        <label class="form-label">業務種類</label>
        <button type="button" @click="addCategory" class="form-button">
          新增業務種類
        </button>
      </div>

      <ul class="category-list">
        <li v-for="category in categories" :key="category" class="category-item">
          <div class="category-header">
            <span @click="toggleCategory(category)">
              {{ category }}
            </span>
            <button @click="editCategory(category)" class="edit-button">編輯</button>
            <button @click="deleteCategory(category)" class="delete-button">刪除</button>
          </div>
          
          <ul v-if="expandedCategory === category" class="chapter-list">
            <li v-for="chapter in Object.keys(examData[category])" :key="chapter">
              {{ chapter }}
              <button @click="editChapter(category, chapter)" class="edit-button">編輯</button>
              <button @click="deleteChapter(category, chapter)" class="delete-button">刪除</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AdminNavBar from "../../components/AdminNavBar.vue";

const examData = JSON.parse(localStorage.getItem("examData")) || {};
const categories = ref(Object.keys(examData));
const expandedCategory = ref(null);

const toggleCategory = (category) => {
  expandedCategory.value = expandedCategory.value === category ? null : category;
};

const addCategory = () => {
  const newCategory = prompt("請輸入新的業務種類名稱:");
  if (newCategory && !examData[newCategory]) {
    examData[newCategory] = {};
    localStorage.setItem("examData", JSON.stringify(examData));
    categories.value = Object.keys(examData);
  } else {
    alert("此業務種類已存在或名稱無效！");
  }
};

const editCategory = (category) => {
  const newCategoryName = prompt("請輸入新的業務種類名稱:", category);
  if (newCategoryName && newCategoryName !== category) {
    examData[newCategoryName] = examData[category];
    delete examData[category];
    localStorage.setItem("examData", JSON.stringify(examData));
    categories.value = Object.keys(examData);
  }
};

const deleteCategory = (category) => {
  if (confirm(`確定要刪除 ${category} 嗎？`)) {
    delete examData[category];
    localStorage.setItem("examData", JSON.stringify(examData));
    categories.value = Object.keys(examData);
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}
.content {
  max-width: 600px;
  margin: auto;
}
.category-list {
  list-style: none;
  padding: 0;
}
.category-item {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.edit-button, .delete-button {
  margin-left: 10px;
}
</style>
-->

<!-- 第二版
<template>
  <div class="container">
    <AdminNavBar />
    <div class="content">
      <h1>管理題庫類別</h1>
      
      <div class="form-group">
        <label class="form-label">業務種類</label>
        <button type="button" @click="addCategory" class="form-button">
          新增業務種類
        </button>
      </div>

      <ul class="category-list">
        <li v-for="category in categories" :key="category" class="category-item">
          <div class="category-header">
            <span @click="toggleCategory(category)">
              {{ category }}
            </span>
            <button @click="editCategory(category)" class="edit-button">編輯</button>
            <button @click="deleteCategory(category)" class="delete-button">刪除</button>
          </div>
          
          <ul v-if="expandedCategory === category" class="chapter-list">
            <li v-for="chapter in Object.keys(examData[category])" :key="chapter">
              <div class="chapter-header">
                {{ chapter }}
                <button @click="editChapter(category, chapter)" class="edit-button">編輯</button>
                <button @click="deleteChapter(category, chapter)" class="delete-button">刪除</button>
                <button @click="toggleChapter(category, chapter)" class="toggle-button">展開</button>
              </div>
              
              <ul v-if="expandedChapter === chapter" class="section-list">
                <li v-for="(section, index) in examData[category][chapter]" :key="index">
                  {{ section }}
                  <button @click="editSection(category, chapter, index)" class="edit-button">編輯</button>
                  <button @click="deleteSection(category, chapter, index)" class="delete-button">刪除</button>
                </li>
              </ul>
              <button @click="addSection(category, chapter)" class="form-button">新增節</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AdminNavBar from "../../components/AdminNavBar.vue";

const examData = JSON.parse(localStorage.getItem("examData")) || {};
const categories = ref(Object.keys(examData));
const expandedCategory = ref(null);
const expandedChapter = ref(null);

const toggleCategory = (category) => {
  expandedCategory.value = expandedCategory.value === category ? null : category;
};

const toggleChapter = (category, chapter) => {
  expandedChapter.value = expandedChapter.value === chapter ? null : chapter;
};

const addCategory = () => {
  const newCategory = prompt("請輸入新的業務種類名稱:");
  if (newCategory && !examData[newCategory]) {
    examData[newCategory] = {};
    localStorage.setItem("examData", JSON.stringify(examData));
    categories.value = Object.keys(examData);
  } else {
    alert("此業務種類已存在或名稱無效！");
  }
};

const editCategory = (category) => {
  const newCategoryName = prompt("請輸入新的業務種類名稱:", category);
  if (newCategoryName && newCategoryName !== category) {
    examData[newCategoryName] = examData[category];
    delete examData[category];
    localStorage.setItem("examData", JSON.stringify(examData));
    categories.value = Object.keys(examData);
  }
};

const deleteCategory = (category) => {
  if (confirm(`確定要刪除 ${category} 嗎？`)) {
    delete examData[category];
    localStorage.setItem("examData", JSON.stringify(examData));
    categories.value = Object.keys(examData);
  }
};

const editChapter = (category, chapter) => {
  const newChapterName = prompt("請輸入新的章名稱:", chapter);
  if (newChapterName && newChapterName !== chapter) {
    examData[category][newChapterName] = examData[category][chapter];
    delete examData[category][chapter];
    localStorage.setItem("examData", JSON.stringify(examData));
  }
};

const deleteChapter = (category, chapter) => {
  if (confirm(`確定要刪除 ${chapter} 嗎？`)) {
    delete examData[category][chapter];
    localStorage.setItem("examData", JSON.stringify(examData));
  }
};

const addSection = (category, chapter) => {
  const newSection = prompt("請輸入新的節名稱:");
  if (newSection) {
    examData[category][chapter] = examData[category][chapter] || [];
    examData[category][chapter].push(newSection);
    localStorage.setItem("examData", JSON.stringify(examData));
  }
};

const editSection = (category, chapter, index) => {
  const newSectionName = prompt("請輸入新的節名稱:", examData[category][chapter][index]);
  if (newSectionName) {
    examData[category][chapter][index] = newSectionName;
    localStorage.setItem("examData", JSON.stringify(examData));
  }
};

const deleteSection = (category, chapter, index) => {
  if (confirm("確定要刪除此節嗎？")) {
    examData[category][chapter].splice(index, 1);
    localStorage.setItem("examData", JSON.stringify(examData));
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}
.content {
  max-width: 600px;
  margin: auto;
}
.category-list, .chapter-list, .section-list {
  list-style: none;
  padding: 0;
}
.category-item, .chapter-header {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.edit-button, .delete-button, .toggle-button {
  margin-left: 10px;
}
</style>
-->

<!-- 第三版 -->
<template>
  <div class="container">
    <AdminNavBar />
    <div class="content">
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

        <!-- <tbody
          v-for="category in searchQuery ? filteredCategories : categories"
          :key="category"
        > -->
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
                {{ chapter }}
                <template v-if="chapter !== '暫無章'">
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
                </template>
              </td>

              <!-- 節 -->
              <td>
                {{ section }}
                <template v-if="section !== '暫無節'">
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
                </template>
              </td>
            </tr>
          </template>
        </tbody>

        <!-- <tbody v-for="category in categories" :key="category">
          <template
            v-for="(chapter, chapterIndex) in Object.keys(examData[category])"
          >
            <tr
              v-for="(section, sectionIndex) in examData[category][chapter]"
              :key="section"
            >
              <td
                v-if="chapterIndex === 0 && sectionIndex === 0"
                :rowspan="getCategoryRowSpan(category)"
              >
                {{ category }}
                <button @click="addChapter(category)" class="form-button">
                  新增章
                </button>
                <button @click="editCategory(category)" class="edit-button">
                  編輯
                </button>
                <button @click="deleteCategory(category)" class="delete-button">
                  刪除
                </button>
                
              </td>
              <td
                v-if="sectionIndex === 0"
                :rowspan="examData[category][chapter].length"
              >
                {{ chapter }}
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
                
              </td>
              <td>
                {{ section }}
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
              </td>
            </tr>
          </template>
        </tbody> -->
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import AdminNavBar from "../../components/AdminNavBar.vue";

const examData = JSON.parse(localStorage.getItem("examData")) || {};
const categories = ref(Object.keys(examData));
// const categories = reactive(Object.keys(examData));

// 搜尋欄位的關鍵字
const searchQuery = ref("");
let filteredCategories = ref([...categories.value]); // 用來儲存過濾後的結果


// 重新載入頁面
const refreshCategories = () => {
  categories.value = []; // 清空以觸發 Vue 重新渲染
  categories.value = Object.keys(examData);
  /*categories.value = []; // 清空 categories

  setTimeout(() => {
    categories.value = Object.keys(examData); // 重新賦值
  }, 0);*/
  location.reload(); // 重新整理頁面
};

const getCategoryRowSpan = (category) => {
  return Object.keys(examData[category]).reduce(
    (total, chapter) => total + examData[category][chapter].length,
    0
  );
};

// 關鍵字搜尋
/*const search = () => {
  filteredCategories.value = categories.value.filter((category) => {
    const query = searchQuery.value.toLowerCase();
    // 檢查業務種類是否符合搜尋條件
    if (category.toLowerCase().includes(query)) return true;

    // 檢查章節和節是否符合搜尋條件
    return Object.keys(examData[category]).some((chapter) => {
      if (chapter.toLowerCase().includes(query)) return true;

      return examData[category][chapter].some((section) =>
        section.toLowerCase().includes(query)
      );
    });
  });
};*/
const search = () => {
  const query = searchQuery.value.toLowerCase();
  if (query) {
    filteredCategories.value = categories.value.filter((category) => {
      if (category.toLowerCase().includes(query)) return true;

      return Object.keys(examData[category]).some((chapter) => {
        if (chapter.toLowerCase().includes(query)) return true;

        return examData[category][chapter].some((section) =>
          section.toLowerCase().includes(query)
        );
      });
    });
  } else {
    filteredCategories.value = [...categories.value]; // 若搜尋框為空，顯示所有類別
  }
};

// 新增業務種類
const addCategory = () => {
  const newCategory = prompt("請輸入新的業務種類名稱:");
  if (newCategory && !examData[newCategory]) {
    examData[newCategory] = {};
    localStorage.setItem("examData", JSON.stringify(examData));
    categories.value = Object.keys(examData);
    refreshCategories();
  } else {
    alert("此業務種類已存在或名稱無效！");
  }
};

// 編輯業務種類
const editCategory = (category) => {
  const newCategoryName = prompt("請輸入新的業務種類名稱:", category);
  if (newCategoryName && newCategoryName !== category) {
    examData[newCategoryName] = examData[category];
    delete examData[category];
    localStorage.setItem("examData", JSON.stringify(examData));
    categories.value = Object.keys(examData);
    refreshCategories();
  }
};

// 刪除業務種類
const deleteCategory = (category) => {
  if (confirm(`確定要刪除 ${category} 嗎？`)) {
    delete examData[category];
    localStorage.setItem("examData", JSON.stringify(examData));
    categories.value = Object.keys(examData);
    refreshCategories();
  }
};

// 新增章
const addChapter = (category) => {
  const newChapter = prompt("請輸入新的章名稱:");
  if (newChapter && !examData[category][newChapter]) {
    examData[category][newChapter] = [];
    localStorage.setItem("examData", JSON.stringify(examData));
    refreshCategories();
  } else {
    alert("此章已存在或名稱無效！");
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
    examData[category][chapter] = examData[category][chapter] || [];
    examData[category][chapter].push(newSection);
    localStorage.setItem("examData", JSON.stringify(examData));
    refreshCategories();
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
  if (confirm("確定要刪除此節嗎？")) {
    examData[category][chapter].splice(index, 1);
    localStorage.setItem("examData", JSON.stringify(examData));
    refreshCategories();
  }
};
</script>



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
