<!-- 第一版
<template>
  <div class="container">
    <AdminNavBar />

    <div class="content">
      <h1>開放測驗</h1>

     
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

    
      <div class="form-group">
        <div class="form-container">
          <label for="endDate">測驗結束日期</label>
          <input type="date" id="endDate" v-model="testData.endDate" required />
        </div>
      </div>

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
            v-model="rangeItem.chapter"
            @change="populateSections(index)"
            :disabled="!rangeItem.category"
            class="form-select"
          >
            <option value="">{{ rangeItem.category ? "請選擇章" : "請先選擇業務種類" }}</option>
            <option v-for="chapter in chapters[index]" :key="chapter" :value="chapter">
              {{ chapter }}
            </option>
          </select>

          <label for="section">測驗範圍（節）</label>
          <select
            v-model="selectedSection"
            :disabled="!selectedChapter"
            class="form-select"
          >
            <option value="">{{ selectedChapter ? "請選擇節" : "請先選擇章" }}</option>
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
-->

<!-- <script setup>
import { ref, computed, watch, onMounted } from "vue";
import AdminNavBar from "../../components/AdminNavBar.vue";

const selectedCategory = ref("");
const selectedChapter = ref("");
const selectedSection = ref("");

// const categories = ref([]);
// const chapters = ref([]);
// const sections = ref([]);

const categories = ref([]);
const chapters = ref([[]]); // 每個範圍項目都會對應一個章列表
const sections = ref([[]]); // 每個範圍項目都會對應一個節列表

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
/*
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
*/
// 更新章列表
const populateChapters = (index) => {
  const category = testData.value.rangeItemList[index].category;
  chapters.value[index] = category ? Object.keys(examData[category]) : [];
  testData.value.rangeItemList[index].chapter = "";
  sections.value[index] = [];
  testData.value.rangeItemList[index].section = "";
};

// 更新節列表
const populateSections = (index) => {
  const category = testData.value.rangeItemList[index].category;
  const chapter = testData.value.rangeItemList[index].chapter;
  sections.value[index] = chapter ? examData[category][chapter] : [];
  testData.value.rangeItemList[index].section = "";
};

// 新增範圍項目
const addRangeItem = () => {
  testData.value.rangeItemList.push({
    category: null,
    chapter: null,
    section: null,
    questionAmount: null,
  });
  chapters.value.push([]); // 新增一個章節列表
  sections.value.push([]); // 新增一個節列表
};

// 刪除範圍項目
const removeRangeItem = (index) => {
  testData.value.rangeItemList.splice(index, 1);
  chapters.value.splice(index, 1);
  sections.value.splice(index, 1);
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
  localStorage.setItem('testData', JSON.stringify(testData.value));

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
  populateChapters(0);
});
</script> -->

<!-- 第1.5版
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

// 初始化 categories，確保它是從 examData 取得的
categories.value = examData ? Object.keys(examData) : [];

// 當前資料是從 examData 提取
onMounted(() => {
  if (!examData || Object.keys(examData).length === 0) {
    console.error("examData is not available or is empty.");
  } else {
    populateChapters();
  }
});

// 更新章列表
const populateChapters = () => {
  const category = selectedCategory.value;
  if (!category) {
    console.error("選擇的業務種類無效！");
    return;
  }

  // 確保 examData[category] 存在
  if (!examData[category]) {
    console.error(`找不到類別 ${category} 的資料！`);
    return;
  }

  chapters.value = Object.keys(examData[category]);
  selectedChapter.value = "";
  sections.value = [];
  selectedSection.value = "";
};

// 更新節列表
const populateSections = () => {
  const category = selectedCategory.value;
  const chapter = selectedChapter.value;

  if (!category || !chapter) {
    console.error("無效的業務種類或章節！");
    return;
  }

  sections.value = examData[category] && examData[category][chapter] ? examData[category][chapter] : [];
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
  localStorage.setItem('testData', JSON.stringify(testData.value));

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
</script>
 -->

<!-- 第二版

<template>
  <div class="container">
    <AdminNavBar />

    <div class="content">
      <h1>開放測驗</h1>

     
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

     
      <div class="form-group">
        <div class="form-container">
          <label for="endDate">測驗結束日期</label>
          <input type="date" id="endDate" v-model="testData.endDate" required />
        </div>
      </div>

   
      <div
        class="form-group"
        v-for="(rangeItem, index) in testData.value.rangeItemList"
        :key="index"
      >
        <div class="form-container">
          <label>範圍項目 {{ index + 1 }}</label>

          <label for="category">業務種類</label>
          <select
            v-model="rangeItem.category"
            @change="populateChapters(index)"
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

          <label for="chapter">測驗範圍（章）</label>
          <select
            v-model="rangeItem.chapter"
            @change="populateSections(index)"
            :disabled="!rangeItem.category"
            class="form-select"
          >
            <option value="">
              {{ rangeItem.category ? "請選擇章" : "請先選擇業務種類" }}
            </option>
            <option v-for="chapter in chapters" :key="chapter" :value="chapter">
              {{ chapter }}
            </option>
          </select>

          <label for="section">測驗範圍（節）</label>
          <select
            v-model="rangeItem.section"
            :disabled="!rangeItem.chapter"
            class="form-select"
          >
            <option value="">
              {{ rangeItem.chapter ? "請選擇節" : "請先選擇章" }}
            </option>
            <option v-for="section in sections" :key="section" :value="section">
              {{ section }}
            </option>
          </select>

          <label for="questionAmount">題目數量</label>
          <input
            type="number"
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
  rangeItemList: [], // 初始化範圍項目
});

// 當前資料是從 examData 提取
categories.value = Object.keys(examData);
/*
// 更新章列表
const populateChapters = (index) => {
  const rangeItem = testData.value.rangeItemList[index];
  if (rangeItem && rangeItem.category) {
    chapters.value = Object.keys(examData[rangeItem.category]);
    rangeItem.chapter = "";
    sections.value = [];
    rangeItem.section = "";
  }
};

// 更新節列表
const populateSections = (index) => {
  const rangeItem = testData.value.rangeItemList[index];
  if (rangeItem && rangeItem.category && rangeItem.chapter) {
    sections.value = examData[rangeItem.category][rangeItem.chapter] || [];
    rangeItem.section = "";
  }
};*/
/*
// 更新章列表
const populateChapters = (index) => {
  const rangeItem = testData.value.rangeItemList[index];
  if (rangeItem && rangeItem.category) {
    chapters.value = Object.keys(examData[rangeItem.category]);
    rangeItem.chapter = ""; // 重置章節選項
    sections.value = [];
    rangeItem.section = ""; // 重置節選項
  }
};

// 更新節列表
const populateSections = (index) => {
  const rangeItem = testData.value.rangeItemList[index];
  if (rangeItem && rangeItem.category && rangeItem.chapter) {
    sections.value = examData[rangeItem.category][rangeItem.chapter] || [];
    rangeItem.section = ""; // 重置節選項
  }
};*/

// 更新章列表
const populateChapters = (index) => {
  const rangeItem = testData.value.rangeItemList[index];
  if (rangeItem && rangeItem.category) {
    chapters.value = Object.keys(examData[rangeItem.category]);
    rangeItem.chapter = ""; // 重置章節選項
    sections.value = [];
    rangeItem.section = ""; // 重置節選項
  }
};

// 更新節列表
const populateSections = (index) => {
  const rangeItem = testData.value.rangeItemList[index];
  if (rangeItem && rangeItem.category && rangeItem.chapter) {
    sections.value = examData[rangeItem.category][rangeItem.chapter] || [];
    rangeItem.section = ""; // 重置節選項
  }
};

// 新增範圍項目
const addRangeItem = () => {
  testData.value.rangeItemList.push({
    category: "", // 這裡初始化為空
    chapter: "", // 這裡初始化為空
    section: "", // 這裡初始化為空
    questionAmount: null, // 題目數量
  });
};

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
};

onMounted(() => {
  populateChapters(0);
  if (!testData.value.rangeItemList) {
    testData.value.rangeItemList = []; // 確保範圍項目列表初始化為空陣列
  }
});
</script>
-->

<!-- 第三版 -->

<template>
  <div class="container">
    <AdminNavBar />

    <div class="content">
      <div class="left-content">
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
            <input
              type="date"
              id="endDate"
              v-model="testData.endDate"
              required
            />
          </div>
        </div>

        <!-- 顯示總題目數量 -->
        <div class="form-group">
          <div class="form-container">
            <label class="form-label">總題目數量</label>
            <div class="total-question-amount">{{ totalQuestionAmount }}</div>
          </div>
        </div>

        <button class="submit-btn" @click="submitTest">新增測驗</button>
      </div>

      <!-- 範圍項目 -->
      <div class="right-content">
        <h2>範圍項目</h2>
        <!-- <button @click="addRangeItem">新增範圍項目</button> -->
        <!-- <div
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
            
              <option value="">
                {{ selectedCategory ? "請選擇章" : "請先選擇業務種類" }}
              </option>
              <option
                v-for="chapter in chapters"
                :key="chapter"
                :value="chapter"
              >
                {{ chapter }}
              </option>
            </select>

            <label for="section">測驗範圍（節）</label>
            <select
              v-model="selectedSection"
              :disabled="!selectedChapter"
              class="form-select"
            >
          
              <option value="">
                {{ selectedChapter ? "請選擇節" : "請先選擇章" }}
              </option>
              <option
                v-for="section in sections"
                :key="section"
                :value="section"
              >
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
        </div> -->
        <!-- <div
          class="form-group"
          v-for="(rangeItem, index) in testData.rangeItemList" 
          :key="index"
        >
          <div class="form-container">
            <label for="category">業務種類</label>
            <select
              v-model="rangeItem.category"
              @change="populateChapters(index)"
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

            <label for="chapter">測驗範圍（章）</label>
            <select
              v-model="rangeItem.chapter"
              @change="populateSections(index)"
              :disabled="!rangeItem.category"
              class="form-select"
            >
              <option value="">
                {{ rangeItem.category ? "請選擇章" : "請先選擇業務種類" }}
              </option>
              <option
                v-for="chapter in chapters"
                :key="chapter"
                :value="chapter"
              >
                {{ chapter }}
              </option>
            </select>

            <label for="section">測驗範圍（節）</label>
            <select
              v-model="rangeItem.section"
              :disabled="!rangeItem.chapter"
              class="form-select"
            >
              <option value="">
                {{ rangeItem.chapter ? "請選擇節" : "請先選擇章" }}
              </option>
              <option
                v-for="section in sections"
                :key="section"
                :value="section"
              >
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
            <button @click="saveRangeItem(index)">儲存</button>
          </div>
        </div> -->
        <div class="form-group">
          <div class="form-container">
            <div class="form-content">
              <label for="category">業務種類</label>
              <select
                v-model="selectedCategory"
                @change="populateChapters()"
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

            <div class="form-content">
              <label for="chapter">測驗範圍（章）</label>
              <select
                v-model="selectedChapter"
                @change="populateSections()"
                :disabled="!selectedCategory"
                class="form-select"
              >
                <option value="">
                  {{ selectedCategory ? "請選擇章" : "請先選擇業務種類" }}
                </option>
                <option
                  v-for="chapter in chapters"
                  :key="chapter"
                  :value="chapter"
                >
                  {{ chapter }}
                </option>
              </select>
            </div>

            <div class="form-content">
              <label for="section">測驗範圍（節）</label>
              <select
                v-model="selectedSection"
                :disabled="!selectedChapter"
                class="form-select"
              >
                <option value="">
                  {{ selectedChapter ? "請選擇節" : "請先選擇章" }}
                </option>
                <option
                  v-for="section in sections"
                  :key="section"
                  :value="section"
                >
                  {{ section }}
                </option>
              </select>
            </div>

            <div class="form-content">
              <label for="questionAmount">題目數量</label>
              <input
                type="number"
                id="questionAmount"
                v-model="questionAmount"
                placeholder="題目數量"
                min="1"
                class="input-number"
                required
              />
            </div>

            <button @click="saveRangeItem" class="btn-save">儲存</button>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>業務種類</th>
              <th>測驗範圍（章）</th>
              <th>測驗範圍（節）</th>
              <th>題目數量</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(rangeItem, index) in testData.rangeItemList"
              :key="index"
            >
              <td>{{ rangeItem.category }}</td>
              <td>{{ rangeItem.chapter }}</td>
              <td>{{ rangeItem.section }}</td>
              <td>{{ rangeItem.questionAmount }}</td>
              <td>
                <button @click="removeRangeItem(index)" class="btn-remove">
                  刪除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, toRaw } from "vue";
import AdminNavBar from "../../components/AdminNavBar.vue";

// 用 reactive 來管理 testData
const testData = reactive({
  title: "", // 測驗名稱
  limitTime: null, // 測驗作答時間
  targetScore: null, // 及格分數
  startDate: "", // 測驗開始日期
  endDate: "", // 測驗結束日期
  // 儲存範圍項目
  rangeItemList: [],
  // rangeItemList: [
  //   {
  //     category: "",
  //     chapter: "",
  //     section: "",
  //     questionAmount: null,
  //   },
  // ],
});

// 管理業務種類、章、節
const selectedCategory = ref("");
const selectedChapter = ref("");
const selectedSection = ref("");
const questionAmount = ref(null);

const categories = ref([]);
const chapters = ref([]);
const sections = ref([]);

// 假設 examData 來自 localStorage
const examData = JSON.parse(localStorage.getItem("examData")) || {};

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
  testData.rangeItemList.push({
    category: null,
    chapter: null,
    section: null,
    questionAmount: null,
  });
};
/*
// 儲存範圍項目
const saveRangeItem = (index) => {
  const rangeItem = testData.rangeItemList[index];
  if (
    !rangeItem.category ||
    !rangeItem.chapter ||
    !rangeItem.section ||
    !rangeItem.questionAmount ||
    rangeItem.questionAmount <= 0
  ) {
    alert("請填寫完整的範圍項目！");
    return;
  }
  alert("範圍項目儲存成功！");
};*/
// 儲存範圍項目
const saveRangeItem = () => {
  if (
    !selectedCategory.value ||
    !selectedChapter.value ||
    !selectedSection.value ||
    !questionAmount.value ||
    questionAmount.value <= 0
  ) {
    alert("請填寫完整的範圍項目！");
    return;
  }

  testData.rangeItemList.push({
    category: selectedCategory.value,
    chapter: selectedChapter.value,
    section: selectedSection.value,
    questionAmount: questionAmount.value,
  });

  // 重置選擇
  selectedCategory.value = "";
  selectedChapter.value = "";
  selectedSection.value = "";
  questionAmount.value = null;
};

// 刪除範圍項目
const removeRangeItem = (index) => {
  testData.rangeItemList.splice(index, 1);
};

// 提交測驗資料
const submitTest = () => {
  // 基本驗證：檢查必填欄位是否都填寫
  if (
    !testData.title ||
    !testData.limitTime ||
    !testData.targetScore ||
    !testData.startDate ||
    !testData.endDate ||
    testData.rangeItemList.length === 0
  ) {
    alert("請填寫所有欄位！");
    return;
  }

  /*
  // 檢查範圍項目的資料是否完整
  for (let rangeItem of testData.rangeItemList) {
    if (
      !rangeItem.category ||
      !rangeItem.chapter ||
      !rangeItem.section ||
      !rangeItem.questionAmount ||
      rangeItem.questionAmount <= 0
    ) {
      alert("請填寫所有範圍項目欄位！");
      return;
    }
  }
  */

  // 開始日期是否早於結束日期等
  if (new Date(testData.startDate) > new Date(testData.endDate)) {
    alert("開始日期不能晚於結束日期！");
    return;
  }

  // 假設這裡提交資料
  console.log("新增測驗資料：", toRaw(testData));

  // 提交後，可以將資料儲存至 localStorage 或傳送給後端等
  localStorage.setItem("testData", JSON.stringify(testData));

  alert("測驗新增成功！");

  // 清空表單及選擇欄位
  testData.title = "";
  testData.limitTime = null;
  testData.targetScore = null;
  testData.startDate = "";
  testData.endDate = "";
  testData.rangeItemList = [];
  selectedCategory.value = "";
  selectedChapter.value = "";
  selectedSection.value = "";
};

onMounted(() => {
  categories.value = Object.keys(examData);
});

// 計算 questionAmount 的總和
const totalQuestionAmount = computed(() => {
  return testData.rangeItemList.reduce(
    (total, item) => total + (item.questionAmount || 0),
    0
  );
});
</script>

<!-- No. 1 
<style scoped>
.container {
  padding: 20px;
}

.content {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fae8e8;
}

/* 表單區塊樣式 */
.form-group {
  margin-bottom: 20px;
}

.form-container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-container label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form-select,
.input-number {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.input-number {
  -moz-appearance: textfield; /* 去除箭頭 */
}

.input-number::-webkit-outer-spin-button,
.input-number::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.btn-save {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-save:hover {
  background-color: #45a049;
}

.btn-save:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 表格樣式 */
.table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  background-color: #fff;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table tr:hover {
  background-color: #f1f1f1;
}

.table .btn-remove {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table .btn-remove:hover {
  background-color: #e53935;
}

.table .btn-remove:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.form-container input {
  width: 100%;
}

/* 輸入框與下拉選單距離調整 */
.form-container select,
.form-container .input-number {
  margin-bottom: 10px;
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
-->

<!-- No. 2 
<style scoped>
/* 全局設置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Arial", sans-serif;
  background-color: #f4f6f9;
  color: #333;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
}

.content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

/* 標題 */
h1 {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 10px;
}

/* 左側內容區 */
.left-content {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  color: #7f8c8d;
}

input,
select {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  background-color: #ecf0f1;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input::placeholder {
  color: #95a5a6;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3498db;
  background-color: #fff;
}

/* 右側內容區 */
.right-content {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 表格樣式 */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.table th {
  background-color: #f8f9fa;
  color: #34495e;
}

.table td {
  background-color: white;
}

.table button {
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table button:hover {
  background-color: #c0392b;
}

/* 按鈕樣式 */
.submit-btn {
  padding: 10px 20px;
  background-color: #2ecc71;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.submit-btn:hover {
  background-color: #27ae60;
}

.btn-save,
.btn-remove {
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save:hover {
  background-color: #2980b9;
}

.btn-remove:hover {
  background-color: #e74c3c;
}

.input-number {
  width: 100px;
}

/* 使表單響應式 */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }

  .left-content,
  .right-content {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
-->

<!-- No. 3
<style scoped>
/* 全局設置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Arial", sans-serif;
  background-color: #f4f6f9;
  color: #333;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
}

.content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

/* 標題 */
h1 {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

h2 {
  font-size: 20px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 10px;
  text-align: center;
}

/* 左側內容區 */
.left-content {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.left-content h2 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  color: #7f8c8d;
}

input,
select {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  background-color: #ecf0f1;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input::placeholder {
  color: #95a5a6;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3498db;
  background-color: #fff;
}

/* 右側內容區 */
.right-content {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-content h2 {
  margin-top: 0;
}

/* 表格樣式 */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.table th {
  background-color: #f8f9fa;
  color: #34495e;
}

.table td {
  background-color: white;
}

.table button {
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table button:hover {
  background-color: #c0392b;
}

/* 按鈕樣式 */
.submit-btn {
  padding: 10px 20px;
  background-color: #2ecc71;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.submit-btn:hover {
  background-color: #27ae60;
}

.btn-save,
.btn-remove {
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save:hover {
  background-color: #2980b9;
}

.btn-remove:hover {
  background-color: #e74c3c;
}

.input-number {
  width: 100px;
}

/* 使表單響應式 */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }

  .left-content,
  .right-content {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
 -->

<!-- No. 4 -->
<style scoped>
/* 全局設置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Arial", sans-serif;
  background-color: #f4f6f9;
  color: #333;
}

.container {
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  width: 80%;
  margin: 0 auto; /* 水平置中 */
}

.content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

/* 標題 */
h1 {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 10px;
  text-align: center;
}

/* 左側內容區 */
.left-content {
  flex: 1;
  background-color: #f3f3f3;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.left-content h2 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  font-size: 16px;
  color: black;
}

input,
select {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input::placeholder {
  color: #95a5a6;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3498db;
  background-color: #fff;
}

/* 右側內容區 */
.right-content {
  flex: 1;
  background-color: #f3f3f3;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-content h2 {
  margin-top: 0;
}

/* 表格樣式 */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ecf0f1;
  border: 1px solid #ddd;
}

.table th {
  background-color: #d3adeb;
  color: black;
}

.table tr:nth-child(odd) {
  background-color: #ebc3db;
  color: #34495e;
}

.table tr:nth-child(even) {
  background-color: #EDE3E9;
  color: #34495e;
}

.table button {
  padding: 6px 12px;
  background-color: #da2c19;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table button:hover {
  background-color: #c0392b;
}

/* 按鈕樣式 */
.submit-btn-container {
  margin-top: 20px;
  text-align: center;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #2ecc71;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #27ae60;
}

.btn-save,
.btn-remove {
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save:hover {
  background-color: #2980b9;
}

.btn-remove:hover {
  background-color: #e74c3c;
}

/* 使表單響應式 */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }

  .left-content,
  .right-content {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
