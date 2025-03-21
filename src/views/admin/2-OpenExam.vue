<template>
  <div class="container">
    <AdminNavBar />

    <div class="content">
      <h1>開放測驗</h1>

      <!-- 測驗名稱 -->
      <div class="form-group">
        <div class="form-container">
          <label for="title">測驗名稱</label>
          <input
            type="text"
            id="title"
            v-model="testData.title"
            placeholder="輸入測驗名稱"
            required
          />
        </div>
      </div>

      <!-- 測驗作答時間 -->
      <div class="form-group">
        <div class="form-container">
          <label for="limitTime">測驗作答時間 (分鐘)</label>
          <input
            type="number"
            id="limitTime"
            v-model="testData.limitTime"
            min="1"
            placeholder="輸入測驗作答時間"
            required
          />
        </div>
      </div>

      <!-- 及格分數 -->
      <div class="form-group">
        <div class="form-container">
          <label for="targetScore">及格分數</label>
          <input
            type="number"
            id="targetScore"
            v-model="testData.targetScore"
            min="1"
            placeholder="輸入及格分數"
            required
          />
        </div>
      </div>

      <!-- 測驗開始日期 -->
      <div class="form-group">
        <div class="form-container">
          <label for="startDate">測驗開始日期</label>
          <input
            type="date"
            id="startDate"
            v-model="testData.startDate"
            required
          />
        </div>
      </div>

      <!-- 測驗結束日期 -->
      <div class="form-group">
        <div class="form-container">
          <label for="endDate">測驗結束日期</label>
          <input type="date" id="endDate" v-model="testData.endDate" required />
        </div>
      </div>

      <!-- 範圍項目 -->
      <div
        class="form-group"
        v-for="(rangeItem, index) in testData.rangeItemList"
        :key="index"
      >
        <div class="form-container">
          <label>範圍項目 {{ index + 1 }}</label>

          <label for="category">業務種類</label>
          <select
            v-model="selectedCategory"
            @change="populateChapters"
            class="form-select"
          >
            <!-- <select
            v-model="rangeItem.category"
            @change="populateChapters(index)"
            class="form-select"
          > -->
            <option value="">請選擇業務種類</option>
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>

          <label for="chapter">測驗範圍（章）</label>
          <select
            v-model="selectedChapter"
            @change="populateSections"
            :disabled="!selectedCategory"
            class="form-select"
          >
            <!-- <select
            v-model="rangeItem.chapter"
            @change="populateSections(index)"
            class="form-select"
          > -->
            <option value="">
              {{ selectedCategory ? "請選擇章" : "請先選擇業務種類" }}
            </option>
            <option v-for="chapter in chapters" :key="chapter" :value="chapter">
              {{ chapter }}
            </option>
          </select>

          <label for="section">測驗範圍（節）</label>
          <select
            v-model="selectedSection"
            :disabled="!selectedChapter"
            class="form-select"
          >
            <!-- <select v-model="rangeItem.section" class="form-select"> -->
            <option value="">
              {{ selectedChapter ? "請選擇節" : "請先選擇章" }}
            </option>
            <option v-for="section in sections" :key="section" :value="section">
              {{ section }}
            </option>
          </select>

          <label for="questionAmount">題目數量</label>
          <input
            type="number"
            id="questionAmount"
            v-model="rangeItem.questionAmount"
            placeholder="題目數量"
            min="1"
            required
          />
          <button @click="removeRangeItem(index)">刪除範圍</button>
        </div>
      </div>

      <button @click="addRangeItem">新增範圍項目</button>

      <button class="submit-btn" @click="submitTest">新增測驗</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import AdminNavBar from "../../components/AdminNavBar.vue";

const selectedCategory = ref("");
const selectedChapter = ref("");
const selectedSection = ref("");

const categories = ref([]);
const chapters = ref([]);
const sections = ref([]);

const examData = JSON.parse(localStorage.getItem("examData")) || {};

// 儲存測驗資料
const testData = ref({
  title: "", // 測驗名稱
  limitTime: null, // 測驗作答時間
  targetScore: null, // 及格分數
  startDate: "", // 測驗開始日期
  endDate: "", // 測驗結束日期
  rangeItemList: [], // 儲存範圍項目
});

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

// 新增範圍項目
const addRangeItem = () => {
  testData.value.rangeItemList.push({
    category: null,
    chapter: null,
    section: null,
    questionAmount: null,
  });
};

// 監聽 value1 的變化，並同步更新 value2
watch(selectedCategory, (newVal) => {
  for (let rangeItem of testData.value.rangeItemList) {
    rangeItem.category = newVal;
  }
});

watch(selectedChapter, (newVal) => {
  for (let rangeItem of testData.value.rangeItemList) {
    rangeItem.chapter = newVal;
  }
});

watch(selectedSection, (newVal) => {
  for (let rangeItem of testData.value.rangeItemList) {
    rangeItem.section = newVal;
  }
});

// 刪除範圍項目
const removeRangeItem = (index) => {
  testData.value.rangeItemList.splice(index, 1);
};

// 提交測驗資料
const submitTest = () => {
  // 基本驗證：檢查必填欄位是否都填寫
  if (
    !testData.value.title ||
    !testData.value.limitTime ||
    !testData.value.targetScore ||
    !testData.value.startDate ||
    !testData.value.endDate ||
    testData.value.rangeItemList.length === 0
  ) {
    alert("請填寫所有欄位！");
    return;
  }

  // 檢查範圍項目的資料是否完整
  for (let rangeItem of testData.value.rangeItemList) {
    if (
      !rangeItem.category ||
      !rangeItem.chapter ||
      !rangeItem.section ||
      !rangeItem.questionAmount ||
      rangeItem.questionAmount <= 0
    ) {
      console.log(rangeItem.category);
      alert("請填寫所有範圍項目欄位！");
      return;
    }
  }

  // 開始日期是否早於結束日期等
  if (new Date(testData.value.startDate) > new Date(testData.value.endDate)) {
    alert("開始日期不能晚於結束日期！");
    return;
  }

  // 假設這裡提交資料
  console.log("新增測驗資料：", testData.value);

  // 提交後，可以將資料儲存至 localStorage 或傳送給後端等
  localStorage.setItem("testData", JSON.stringify(testData.value));

  alert("測驗新增成功！");

  // 清空表單及選擇欄位
  testData.value = {
    title: "",
    limitTime: null,
    targetScore: null,
    startDate: "",
    endDate: "",
    rangeItemList: [],
  };
  selectedCategory.value = "";
  selectedChapter.value = "";
  selectedSection.value = "";
};

onMounted(() => {
  populateChapters();
});
</script>

<style scoped>
.container {
  padding: 20px;
}

.content {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fae8e8;
}

.form-group {
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>
