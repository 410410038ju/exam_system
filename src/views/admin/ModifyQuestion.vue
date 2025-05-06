<template>
  <div class="container">
    <ErrorModal
      v-model="showError"
      :message="errorMsg"
      @confirm="handleRedirect"
    />
    <AdminNavBar />

    <div class="search-container">
      <form @submit.prevent="searchQuestions" class="form">
        <button @click="addQuestion" class="add-question-btn">
          <i class="fa fa-plus"></i> 新增題目
        </button>

        <div class="form-group" id="questionoType-group">
          <label for="questionType">題型</label>
          <select v-model="searchParams.questionType" id="questionType">
            <option value="">所有題型</option>
            <option value="true_false">是非題</option>
            <option value="single_choice">單選題</option>
            <option value="multiple_choice">複選題</option>
          </select>
        </div>

        <div class="form-group" id="creatorId-group">
          <label for="creatorId">出題者員工編號</label>
          <input
            v-model="searchParams.creatorId"
            id="creatorId"
            type="text"
            placeholder="輸入員工編號"
            @keyup.enter="searchQuestions"
          />
        </div>

        <div class="form-group" id="keyword-group">
          <label for="keyword">關鍵字查詢</label>
          <input
            v-model="searchParams.keyword"
            id="keyword"
            type="text"
            placeholder="輸入題目關鍵字"
            @keyup.enter="searchQuestions"
          />
        </div>

        <button type="submit" class="search-btn">搜尋</button>
      </form>
    </div>

    <div class="table-info">
      <label for="size">每頁行數：</label>
      <select
        v-model.number="searchParams.size"
        id="size"
        @change="searchQuestions"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
      </select>
      <p v-if="pageInfo.totalElements === 0">從 0 - 0 筆 / 共 0 筆</p>
      <p v-else-if="pageInfo">
        從 {{ pageInfo.number * pageInfo.size + 1 }} -
        {{
          Math.min(
            (pageInfo.number + 1) * pageInfo.size,
            pageInfo.totalElements
          )
        }}
        筆 / 共 {{ pageInfo.totalElements }} 筆
      </p>
      <div class="page-group">
        <!-- 上一頁按鈕 -->
        <!-- <button
        :disabled="pageInfo.number <= 0"
        @click="prevPage(pageInfo.number)"
      >
        上一頁
      </button> -->

        <button
          :disabled="searchParams.page <= 1"
          @click="prevPage"
          class="page-btn"
        >
          上一頁
        </button>
        <p v-if="pageInfo.totalElements === 0">第 0 / 0 頁</p>
        <p v-else-if="pageInfo && pageInfo.totalPages !== undefined">
          第 {{ pageInfo.number + 1 }} / {{ pageInfo.totalPages }} 頁
        </p>
        <!-- 下一頁按鈕 -->
        <!-- <button
        :disabled="pageInfo.number >= pageInfo.totalPages - 1"
        @click="nextPage(pageInfo.number, pageInfo.totalPages)"
      >
        下一頁
      </button> -->
        <button
          :disabled="searchParams.page >= pageInfo.totalPages"
          @click="nextPage"
          class="page-btn"
        >
          下一頁
        </button>
      </div>
      <div
        class="gotopage"
        style="display: flex; align-items: center; gap: 8px"
      >
        <span>頁碼：</span>
        <input
          v-model.number="searchParams.page"
          id="page"
          type="number"
          min="1"
          :max="pageInfo.totalPages"
          placeholder="頁碼"
          style="width: 40px"
          class="page-input"
        />
        <button
          @click="
            () => {
              searchQuestions();
              scrollToTop();
            }
          "
          :disabled="
            !searchParams.page ||
            searchParams.page < 1 ||
            searchParams.page > pageInfo.totalPages
          "
          class="go-btn"
        >
          GO
        </button>
      </div>
      <!-- <p>每頁顯示數量: {{ pageInfo.size }}</p> -->
    </div>

    <div v-if="results.length > 0" class="table-container">
      <table>
        <thead>
          <tr>
            <th>編號</th>
            <!-- <th
              @click="setOrderBy('createDate')"
              :class="{ active: searchParams.orderBy === 'createDate' }"
            >
              編號
              <i :class="getSortIcon('createDate')"></i>
            </th> -->
            <th
              @click="setOrderBy('questionId')"
              :class="{ active: searchParams.orderBy === 'questionId' }"
            >
              題目編號
              <i :class="getSortIcon('questionId')"></i>
            </th>
            <th
              @click="setOrderBy('creatorId')"
              :class="{ active: searchParams.orderBy === 'creatorId' }"
            >
              出題者員編
              <i :class="getSortIcon('creatorId')"></i>
            </th>
            <th
              @click="setOrderBy('questionType')"
              :class="{ active: searchParams.orderBy === 'questionType' }"
            >
              題型
              <i :class="getSortIcon('questionType')"></i>
            </th>
            <th>題目內容</th>
            <th>選項</th>
            <th>正確答案</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(question, index) in results" :key="question.questionId">
            <td>{{ pageInfo.number * pageInfo.size + index + 1 }}</td>
            <td>{{ question.questionId }}</td>
            <td>{{ question.creatorId }}</td>
            <td>{{ getTypeName(question.questionType) }}</td>
            <td>{{ question.question }}</td>
            <td>
              <ul>
                <li
                  v-for="(option, index) in question.optionList"
                  :key="option.optionId"
                >
                  {{ String.fromCharCode(65 + index) }}. {{ option.content }}
                </li>
              </ul>
            </td>
            <td>
              <ul>
                <li
                  v-for="option in getCorrectOptions(question)"
                  :key="option.optionId"
                >
                  {{
                    String.fromCharCode(
                      65 + question.optionList.indexOf(option)
                    )
                  }}. {{ option.content }}
                </li>
              </ul>
            </td>
            <td>
              <button
                class="action-btn edit-btn"
                @click="editQuestion(question)"
              >
                編輯
              </button>
              <button
                class="action-btn delete-btn"
                @click="deleteQuestion(question)"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="results.length > 0" class="table-info">
      <label for="size">每頁行數：</label>
      <select
        v-model.number="searchParams.size"
        id="size"
        @change="searchQuestions"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
      </select>
      <p v-if="pageInfo.totalElements === 0">從 0 - 0 筆 / 共 0 筆</p>
      <p v-else-if="pageInfo">
        從 {{ pageInfo.number * pageInfo.size + 1 }} -
        {{
          Math.min(
            (pageInfo.number + 1) * pageInfo.size,
            pageInfo.totalElements
          )
        }}
        筆 / 共 {{ pageInfo.totalElements }} 筆
      </p>
      <div class="page-group">
        <!-- 上一頁按鈕 -->
        <!-- <button
        :disabled="pageInfo.number <= 0"
        @click="prevPage(pageInfo.number)"
      >
        上一頁
      </button> -->
        <button
          :disabled="searchParams.page <= 1"
          @click="prevPage"
          class="page-btn"
        >
          上一頁
        </button>
        <p v-if="pageInfo.totalElements === 0">第 0 / 0 頁</p>
        <p v-else-if="pageInfo && pageInfo.totalPages !== undefined">
          第 {{ pageInfo.number + 1 }} / {{ pageInfo.totalPages }} 頁
        </p>
        <!-- 下一頁按鈕 -->
        <!-- <button
        :disabled="pageInfo.number >= pageInfo.totalPages - 1"
        @click="nextPage(pageInfo.number, pageInfo.totalPages)"
      >
        下一頁
      </button> -->
        <button
          :disabled="searchParams.page >= pageInfo.totalPages"
          @click="nextPage"
          class="page-btn"
        >
          下一頁
        </button>
      </div>
      <div
        class="gotopage"
        style="display: flex; align-items: center; gap: 8px"
      >
        <span>頁碼：</span>
        <input
          v-model.number="searchParams.page"
          id="page"
          type="number"
          min="1"
          :max="pageInfo.totalPages"
          placeholder="頁碼"
          style="width: 40px"
          class="page-input"
        />
        <button
          @click="
            () => {
              searchQuestions();
              scrollToTop();
            }
          "
          :disabled="
            !searchParams.page ||
            searchParams.page < 1 ||
            searchParams.page > pageInfo.totalPages
          "
          class="go-btn"
        >
          GO
        </button>
      </div>
      <!-- <p>每頁顯示數量: {{ pageInfo.size }}</p> -->
    </div>

    <div v-else-if="results.length === 0">沒有符合資料</div>

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
            :value="getTypeName(editingQuestion.questionType)"
            disabled
            class="question-type"
          />
        </div>

        <!-- 題目 -->
        <div class="modal-form-group">
          <label for="edit-question-text">題目</label>
          <textarea
            v-model="editingQuestion.question"
            placeholder="請輸入題目敘述"
            required
            rows="3"
            cols="30"
          ></textarea>
        </div>

        <!-- 是非題 -->
        <!-- 
        <div
          v-if="editingQuestion.questionType === 'true_false'"
          class="option-form-group"
        >
          <div class="correct-answer-group">
            <label class="answer-label">正確答案</label>
            <div class="answer-group">
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
        </div> 
        -->
        <div
          v-if="editingQuestion.questionType === 'true_false'"
          class="option-form-group"
        >
          <div class="correct-answer-group">
            <label class="answer-label">正確答案</label>
            <div class="answer-group">
              <!-- 是非題的正確答案選項 -->
              <div
                v-for="(option, index) in editingQuestion.optionList"
                :key="index"
                class="answer"
              >
                <input
                  type="radio"
                  :id="'trueFalseOption' + index"
                  :value="option.content"
                  v-model="editingQuestion.correctAnswer"
                  @change="updateCorrectAnswer(option)"
                />
                <label :for="'trueFalseOption' + index" class="answer-option">
                  {{ option.content }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 單選題 -->
        <div
          v-if="editingQuestion.questionType === 'single_choice'"
          class="option-form-group"
        >
          <!-- 單選題選項編輯 -->
          <div
            v-for="(option, index) in editingQuestion.optionList"
            :key="index"
            class="option-group"
          >
            <label
              :for="'single-choice-option' + (index + 1)"
              class="option-label"
              >選項 {{ String.fromCharCode(65 + index) }}</label
            >
            <textarea
              v-model="option.content"
              :placeholder="'選項 ' + String.fromCharCode(65 + index)"
              required
              rows="1"
              cols="30"
            ></textarea>
          </div>

          <!-- 單選題的正確答案 -->
          <div class="correct-answer-group">
            <label class="answer-label">正確答案</label>
            <div class="answer-group">
              <div
                v-for="(option, index) in editingQuestion.optionList"
                :key="index"
                class="answer"
              >
                <input
                  type="radio"
                  :id="'single-choice-option' + (index + 1)"
                  :value="option.content"
                  v-model="editingQuestion.correctAnswer"
                  @change="updateCorrectAnswer(option)"
                />
                <label :for="'single-choice-option' + (index + 1)">
                  選項 {{ String.fromCharCode(65 + index) }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 複選題 -->
        <div
          v-if="editingQuestion.questionType === 'multiple_choice'"
          class="option-form-group"
        >
          <!-- 複選題選項編輯 -->
          <div
            v-for="(option, index) in editingQuestion.optionList"
            :key="index"
            class="option-group"
          >
            <label
              :for="'multiple-choice-option' + (index + 1)"
              class="option-label"
              >選項 {{ String.fromCharCode(65 + index) }}</label
            >
            <textarea
              v-model="option.content"
              :placeholder="'選項 ' + String.fromCharCode(65 + index)"
              required
              rows="1"
              cols="30"
            ></textarea>
          </div>

          <!-- 複選題的正確答案 -->
          <div class="correct-answer-group">
            <label class="answer-label">正確答案</label>
            <div class="answer-group">
              <div
                v-for="(option, index) in editingQuestion.optionList"
                :key="index"
                class="answer"
              >
                <input
                  type="checkbox"
                  v-model="option.answer"
                  :value="option.content"
                  :id="'multiple-choice-option' + (index + 1)"
                />
                <label :for="'multiple-choice-option' + (index + 1)">
                  選項 {{ String.fromCharCode(65 + index) }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="save-btn" @click="saveEdit">儲存</button>
          <button class="cancel-btn" @click="cancelEdit">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar.vue";
import ErrorModal from "../../components/APIerror.vue";
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

// 題型英文名稱轉中文名稱
const getTypeName = (type) => {
  switch (type) {
    case "true_false":
      return "是非題";
    case "single_choice":
      return "單選題";
    case "multiple_choice":
      return "複選題";
    default:
      return type;
  }
};

// 尋找正確答案
const getCorrectOptions = (question) => {
  return question.optionList.filter((option) => option.answer);
};

const searchParams = ref({
  questionType: "", // 預設值
  creatorId: "",
  keyword: "",
  page: 1,
  size: 5,
  orderBy: "createDate",
  orderType: "desc",
});

// 設置排序條件
const setOrderBy = (column) => {
  if (searchParams.value.orderBy === column) {
    // 如果已經是這個欄位，則切換排序順序
    searchParams.value.orderType =
      searchParams.value.orderType === "desc" ? "asc" : "desc";
  } else {
    // 如果是新的欄位，則選擇此欄位並設為降序
    searchParams.value.orderBy = column;
    searchParams.value.orderType = "desc";
  }

  searchQuestions();
};

// 根據當前排序條件來返回箭頭圖示的class
const getSortIcon = (column) => {
  if (searchParams.value.orderBy === column) {
    return searchParams.value.orderType === "asc"
      ? "fas fa-arrow-up"
      : "fas fa-arrow-down";
  }
  return "fas fa-arrow-up"; // 預設箭頭朝上
};

// 這裡是模擬的搜尋結果資料
const results = ref([
  {
    questionId: 28,
    creatorId: "1111",
    questionType: "true_false",
    question: "白板是乾淨的",
    optionList: [
      { optionId: 97, content: "是", answer: true },
      { optionId: 98, content: "否", answer: false },
    ],
  },
  {
    questionId: 27,
    creatorId: "1111",
    questionType: "true_false",
    question: "今天會下雨",
    optionList: [
      { optionId: 95, content: "是", answer: false },
      { optionId: 96, content: "否", answer: true },
    ],
  },
  {
    questionId: 26,
    creatorId: "1111",
    questionType: "multiple_choice",
    question: "我討厭吃的是?",
    optionList: [
      { optionId: 90, content: "青椒", answer: true },
      { optionId: 91, content: "辣椒", answer: true },
      { optionId: 92, content: "番茄", answer: false },
      { optionId: 93, content: "茄子", answer: true },
      { optionId: 94, content: "苦瓜", answer: true },
    ],
  },
  {
    questionId: 25,
    creatorId: "1111",
    questionType: "single_choice",
    question: "今天星期幾?",
    optionList: [
      { optionId: 85, content: "一", answer: false },
      { optionId: 86, content: "二", answer: false },
      { optionId: 87, content: "三", answer: true },
      { optionId: 88, content: "四", answer: false },
      { optionId: 89, content: "五", answer: false },
    ],
  },
  {
    questionId: 24,
    creatorId: "1111",
    questionType: "single_choice",
    question: "我想吃香蕉",
    optionList: [
      { optionId: 80, content: "香蕉", answer: true },
      { optionId: 81, content: "草莓", answer: false },
      { optionId: 82, content: "橘子", answer: false },
      { optionId: 83, content: "柚子", answer: false },
      { optionId: 84, content: "布丁", answer: false },
    ],
  },
]);

// const results = ref([]);
const pageInfo = ref({
  size: 0,
  number: 0,
  totalElements: 0,
  totalPages: 0,
});

const addQuestion = () => {
  router.push("/create_question");
};

// 計算屬性過濾正確答案
const correctAnswers = computed(() => {
  return results.value.map((question) => {
    console.log(question.optionList);
    return {
      ...question,
      correctOptions: question.optionList.filter((option) => option.answer), // 過濾正確答案
    };
  });
});

// 是非題和單選題
// 使用 computed 屬性，根據選項列表自動設置正確答案
// const correctAnswer = computed({
//   get: () => {
//     // 根據選項中的 answer 為 true 的來設置
//     const correctOption = editingQuestion.value.optionList.find(
//       (option) => option.answer
//     );
//     return correctOption ? correctOption.content : null;
//   },
//   set: (value) => {
//     // 根據設定的值來更新選項的答案
//     editingQuestion.value.optionList.forEach((option) => {
//       option.answer = option.content === value;
//     });
//   },
// });

// 是非題和單選題
// 更新正確答案，確保每次只有一個選項被選中
const updateCorrectAnswer = (selectedOption) => {
  editingQuestion.value.optionList.forEach((option) => {
    option.answer = option === selectedOption;
  });
};

// 查詢題目API
const searchQuestions = async () => {
  try {
    const token = localStorage.getItem("authToken");

    // 組合需要傳遞的參數，只有不為空的才會傳送
    const params = {};

    if (searchParams.value.questionType)
      params.questionType = searchParams.value.questionType;
    if (searchParams.value.creatorId)
      params.creatorId = searchParams.value.creatorId;
    if (searchParams.value.keyword) params.keyword = searchParams.value.keyword;
    if (searchParams.value.page !== undefined) {
      params.page = searchParams.value.page - 1;
    }
    if (searchParams.value.size) params.size = searchParams.value.size;
    if (searchParams.value.orderBy) params.orderBy = searchParams.value.orderBy;
    if (searchParams.value.orderType)
      params.orderType = searchParams.value.orderType;

    // 使用 axios 發送 GET 請求，並帶上 token 和必要的 params
    const response = await axios.get(
      "http://172.16.46.163/csexam/admin/question",
      {
        headers: {
          Authorization: `Bearer ${token}`, // 在 headers 中帶上 token
        },
        params,
      }
    );

    // 處理 API 回傳的結果
    if (response.data.code === "0000") {
      results.value = response.data.data.content;
      // pageInfo.value = response.data.data.page;
      pageInfo.value = {
        number: response.data.data.number,
        size: response.data.data.size,
        totalElements: response.data.data.totalElements,
        totalPages: response.data.data.totalPages,
      };
    } else {
      alert("搜尋失敗，資料庫出現問題");
      console.error("搜尋錯誤: 資料格式異常");
    }
  } catch (error) {
    console.error("發生錯誤:", error);
    alert("發生錯誤，請稍後再試");
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

// 查詢條件變動時，跳回第 1 頁並自動查詢
watch(
  () => [
    searchParams.questionType,
    searchParams.creatorId,
    searchParams.keyword,
  ],
  () => {
    searchParams.page = 1; // 回到第 1 頁
    searchQuestions();
  }
);

// 自動滾到最上方
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/*
// 上一頁按鈕
const prevPage = (number) => {
  if (number > 0) {
    searchParams.value.page = number--;
    searchQuestions(); // 重新載入資料
  }
};

// 下一頁按鈕
const nextPage = (number, totalPages) => {
  if (number < totalPages) {
    searchParams.value.page = number + 2;
    searchQuestions(); // 重新載入資料
  }
};
*/

// 上一頁按鈕
const prevPage = () => {
  if (searchParams.value.page > 1) {
    searchParams.value.page--;
    searchQuestions(); // 重新載入資料
    scrollToTop();
  }
};

// 下一頁按鈕
const nextPage = () => {
  if (searchParams.value.page < pageInfo.value.totalPages) {
    searchParams.value.page++;
    searchQuestions(); // 重新載入資料
    scrollToTop();
  }
};

const editingQuestion = ref(null);

// 編輯題目
const editQuestion = (question) => {
  editingQuestion.value = { ...question }; // 使用深拷貝以避免直接修改原始資料
  const correctOption = editingQuestion.value.optionList.find(
    (option) => option.answer
  );
  if (correctOption) {
    editingQuestion.value.correctAnswer = correctOption.content; // 初始化選中的答案
  }
};

// 編輯題目API
/*
const editQuestion = async (question) => {
  try {
    const token = localStorage.getItem("authToken");

    if (!question.questionId) {
      alert("發生錯誤，題目 ID 不存在");
      return;
    }

    // 發送 GET 請求到 API
    const response = await axios.get(
      `http://172.16.46.163/csexam/admin/question/${question.questionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 在 headers 中帶上 token
        },
      }
    );

    // 檢查回應結果
    if (response.data.code === "0000") {
      // 使用深拷貝避免直接修改原始資料
      editingQuestion.value = { ...response.data.data };

      // 初始化選中的答案（假設選項是正確答案）
      const correctOption = editingQuestion.value.optionList.find(
        (option) => option.answer
      );
      if (correctOption) {
        editingQuestion.value.correctAnswer = correctOption.content; // 初始化選中的答案
      }
    } else {
      alert("獲取資料失敗，資料庫出現問題");
      console.error("獲取資料錯誤: ", response.data.message);
    }
  } catch (error) {
    console.error("發生錯誤:", error);
    alert("發生錯誤，請稍後再試");
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
*/

// 儲存編輯的函數
const saveEdit = () => {
  // 保存編輯的邏輯
  console.log("儲存編輯", editingQuestion.value);
  cancelEdit();
};

// 儲存編輯API(修改題目及選項答案API)
/*
const saveEdit = async () => {
  try {
    const token = localStorage.getItem("authToken");

    // 構建需要傳送的資料格式
    const payload = {
      content: editingQuestion.value.question, // 對應到 question
      optionItemList: editingQuestion.value.optionList.map(option => ({
        optionId: option.optionId, // 傳送選項 ID
        content: option.content,   // 選項內容
        isCorrect: option.answer   // 是否為正確答案
      }))
    };

    // 發送 PUT 請求，更新資料
    const response = await axios.put(
      `http://172.16.46.163/csexam/admin/question/${editingQuestion.value.questionId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 在 headers 中帶上 token
        }
      }
    );

    // 處理 API 回應
    if (response.data.code === "0000") {
      console.log("編輯成功:", response.data);
      cancelEdit(); // 編輯成功後關閉編輯視窗
      searchQuestions();
    } else {
      alert("編輯失敗，資料庫出現問題");
      console.error("編輯錯誤:", response.data.message);
    }
  } catch (error) {
    console.error("發生錯誤:", error);
    alert("資料儲存失敗，請稍後再試");
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
*/

// 取消編輯的函數
const cancelEdit = () => {
  editingQuestion.value = null; // 關閉編輯視窗
};

//刪除題目API
const deleteQuestion = async (question) => {
  // 顯示確認刪除的對話框
  const confirmDelete = window.confirm(
    `確定要刪除題目編號為 ${question.questionId} 的題目嗎？`
  );

  if (!confirmDelete) {
    return; // 如果使用者取消，則不執行刪除
  }

  try {
    const token = localStorage.getItem("authToken");

    // 確認題目 ID 是否存在
    if (!question.questionId) {
      alert("發生錯誤，題目 ID 不存在");
      return;
    }

    // 發送 PATCH 請求到 API
    const response = await axios.patch(
      `http://172.16.46.163/csexam/admin/question/${question.questionId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // 在 headers 中帶上 token
        },
      }
    );

    // 檢查回應結果
    if (response.data.code === "0000") {
      // 成功刪除後更新結果
      // results.value = results.value.filter(
      //   (q) => q.questionId !== question.questionId
      // );
      searchQuestions();
      alert("題目已刪除");
    } else {
      alert("刪除失敗，資料庫出現問題");
      console.error("刪除錯誤: 資料格式異常");
    }
  } catch (error) {
    console.error("發生錯誤:", error);
    alert("發生錯誤，請稍後再試");
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

// 當錯誤視窗按下確認後跳轉到首頁
const handleRedirect = () => {
  showError.value = false; // 關閉錯誤視窗
  router.push("/"); // 跳轉到首頁
};
</script>

<style scoped>
.container {
  min-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 100px;
}

/* 搜尋區塊容器 */
.search-container {
  background-color: #f9f9f9;
  padding: 20px 30px;
  border-radius: 0;
}

label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

input,
select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 12px 20px;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* 表單布局 */
.form {
  width: 80%;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  justify-content: space-between;
}

.add-question-btn {
  background-color: #7371fc; /* 藍色背景 */
  color: white; /* 白色文字 */
  padding: 12px; /* 上下12px、左右24px的內邊距 */
  border: none; /* 無邊框 */
  border-radius: 5px; /* 圓角邊框 */
  font-size: 16px; /* 字體大小 */
  cursor: pointer; /* 滑鼠指標變成手指 */
  display: inline-flex; /* 使用 flex 排列 */
  align-items: center; /* 垂直居中對齊 */
  transition: background-color 0.3s ease; /* 平滑過渡效果 */
}

.add-question-btn i {
  margin-right: 8px; /* 圖示與文字之間的間距 */
}

.add-question-btn:hover {
  background-color: #2f2cd9; /* 滑鼠懸停時顏色變深 */
}

/* 單一欄位區塊 */
.form-group {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.form-group#questionType-group {
  flex-grow: 1;
}
.form-group#creatorId-group {
  flex-grow: 1.5;
}
.form-group#keyword-group {
  flex-grow: 7;
}

/* 標籤文字 */
.form-group label {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
  margin-left: 10px;
}

/* 輸入欄位與下拉選單 */
.form-group input,
.form-group select {
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
  outline: none;
}

/* 搜尋按鈕 */
.search-btn {
  width: 80px;
  padding: 10px;
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  background-color: #ff9800;
  color: white;
  border-radius: 5px;
  border: 1px solid #ff9800;
  cursor: pointer;
  flex-grow: 0;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.search-btn:hover {
  background-color: #cc7b00;
}

.action-btn {
  margin: 8px;
  padding: 10px 15px;
  border-radius: 5px;
}

.edit-btn {
  background-color: #dbcafe;
  color: #222;
}

.edit-btn:hover {
  background-color: #772ff4;
  color: white;
}

.delete-btn {
  background-color: #03fcba;
  color: black;
}

.delete-btn:hover {
  background-color: #32a385;
  color: white;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

thead {
  background-color: #f7d0ff;
  color: black;
}

th,
td {
  text-align: left;
  border: 1px solid #ddd;
}

th {
  font-weight: bold;
  padding: 12px;
}

th.active i {
  color: #6128fc; /* 可以替換成你想要的顏色 */
  transition: color 0.3s ease, transform 0.3s ease;
  transform: scale(1.1); /* 在顏色改變時讓字體輕微放大 */
}

th i {
  margin-left: 5px;
  color: #aaa; /* 預設箭頭顏色 */
}

td {
  padding: 0 12px;
}

tr:nth-child(even) {
  background-color: #fefde6;
}

td:last-child {
  text-align: center;
  padding: 0;
}

th:nth-child(1),
td:nth-child(1) {
  width: 4%;
}

th:nth-child(2),
td:nth-child(2) {
  width: 6%;
}

th:nth-child(3),
td:nth-child(3) {
  width: 8%;
}

th:nth-child(4),
td:nth-child(4) {
  width: 5%;
}

th:nth-child(5),
td:nth-child(5) {
  width: 23%;
}

th:nth-child(6),
td:nth-child(6) {
  width: 22%;
}

th:nth-child(7),
td:nth-child(7) {
  width: 22%;
}

th:nth-child(8),
td:nth-child(8) {
  width: 10%;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 3px 0;
}

li {
  padding: 5px 0;
}

span {
  padding: 2px 6px;
  border-radius: 4px;
}

span[v-if="option.answer"] {
  background-color: #28a745;
  color: white;
}

span[v-else] {
  background-color: #dc3545;
  color: white;
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
  padding: 20px 30px;
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

.modal-content h2 {
  margin-top: 0;
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
  gap: 10px;
  width: 30%;
  margin: 0 auto;
}

.save-btn {
  background-color: #20bec8;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background-color: #1f9199;
}

.cancel-btn {
  background-color: #ebebeb;
  color: black;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover {
  background-color: #d1d1d1;
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
  padding: 3px 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  background-color: white;
  color: rgb(0, 0, 0);
}

.close-btn:hover {
  background-color: #fff;
}

.correct-answer-group {
  padding-top: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.answer-label {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  color: #333;
  flex-basis: 15%;
}

.answer-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  /* margin-bottom: 8px; */
  gap: 12px;
  /* width: 100%; */
}

.answer-group input {
  flex-grow: 1;
  margin-top: 0;
  margin-right: 5px;
  transform: scale(1.2); /* 增大選項按鈕 */
}

.answer-option {
  margin: 0;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

/* textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
  height: auto; 
  line-height: 1.5; 
  text-align: left; 
  vertical-align: top; 
  white-space: pre-wrap; 
  word-wrap: break-word; 
  resize: none;
}

textarea:focus {
  border-color: #007bff;
} */

textarea {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
  height: auto; /* 固定高度 */
  line-height: 1.5;
  text-align: left;
  vertical-align: top;
  white-space: pre-wrap;
  word-wrap: break-word;
  resize: none;
}

textarea:focus {
  border-color: #007bff;
}

textarea::placeholder {
  color: #888;
}

.question-type-div {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.option-form-group {
  margin: 0;
  gap: 5px;
  margin-bottom: 15px;
}

.option-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  gap: 12px;
  width: 100%;
}

.option-group textarea {
  width: 900%;
  height: 40px;
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

.table-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  font-size: 14px;
}
/* 
.table-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: stretch; 
}

.table-info > * {
  flex: 1 1 50px; 
  display: flex;
  flex-direction: column;
  justify-content: center; 
}*/

.table-info label {
  margin: auto 0;
  font-weight: normal;
  color: #555;
}

.table-info select {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
}

.table-info p {
  margin: auto 0;
  color: #555;
  font-size: 16px;
}

.page-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-group p {
  margin: auto;
  color: #20bec8;
  font-size: 16px;
  margin-top: 7px;
}

.page-btn {
  padding: 6px 12px;
  margin: auto;
  border: none;
  background-color: rgba(0, 0, 0, 0);
  color: #20bec8;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.page-btn:hover {
  background-color: #20bec8;
  color: white;
}

.page-btn:disabled {
  cursor: not-allowed;
}

.gotopage span {
  font-size: 16px;
}

.go-btn {
  background-color: #20bec8;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
}

.go-btn:disabled {
  background-color: #67e6ef; /* 禁用狀態下的背景顏色 */
  color: white; /* 禁用狀態下的文字顏色 */
  cursor: not-allowed; /* 禁用狀態下的鼠標樣式 */
}

/* RWD：當螢幕寬度小於768px時，改為一列一列顯示 */
@media (max-width: 768px) {
  .form {
    justify-content: flex-start;
    gap: 1rem 0; /* 垂直間距保持，水平方向不留間距 */
  }

  .form-group {
    width: 100%; /* 讓每個欄位佔滿整行 */
  }

  .add-question-btn {
    width: 100%; /* 按鈕在小螢幕上也撐滿整行 */
    margin-top: 1rem; /* 按鈕與輸入欄位保持距離 */
  }

  /* 調整搜尋按鈕在小螢幕的樣式 */
  .search-btn {
    width: 100%; /* 按鈕在小螢幕上也撐滿整行 */
    margin-top: 1rem; /* 按鈕與輸入欄位保持距離 */
  }
}
</style>
