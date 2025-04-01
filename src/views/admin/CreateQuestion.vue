<!-- 不需要API的程式碼 -->
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

      <button class="button" @click="proceedToQuestions">開始出題</button>
    </div>
  </div>
</template>

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

// 新增章
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
    !selectedSection.value
  ) {
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


<!-- API 
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
          v-model="selectedCategoryId"
          @change="updateChapters"
          class="form-select"
        >
          <option value="">請選擇業務種類</option>
          <option
            v-for="category in rangeList"
            :key="category.categoryId"
            :value="category.categoryId"
          >
            {{ category.category }}
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
          v-model="selectedChapterId"
          @change="updateParts"
          :disabled="!selectedCategoryId"
          class="form-select"
        >
          <option value="">
            {{ selectedCategoryId ? "請選擇章" : "請先選擇業務種類" }}
          </option>
          <option
            v-for="chapter in filteredChapters"
            :key="chapter.chapterId"
            :value="chapter.chapterId"
          >
            {{ chapter.chapter }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <div class="form-container">
          <label for="exam-section" class="form-label">測驗範圍（節）</label>
          <button type="button" @click="addPart" class="form-button">
            新增節
          </button>
        </div>
        <select
          v-model="selectedPartId"
          :disabled="!selectedChapterId"
          class="form-select"
        >
          <option value="">
            {{ selectedChapterId ? "請選擇節" : "請先選擇章" }}
          </option>
          <option
            v-for="part in filteredParts"
            :key="part.partId"
            :value="part.partId"
          >
            {{ part.part }}
          </option>
        </select>
      </div>

      <button class="button" @click="proceedToQuestions">開始出題</button>
    </div>
  </div>
</template>

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

const rangeList = ref([]);
const selectedCategoryId = ref("");
const selectedChapterId = ref("");
const selectedPartId = ref("");

/*
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
*/

// 獲取所有題庫範圍資料
const fetchData = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      "http://172.16.46.163/csexam/admin/question/range",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.code === "0000") {
      rangeList.value = response.data.data.rangeList;
    }
  } catch (error) {
    console.error("API 錯誤：", error);
    alert("讀取題庫範圍資料發生錯誤！");
  }
};

// 計算對應的章
const filteredChapters = computed(() => {
  const category = rangeList.value.find(
    (cat) => cat.categoryId === selectedCategoryId.value
  );
  return category ? category.chapterList : [];
});

// 計算對應的節
const filteredParts = computed(() => {
  const chapter = filteredChapters.value.find(
    (chap) => chap.chapterId === selectedChapterId.value
  );
  return chapter ? chapter.partList : [];
});

// 重新選擇業務種類
const updateChapters = () => {
  selectedChapterId.value = "";
  selectedPartId.value = "";
};

// 重新選擇章
const updateParts = () => {
  selectedPartId.value = "";
};

// 新增業務種類API
const addCategory = async () => {
  const newCategory = prompt("請輸入新的業務種類名稱:");
  if (newCategory === null || newCategory.trim() === "") {
    return;
  }

  const token = localStorage.getItem("authToken"); // 從 localStorage 獲取 token

  try {
    const response = await axios.post(
      "http://172.16.46.163/csexam/admin/question/range/category",
      { category: newCategory },
      {
        headers: {
          Authorization: `Bearer ${token}`, // 在 header 中傳遞 token
        },
      }
    );

    if (response.data.code === "0000") {
      alert("業務種類新增成功！");
      categories.value.push(newCategory); // 例如把新業務種類加入前端的列表
      fetchData();
    } else {
      alert("新增業務種類失敗：" + response.data.message);
    }
  } catch (error) {
    console.error("新增業務種類錯誤：", error);
    alert("新增業務種類時出現錯誤，請稍後再試。");
  }
};

// 新增章API
const addChapter = async () => {
  if (!selectedCategoryId.value) {
    alert("請先選擇業務種類！");
    return;
  }

  const newChapter = prompt("請輸入新的章名稱:");
  if (!newChapter?.trim()) return;

  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.post(
      "http://172.16.46.163/csexam/admin/question/range/chapter",
      {
        categoryId: selectedCategoryId.value,
        chapter: newChapter.trim(),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.code === "0000") {
      alert("章新增成功！");
      fetchData(); // 重新獲取數據，保持同步
    } else {
      alert("新增章失敗：" + response.data.message);
    }
  } catch (error) {
    console.error("新增章錯誤：", error);
    alert("新增章時發生錯誤，請稍後再試。");
  }
};

// 新增節API
const addPart = async () => {
  if (!selectedChapterId.value) {
    alert("請先選擇章！");
    return;
  }

  const newPart = prompt("請輸入新的節名稱:");
  if (!newPart?.trim()) return;

  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.post(
      "http://172.16.46.163/csexam/admin/question/range/part",
      {
        chapterId: selectedChapterId.value,
        part: newPart.trim(),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.code === "0000") {
      alert("節新增成功！");
      fetchData(); // 重新獲取數據，保持同步
    } else {
      alert("新增節失敗：" + response.data.message);
    }
  } catch (error) {
    console.error("新增節錯誤：", error);
    alert("新增節時發生錯誤，請稍後再試。");
  }
};

// 進入出題頁面
const proceedToQuestions = () => {
  if (
    !selectedCategoryId.value ||
    !selectedChapterId.value ||
    !selectedPartId.value
  ) {
    alert("請填寫所有選項！");
    return;
  }

  // 範圍ID所對應的名稱
  /*
  const categoryName = rangeList.value.find(
    (cat) => cat.categoryId === selectedCategoryId.value
  )?.categoryName;
  const chapterName = rangeList.value
    .find((cat) => cat.categoryId === selectedCategoryId.value)
    ?.chapterList.find(
      (chap) => chap.chapterId === selectedChapterId.value
    )?.chapterName;
  const partName = rangeList.value
    .find((cat) => cat.categoryId === selectedCategoryId.value)
    ?.chapterList.find((chap) => chap.chapterId === selectedChapterId.value)
    ?.partList.find((part) => part.partId === selectedPartId.value)?.partName;
  */
  const category = rangeList.value.find(
    (cat) => cat.categoryId === selectedCategoryId.value
  );
  const categoryName = category.category;

  const chapter = category.chapterList.find(
    (chap) => chap.chapterId === selectedChapterId.value
  );
  const chapterName = chapter.chapter;

  const part = chapter.partList.find(
    (part) => part.partId === selectedPartId.value
  );
  const partName = part.part;

  localStorage.setItem(
    "examInfo",
    JSON.stringify({
      categoryId: selectedCategoryId.value,
      chapterId: selectedChapterId.value,
      partId: selectedPartId.value,
      categoryName: categoryName,
      chapterName: chapterName,
      partName: partName,
    })
  );
  router.push("/create_question_data");
};

onMounted(() => {
  localStorage.setItem("examInfo", JSON.stringify({}));
  fetchData();
});
</script>
-->
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
