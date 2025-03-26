<template>
  <div class="container">
    <AdminNavBar />

    <div class="content">
      <h1>請選擇題庫範圍</h1>

      <div class="form-group">
        <div class="form-container">
          <label for="exam-category" class="form-label">業務種類</label>
          <button type="button" @click="addCategory" class="form-button">
            新增業務種類
          </button>
        </div>
        <select
          v-model="selectedCategory"
          @change="populateChapters"
          class="form-select"
        >
          <option value="">請選擇業務種類</option>
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
        <div class="form-container">
          <label for="exam-chapter" class="form-label">測驗範圍（章）</label>
          <button type="button" @click="addChapter" class="form-button">
            新增章
          </button>
        </div>
        <select
          v-model="selectedChapter"
          @change="populateSections"
          :disabled="!selectedCategory"
          class="form-select"
        >
          <option value="">
            {{ selectedCategory ? "請選擇章" : "請先選擇業務種類" }}
          </option>
          <option v-for="chapter in chapters" :key="chapter" :value="chapter">
            {{ chapter }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <div class="form-container">
          <label for="exam-section" class="form-label">測驗範圍（節）</label>
          <button type="button" @click="addSection" class="form-button">
            新增節
          </button>
        </div>
        <select
          v-model="selectedSection"
          :disabled="!selectedChapter"
          class="form-select"
        >
          <option value="">
            {{ selectedChapter ? "請選擇節" : "請先選擇章" }}
          </option>
          <option v-for="section in sections" :key="section" :value="section">
            {{ section }}
          </option>
        </select>
      </div>

      <!-- <div class="form-group">
        <div class="form-container">
          <label for="exam-questions" class="form-label">題目數量</label>
        </div>
        <input
          type="number"
          v-model="questions"
          placeholder="請輸入題數"
          class="form-input"
          min="1"
        />
      </div> -->

      <!-- 出題者(只做template) 
      <div class="form-group">
        <div class="form-container">
          <label for="exam-creator" class="form-label">出題者</label>
        </div>
        <input
          type="text"
          v-model="creator"
          placeholder="請輸入出題者姓名"
          class="form-input"
        />
      </div>
      -->

      <button class="button" @click="proceedToQuestions">開始出題</button>
    </div>
  </div>
</template>

<!-- vue 2
  <script>
  import AdminNavBar from "../../components/AdminNavBar.vue";
  export default {
    name: "CreateQuestion",
    components: {
      AdminNavBar,
    },
    data() {
      return {
        selectedCategory: "",
        selectedChapter: "",
        selectedSection: "",
        questions: "",
        categories: this.examData ? Object.keys(this.examData) : [], 
        chapters: [],
        sections: [],
        examData: JSON.parse(localStorage.getItem("examData")) || {
          存款篇: {
            第一章通則: [
              "01-01 存款經辦員應有之認識",
              "01-02 存款種類",
              "01-03 開戶",
              "01-04 印鑑",
            ],
            第二章支票存款: ["02-01 性質", "02-02 開戶手續", "02-16 票據嘗識"],
            附錄: [
              "一、聯邦商業銀行新台幣存放款利率牌告要點",
              "二、儲蓄免扣證實施辦法",
            ],
          },
          // ... 其他資料
        },
      };
    },
    methods: {
      populateChapters() {
        const category = this.selectedCategory;
        this.chapters = category ? Object.keys(this.examData[category]) : [];
        this.selectedChapter = "";
        this.sections = [];
        this.selectedSection = "";
      },
      populateSections() {
        const category = this.selectedCategory;
        const chapter = this.selectedChapter;
        this.sections = chapter ? this.examData[category][chapter] : [];
        this.selectedSection = "";
      },
      addCategory() {
        const newCategory = prompt("請輸入新的業務種類名稱:");
        if (newCategory && !this.examData[newCategory]) {
          this.examData[newCategory] = {};
          localStorage.setItem("examData", JSON.stringify(this.examData));
          this.categories = Object.keys(this.examData);
        } else {
          alert("此業務種類已存在！");
        }
      },
      addChapter() {
        if (!this.selectedCategory) {
          alert("請先選擇業務種類！");
          return;
        }
        const newChapter = prompt("請輸入新的章節名稱:");
        if (newChapter && !this.examData[this.selectedCategory][newChapter]) {
          this.examData[this.selectedCategory][newChapter] = [];
          localStorage.setItem("examData", JSON.stringify(this.examData));
          this.populateChapters();
        } else {
          alert("此章節已存在！");
        }
      },
      addSection() {
        if (!this.selectedCategory || !this.selectedChapter) {
          alert("請先選擇業務種類與章節！");
          return;
        }
        const newSection = prompt("請輸入新的節名稱:");
        if (
          newSection &&
          !this.examData[this.selectedCategory][this.selectedChapter].includes(
            newSection
          )
        ) {
          this.examData[this.selectedCategory][this.selectedChapter].push(
            newSection
          );
          localStorage.setItem("examData", JSON.stringify(this.examData));
          this.populateSections();
        } else {
          alert("此節已存在！");
        }
      },
      proceedToQuestions() {
        if (
          !this.selectedCategory ||
          !this.selectedChapter ||
          !this.selectedSection ||
          !this.questions
        ) {
          alert("請填寫所有考試資訊！");
          return;
        }
  
        const examInfo = {
          category: this.selectedCategory,
          chapter: this.selectedChapter,
          section: this.selectedSection,
          questions: this.questions,
        };
        localStorage.setItem("examInfo", JSON.stringify(examInfo));
        this.$router.push("/questions");
      },
      logout() {
        localStorage.removeItem("loggedInUser");
        sessionStorage.clear();
        this.$router.push("/login");
      },
    },
    mounted() {
      this.populateChapters();
    },
  };
  </script>
  -->

<!-- vue 3 -->
<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar.vue";

// 初始化 router
const router = useRouter(); // 使用 useRouter 來取得 router

const selectedCategory = ref("");
const selectedChapter = ref("");
const selectedSection = ref("");
// const questions = ref("");
const categories = ref([]);
const chapters = ref([]);
const sections = ref([]);

const examData = JSON.parse(localStorage.getItem("examData")) || {
  存款篇: {
    第一章通則: [
      "01-01 存款經辦員應有之認識",
      "01-02 存款種類",
      "01-03 開戶",
      "01-04 印鑑",
    ],
    第二章支票存款: ["02-01 性質", "02-02 開戶手續", "02-16 票據嘗識"],
    附錄: [
      "一、聯邦商業銀行新台幣存放款利率牌告要點",
      "二、儲蓄免扣證實施辦法",
    ],
  },
  信託篇: {
    "第一篇 簽證業務篇": ["第一章 法令依據", "一節 應徵取之文件"],
    "第二篇 保管業務篇": [
      "第一章 有價證劵保管業務",
      "第二章 營業保證金保管業務",
    ],
  },
  外匯篇: {
    外匯業務手冊: [
      "第一章：國外通匯及電訊業務 ",
      "第二章：新台幣與外幣間遠期外匯業務",
    ],
  },
  電子銀行業務: {
    電子銀行: ["電子銀行服務作業要點"],
    數位存款: ["數位存款帳戶服務作業要點"],
  },
  顧客問題應對手冊: {
    存款業務: ["開戶問題", "存款實務"],
    外匯業務: ["外幣存匯業務", "進出口外匯業務"],
  },
  其他類型: {
    重要活動及公文: ["數位存款114年最新活動"],
  },
};

// 強制設定初始題庫類別
/*const examData = {
  存款篇: {
    第一章通則: [
      "01-01 存款經辦員應有之認識",
      "01-02 存款種類",
      "01-03 開戶",
      "01-04 印鑑",
    ],
    第二章支票存款: ["02-01 性質", "02-02 開戶手續", "02-16 票據嘗識"],
    附錄: [
      "一、聯邦商業銀行新台幣存放款利率牌告要點",
      "二、儲蓄免扣證實施辦法",
    ],
  },
  信託篇: {
    "第一篇 簽證業務篇": ["第一章 法令依據", "一節 應徵取之文件"],
    "第二篇 保管業務篇": [
      "第一章 有價證劵保管業務",
      "第二章 營業保證金保管業務",
    ],
  },
  外匯篇: {
    外匯業務手冊: [
      "第一章：國外通匯及電訊業務 ",
      "第二章：新台幣與外幣間遠期外匯業務",
    ],
  },
  電子銀行業務: {
    電子銀行: ["電子銀行服務作業要點"],
    數位存款: ["數位存款帳戶服務作業要點"],
  },
  顧客問題應對手冊: {
    存款業務: ["開戶問題", "存款實務"],
    外匯業務: ["外幣存匯業務", "進出口外匯業務"],
  },
  其他類型: {
    重要活動及公文: ["數位存款114年最新活動"],
  },
};*/
// localStorage.setItem("examData",JSON.stringify(examData));

// 當前資料是從 examData 提取
categories.value = Object.keys(examData);

// 更新章列表
const populateChapters = () => {
  const category = selectedCategory.value;
  chapters.value = category ? Object.keys(examData[category]) : [];
  selectedChapter.value = "";
  sections.value = [];
  selectedSection.value = "";
};

// 更新節列表
const populateSections = () => {
  const category = selectedCategory.value;
  const chapter = selectedChapter.value;
  sections.value = chapter ? examData[category][chapter] : [];
  selectedSection.value = "";
};

// 新增業務種類
const addCategory = () => {
  const newCategory = prompt("請輸入新的業務種類名稱:");
  if (newCategory === null) {
    return;
  }
  if (newCategory && !examData[newCategory]) {
    examData[newCategory] = {};
    localStorage.setItem("examData", JSON.stringify(examData));
    categories.value = Object.keys(examData);
  } else {
    alert("此業務種類已存在！");
  }
};

// 新增章節
const addChapter = () => {
  if (!selectedCategory.value) {
    alert("請先選擇業務種類！");
    return;
  }
  const newChapter = prompt("請輸入新的章名稱:");
  if (newChapter === null) {
    return;
  }

  if (newChapter && !examData[selectedCategory.value][newChapter]) {
    examData[selectedCategory.value][newChapter] = [];
    localStorage.setItem("examData", JSON.stringify(examData));
    populateChapters();
  } else {
    alert("此章已存在！");
  }
};

// 新增節
const addSection = () => {
  if (!selectedCategory.value || !selectedChapter.value) {
    alert("請先選擇業務種類與章！");
    return;
  }
  const newSection = prompt("請輸入新的節名稱:");
  if (newSection === null) {
    return;
  }
  if (
    newSection &&
    !examData[selectedCategory.value][selectedChapter.value].includes(
      newSection
    )
  ) {
    examData[selectedCategory.value][selectedChapter.value].push(newSection);
    localStorage.setItem("examData", JSON.stringify(examData));
    populateSections();
  } else {
    alert("此節已存在！");
  }
};

// 進入出題頁面
const proceedToQuestions = () => {
  if (
    !selectedCategory.value ||
    !selectedChapter.value ||
    !selectedSection.value ) {
    alert("請填寫所有選項！");
    return;
  }

  const examInfo = {
    category: selectedCategory.value,
    chapter: selectedChapter.value,
    section: selectedSection.value,
  };
  localStorage.setItem("examInfo", JSON.stringify(examInfo));
  // 跳轉到考題頁面
  router.push("/create_question_data");
};

onMounted(() => {
  localStorage.setItem("examInfo", JSON.stringify({}));
  populateChapters();
});
</script>

<!-- 第一版
  <style scoped>
  /* 原本的 CSS 保留 */
  body {
    font-family: Arial, sans-serif;
    padding: 0;
  }
  nav ul {
    list-style: none;
    padding: 0;
    display: flex;
    background-color: #333;
    justify-content: center;
  }
  nav ul li {
    margin: 0 20px;
  }
  nav ul li a {
    text-decoration: none;
    color: white;
    padding: 10px 15px;
    display: block;
  }
  nav ul li a:hover {
    background-color: #575757;
  }
  .container {
    margin: 20px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  label {
    display: block;
    margin-bottom: 5px;
  }
  select,
  input {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }
  .button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
  }
  .button:hover {
    background-color: #45a049;
  }
  .logout-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 8px 15px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .logout-btn:hover {
    background-color: #d32f2f;
  }
  </style>
  -->

<!-- CSS 第二版 
  <style scoped>
  /* Container for the whole page */
  .container {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    font-family: Arial, sans-serif;
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    width: 80%;
    margin: 0 auto; /* 水平置中 */
  }
  
  /* Style for the content area */
  .content {
    width: 100%;
    max-width: 800px;
    background-color: rgb(244, 244, 244);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* Heading style */
  h1 {
    text-align: center;
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }
  
  /* Form group container */
  .form-group {
    margin-bottom: 20px;
  }
  
  /* Label styling */
  label {
    display: block;
    font-size: 1rem;
    margin-bottom: 8px;
    color: #555;
  }
  
  /* Select input styling */
  select {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
  }
  
  /* Button for adding new category/chapter/section */
  button[type="button"] {
    margin-top: 10px;
    padding: 8px 16px;
    font-size: 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button[type="button"]:hover {
    background-color: #45a049;
  }
  
  /* Input field styling for numbers */
  input[type="number"] {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
  }
  
  /* Button for confirming and proceeding */
  .button {
    width: 100%;
    padding: 12px;
    font-size: 1.2rem;
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
  </style>
  -->

<!-- CSS 第三版 -->
<style scoped>
/* 容器 */
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

/* 設定內容區 */
.content {
  width: 50%;
  max-width: 800px;
  background-color: rgb(244, 244, 244);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 標題樣式 */
h1 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

/* 表單組樣式 */
.form-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center; /* 將內容垂直對齊 */
  margin-bottom: 20px;
}

.form-container {
  margin: 0 15px;
  width: 100%;
  display: flex;
  justify-content: space-between; /* 使內容分散對齊 */
  align-items: center; /* 使內容垂直居中對齊 */
}

/* 標籤樣式 */
.form-label {
  font-size: 20px;
  color: #555;
}

/* 按鈕樣式 */
.form-button {
  margin-left: 10px;
  padding: 8px 16px;
  font-size: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* 按鈕 hover 狀態 */
.form-button:hover {
  background-color: #347b38;
}

/* 下拉選單樣式 */
.form-select {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  margin: 15px;
}

/* 輸入框樣式 */
.form-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  margin: 15px;
}

/* 確認並進行出題的按鈕樣式 */
.button {
  width: 30%;
  padding: 12px;
  font-size: 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* 按鈕 hover 狀態 */
.button:hover {
  background-color: #0056b3;
}
</style>
