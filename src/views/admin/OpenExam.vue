<!-- 不用API -->
<template>
  <div class="container">
    <AdminNavBar />

    <div class="content">
      <div class="left-content">
        <h1>新增測驗</h1>

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
            <label for="limitTime">答題時間 (分鐘)</label>
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
            <input
              type="date"
              id="endDate"
              v-model="testData.endDate"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <div class="form-container">
            <label class="form-label">總題目數量</label>
            <div class="total-question-amount">{{ totalQuestionAmount }}</div>
          </div>
        </div>

        <button class="submit-btn" @click="submitTest">新增測驗</button>
      </div>

      <div class="right-content">
        <h2>本次測驗的出題範圍</h2>

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

            <div v-if="selectedPart"> 
              <p>選擇的節ID：{{ getSelectedPartId }}</p>
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
import axios from "axios";
import { useIdleLogout } from "../../composables/useIdleLogout";

useIdleLogout();

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

// 找出節ID
const getSelectedPartId = computed(() => {
  const selectedPartData = parts.value.find(
    (part) => part.partId === selectedPart.value
  );
  return selectedPartData ? selectedPartData.partId : "尚未選擇節";
});


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

-->
<!-- API 
<template>
  <div class="container">
    <ErrorModal
      v-model="showError"
      :message="errorMsg"
      @confirm="handleRedirect"
    />
    <AdminNavBar />

    <div class="content">
      <div class="left-content">
        <h1>新增測驗</h1>

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
            <input
              type="date"
              id="endDate"
              v-model="testData.endDate"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <div class="form-container">
            <label class="form-label"
              >總題目數量：{{ totalQuestionAmount }}</label
            >
          </div>
        </div>

        <button class="submit-btn" @click="submitTest">新增測驗</button>
      </div>

      <div class="right-content">
        <h2>本次測驗的出題範圍</h2>

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
                  :key="category.categoryId"
                  :value="category.categoryId"
                >
                  {{ category.category }}
                </option>
              </select>
            </div>

            <div class="form-content">
              <label for="chapter">測驗範圍（章）</label>
              <select
                v-model="selectedChapter"
                @change="populateParts()"
                :disabled="!selectedCategory"
                class="form-select"
              >
                <option value="">
                  {{ selectedCategory ? "請選擇章" : "請先選擇業務種類" }}
                </option>
                <option
                  v-for="chapter in chapters"
                  :key="chapter.chapterId"
                  :value="chapter.chapterId"
                >
                  {{ chapter.chapter }}
                </option>
              </select>
            </div>

            <div class="form-content">
              <label for="part">測驗範圍（節）</label>
              <select
                v-model="selectedPart"
                :disabled="!selectedChapter"
                class="form-select"
              >
                <option value="">
                  {{ selectedChapter ? "請選擇節" : "請先選擇章" }}
                </option>
                <option
                  v-for="part in parts"
                  :key="part.partId"
                  :value="part.partId"
                >
                  {{ part.part }}
                </option>
              </select>
            </div>

            <div>
              <p>
                此節題目數量：{{
                  getSelectedPartId !== "尚未選擇節"
                    ? `${questionCount}`
                    : "尚未選擇節"
                }}
              </p>
            </div>

            <div class="form-content">
              <label for="questionAmount">題目數量</label>
              <input
                type="number"
                id="questionAmount"
                v-model="questionAmount"
                placeholder="題目數量"
                min="1"
                :max="questionCount"
                class="input-number"
                @keyup.enter="saveRangeItem"
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
            <tr v-for="(rangeItem, index) in rangeItems" :key="index">
              <td>{{ rangeItem.category }}</td>
              <td>{{ rangeItem.chapter }}</td>
              <td>{{ rangeItem.part }}</td>
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
import { ref, reactive, computed, watch, onMounted } from "vue";
import AdminNavBar from "../../components/AdminNavBar.vue";
import ErrorModal from "../../components/APIerror.vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useIdleLogout } from "../../composables/useIdleLogout";

useIdleLogout();

const router = useRouter();

// 控制錯誤視窗顯示與否
const showError = ref(false);

// 儲存錯誤訊息
const errorMsg = ref({
  status: 0,
  code: 0,
  message: "",
});

// 用 reactive 來管理 testData
const testData = reactive({
  title: "", // 測驗名稱
  limitTime: null, // 測驗作答時間
  targetScore: null, // 及格分數
  startDate: "", // 測驗開始日期
  endDate: "", // 測驗結束日期
  // 儲存範圍項目
  rangeItemList: [],
});

// 管理業務種類、章、節
const selectedCategory = ref("");
const selectedChapter = ref("");
const selectedPart = ref("");
const questionAmount = ref(null);

const categories = ref([]); // 會從 API 取得資料
const chapters = ref([]);
const parts = ref([]);

const rangeItems = ref([]);

const questionCount = ref(0);

const token = localStorage.getItem("authToken");

// 獲取分類、章節、節資料
const fetchRangeData = async () => {
  try {
    const response = await axios.get(
      "http://172.16.46.163/csexam/admin/question/range",
      {
        headers: {
          Authorization: `Bearer ${token}`, // 使用 token
        },
      }
    );

    if (response.data.code === "0000") {
      // 處理回傳的資料
      const rangeList = response.data.data.rangeList;
      categories.value = rangeList.map((item) => ({
        categoryId: item.categoryId,
        category: item.category,
        chapters: item.chapterList,
      }));

      // 預設選擇第一個類別
      /*if (categories.value.length > 0) {
        selectedCategory.value = categories.value[0].categoryId;
        populateChapters();
      }*/
      // 不做預設選擇，使用者自行選擇
      selectedCategory.value = "";
      selectedChapter.value = "";
      selectedPart.value = "";
      chapters.value = [];
      parts.value = [];
    } else {
      alert("讀取題庫範圍失敗: " + response.data.message);
    }
  } catch (error) {
    console.error("獲取分類、章節、節資料失敗：", error);
    alert(
      "讀取範圍資料失敗: " + (error?.response?.data?.message || "未知錯誤")
    );
    if (
      error.response.data.message === "請求未提供token" ||
      error.response.data.message === "token無效或已過期，請重新登入"
    ) {
      // 來自伺服器的錯誤回應（例如 404, 500 等）
      errorMsg.value = {
        status: error.response.status,
        code: error.response.data.code,
        message: error.response.data.message || "null",
      };
      showError.value = true;
    } 
   
  }
};

// 更新章列表
const populateChapters = () => {
  const categoryId = selectedCategory.value;
  const categoryData = categories.value.find(
    (item) => item.categoryId === categoryId
  );
  chapters.value = categoryData ? categoryData.chapters : [];
  selectedChapter.value = "";
  parts.value = [];
  selectedPart.value = "";
};

// 更新節列表
const populateParts = () => {
  const chapterId = selectedChapter.value;
  const chapterData = chapters.value.find(
    (item) => item.chapterId === chapterId
  );

  parts.value = chapterData ? chapterData.partList : [];
  selectedPart.value = "";
};

// 找出節ID
const getSelectedPartId = computed(() => {
  const selectedPartData = parts.value.find(
    (part) => part.partId === selectedPart.value
  );
  return selectedPartData ? selectedPartData.partId : "尚未選擇節";
});

// 當選擇節時，獲取該節的題目數量
const fetchQuestionCount = async (partId) => {
  try {
    const response = await axios.get(
      `http://172.16.46.163/csexam/admin/question/count`,
      {
        params: {
          partId: partId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.code === "0000") {
      questionCount.value = response.data.data.count;
    } else {
      console.error("獲取題目數量失敗：", response.data.message);
    }
  } catch (error) {
    console.error("API請求失敗：", error);
    alert("獲取題目數量失敗，請稍後再試");
    if (
      error.response.data.message === "請求未提供token" ||
      error.response.data.message === "token無效或已過期，請重新登入"
    ) {
      // 來自伺服器的錯誤回應（例如 404, 500 等）
      errorMsg.value = {
        status: error.response.status,
        code: error.response.data.code,
        message: error.response.data.message || "null",
      };
      showError.value = true;
    } 
    
  }
};

// 當選擇的節ID改變時，更新題目數量
watch(getSelectedPartId, async (newPartId) => {
  if (newPartId !== null && newPartId !== "尚未選擇節") {
    await fetchQuestionCount(newPartId);
  }
});

// 新增範圍項目
const addRangeItem = () => {
  testData.rangeItemList.push({
    categoryId: null,
    chapterId: null,
    partId: null,
    questionAmount: null,
  });
};

// 儲存範圍項目
/* 原版
const saveRangeItem = () => {
  if (
    !selectedCategory.value ||
    !selectedChapter.value ||
    !selectedPart.value ||
    !questionAmount.value ||
    questionAmount.value <= 0
  ) {
    alert("請填寫完整的範圍項目！");
    return;
  }

  // 找到對應的 categoryId、chapterId 和 partId
  const categoryData = categories.value.find(
    (item) => item.category === selectedCategory.value
  );
  const chapterData = categoryData
    ? categoryData.chapters.find((ch) => ch.chapter === selectedChapter.value)
    : null;
  const partData = chapterData
    ? chapterData.partList.find((p) => p.part === selectedPart.value)
    : null;

  // 將資料加入範圍項目列表
  testData.rangeItemList.push({
    categoryId: categoryData ? categoryData.categoryId : null,
    chapterId: chapterData ? chapterData.chapterId : null,
    partId: partData ? partData.partId : null,
    questionAmount: questionAmount.value,
  });

  // 重置選擇
  selectedCategory.value = "";
  selectedChapter.value = "";
  selectedPart.value = "";
  questionAmount.value = null;
};*/
const saveRangeItem = () => {
  const categoryData = categories.value.find(
    (cate) => cate.categoryId === selectedCategory.value
  );
  const chapterData = chapters.value.find(
    (chap) => chap.chapterId === selectedChapter.value
  );
  const partData = parts.value.find(
    (part) => part.partId === selectedPart.value
  );

  if (!categoryData || !chapterData || !partData || questionAmount.value <= 0) {
    // alert("請完整選擇業務種類、章、節");
    alert("請填寫完整的範圍項目！");
    return;
  }

  if (questionAmount.value > questionCount.value) {
    alert(`題目數量不能超過此節最大題數（${questionCount.value} 題）`);
    questionAmount.value = questionCount.value;
    return;
  }

  const newItem = {
    categoryId: selectedCategory.value,
    category: categoryData.category,
    chapterId: selectedChapter.value,
    chapter: chapterData.chapter,
    partId: selectedPart.value,
    part: partData.part,
    questionAmount: questionAmount.value,
  };

  // 儲存選擇的出題範圍資料
  rangeItems.value.push(newItem);

  // 清空表單
  selectedCategory.value = "";
  selectedChapter.value = "";
  selectedPart.value = "";
  questionAmount.value = null;
};

// 刪除範圍項目
/*
const removeRangeItem = (index) => {
  testData.rangeItemList.splice(index, 1);
};
*/
const removeRangeItem = (index) => {
  rangeItems.value.splice(index, 1);
};

// 提交測驗資料
const submitTest = async () => {
  testData.rangeItemList = rangeItems.value.map((item) => ({
    categoryId: item.categoryId,
    chapterId: item.chapterId,
    partId: item.partId,
    questionAmount: item.questionAmount,
  }));

  // console.log("testData.rangeItemList: ", testData.rangeItemList);

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

  // 開始日期是否早於結束日期等
  if (new Date(testData.startDate) > new Date(testData.endDate)) {
    alert("開始日期不能晚於結束日期！");
    return;
  }

  // 提交資料到後端
  try {
    const response = await axios.post(
      "http://172.16.46.163/csexam/admin/exam",
      testData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 使用 token
        },
      }
    );

    if (response.data.code === "0000") {
      alert("測驗新增成功！");

      // 清空表單
      resetForm();
    } else {
      alert("新增測驗失敗: " + response.data.message);
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data.code) {
        alert(error.response.data.message);
        // EE002 考試名稱重複，請重新命名
      } else {
        alert("錯誤訊息:", error.response.data.message);
      }
    } else {
      alert("測驗新增失敗！");
    }
    console.error("提交測驗資料失敗：", error.message);

    if (
      error.response.data.message === "請求未提供token" ||
      error.response.data.message === "token無效或已過期，請重新登入"
    ) {
      // 來自伺服器的錯誤回應（例如 404, 500 等）
      errorMsg.value = {
        status: error.response.status,
        code: error.response.data.code,
        message: error.response.data.message || "null",
      };
      showError.value = true;
    }
   
  }
};

// 重置表單
const resetForm = () => {
  testData.title = "";
  testData.limitTime = null;
  testData.targetScore = null;
  testData.startDate = "";
  testData.endDate = "";
  testData.rangeItemList = [];
  selectedCategory.value = "";
  selectedChapter.value = "";
  selectedPart.value = "";
  questionAmount.value = null;

  // 清空暫存的出題範圍
  rangeItems.value = [];
};

// 計算 questionAmount 的總和
const totalQuestionAmount = computed(() => {
  return rangeItems.value.reduce(
    (total, item) => total + (item.questionAmount || 0),
    0
  );
});

// 當錯誤視窗按下確認後跳轉到首頁
const handleRedirect = () => {
  showError.value = false; // 關閉錯誤視窗
  router.push("/"); // 跳轉到首頁
};

onMounted(() => {
  fetchRangeData(); // 初始化時獲取分類、章節、節資料
});
</script>
-->
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
  background-color: #fadcee;
  color: #34495e;
}

.table tr:nth-child(even) {
  background-color: #fff6de;
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
