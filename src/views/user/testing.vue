<!-- 沒有API -->
<template>
  <div class="container">
    <div class="header">
      <div class="left-header">
        <div class="exam-name">{{ exam.title }}</div>
        <div class="time-left">剩餘時間： {{ formattedTime() }}</div>
      </div>
      <div class="right-header">
        <div class="progress">
          答題進度： {{ answeredQuestions }} / {{ totalQuestions }}
        </div>
        <button class="submit-btn" @click="submitExam">交卷</button>
      </div>
    </div>
    <div class="exam-container">
      <div v-for="(question, index) in questions" :key="index" class="question">
        <p class="question-text">{{ index + 1 }}. {{ question.text }}</p>
        <p class="question-type">【{{ question.questionType }}】</p>
        <div class="options">
          <label
            v-for="(option, i) in question.options"
            :key="i"
            class="option"
          >
            <input
              :type="question.questionType === '多選題' ? 'checkbox' : 'radio'"
              :name="'question-' + index"
              :value="option"
              v-model="userAnswers[index]"
            />
            {{ String.fromCharCode(65 + i) }}. {{ option }}
          </label>
        </div>
      </div>
      <div class="submit-container">
        <button class="submit-btn" @click="submitExam">交卷</button>
      </div>
    </div>

    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal">
        <button class="close-btn" @click="cancelSubmit">✕</button>
        <p class="modal-title">提交考卷</p>
        <hr />
        <p class="modal-message">
          {{
            answeredCount === totalQuestions
              ? "答題時間尚未截止，確定要交卷嗎？"
              : `還有 ${
                  totalQuestions - answeredCount
                } 題未作答，確定要交卷嗎？`
          }}
        </p>

        <div class="modal-actions">
          <button @click="confirmSubmit" class="confirm">確定</button>
          <button @click="cancelSubmit" class="cancel">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  computed,
} from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useIdleLogout } from "../../composables/useIdleLogout";

useIdleLogout();

const router = useRouter();

import { useExamStore } from "../../stores/examStore";

const examStore = useExamStore();
const exam = examStore.currentExam;

if (!exam) {
  // 沒資料可能是直接進入頁面而不是從按鈕進來，你可以導回列表
  console.warn("未帶入測驗資料");
  router.push("/user");
}

const examId = ref(null);

// 測驗名稱
const examName = ref("數學期末考");

// 剩餘時間（秒）
// const timeLeft = ref(30 * 60); // 30分鐘 = 1800秒
const timeLeft = ref(exam ? exam.limitTime * 60 : 0);
let timer = null;

// 答題進度
const totalQuestions = ref(4); // 假設總共有10題

const isAutoSubmit = ref(false); // 判斷是否是自動交卷

// Modal 顯示控制
const showConfirmModal = ref(false);
const pendingSubmit = ref(false);

// 計算已答題數
const answeredCount = computed(
  () =>
    userAnswers.value.filter((ans) => ans !== null && ans.length !== 0).length
);

const questions = ref([
  {
    text: "以下哪一項是 Vue.js 的特性？",
    questionType: "單選題",
    options: ["雙向資料綁定", "單向資料流", "虛擬 DOM", "以上皆是"],
  },
  {
    text: "Vue 3 中引入了哪一個 Composition API？",
    questionType: "單選題",
    options: ["data()", "methods()", "ref()", "computed()"],
  },
  {
    text: "Vue.js 是一個前端框架？",
    questionType: "是非題",
    options: ["對", "錯"],
  },
  {
    text: "以下哪些是 Vue.js 的特性？",
    questionType: "多選題",
    options: ["雙向資料綁定", "單向資料流", "虛擬 DOM", "以上皆是"],
  },
]);

const userAnswers = ref(
  questions.value.map((q) => (q.questionType === "多選題" ? [] : ""))
);

const getExam = async () => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.post(
      "http://172.16.46.163/csexam/user/exam/paper",
      {
        examId: examId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = response.data;

    if (data.code === "0000") {
      // 讀取測驗資料
    } else {
      alert(data.message || "讀取測驗失敗");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data.code) {
        alert(error.response.data.message);
        // EE001 查無考試
      } else {
        alert("錯誤訊息:", error.response.data.message);
      }
    } else {
      alert("發生錯誤，請稍後再試");
    }
    console.error("讀取測驗失敗:", error);
  }
};

// 計算已答題數
const answeredQuestions = computed(() => {
  return userAnswers.value.filter(
    (answer) => answer !== null && answer.length > 0
  ).length;
});

// 交卷按鈕的點擊處理
/*
const submitExam = () => {
  clearInterval(timer); // 清除計時器，防止額外觸發
  console.log("提交答案：", userAnswers.value);
  router.push("/answer"); // 跳轉至結果頁
};
*/

// 點交卷按鈕 -> 顯示 Modal
const submitExam = () => {
  if (isAutoSubmit.value) {
    // 自動交卷就直接送出
    confirmSubmit();
  } else {
    // 手動交卷才顯示確認視窗
    showConfirmModal.value = true;
  }
};

// 點確認 -> 執行真正交卷
const confirmSubmit = () => {
  clearInterval(timer); // 清除計時器，防止額外觸發
  console.log("提交答案：", userAnswers.value);
  showConfirmModal.value = false;
  router.push("/answer"); // 原本的交卷動作
};

// 點取消 -> 關閉 Modal
const cancelSubmit = () => {
  showConfirmModal.value = false;
};

// 倒數計時
const startCountdown = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
      isAutoSubmit.value = true; // 自動交卷 flag
      submitExam(); // 時間到，執行交卷
    }
  }, 1000);
};

// 格式化時間顯示（將秒轉換為 MM:SS 格式）
/*
const formattedTime = () => {
  const minutes = Math.floor(timeLeft.value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft.value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};
*/
const formattedTime = () => {
  const totalSeconds = timeLeft.value;
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return totalSeconds >= 3600
    ? `${hours}:${minutes}:${seconds}`
    : `${minutes}:${seconds}`;
};

// 當組件掛載時開始計時
onMounted(() => {
  startCountdown();
  const storedExamId = localStorage.getItem("examId"); // 從 localStorage 中讀取 examId
  if (storedExamId) {
    examId.value = storedExamId;
    console.log("接收到的 examId:", examId.value);
  }
  getExam();
});

// 當組件卸載時清除計時器，防止內存泄漏
onUnmounted(() => {
  clearInterval(timer);
});

onBeforeUnmount(() => {
  localStorage.removeItem("examId");
});
</script>
-->
<!-- API 
<template>
  <div class="container">
    <div class="header">
      <div class="left-header">
        <div class="exam-name">{{ exam.title }}</div>
        <div class="time-left">剩餘時間： {{ formattedTime() }}</div>
      </div>
      <div class="right-header">
        <div class="progress">
          答題進度： {{ answeredQuestions }} / {{ totalQuestions }}
        </div>
        <button class="submit-btn" @click="submitExam">交卷</button>
      </div>
    </div>
    <div class="exam-container">
      <div v-for="(question, index) in questions" :key="index" class="question">
        <p class="question-text">{{ index + 1 }}. {{ question.question }}</p>
        <p class="question-type">【{{ question.questionType }}】</p>
        <div class="options">
          <label
            v-for="(option, i) in question.optionList"
            :key="i"
            class="option"
          >
            <input
              :type="
                question.questionType === 'multiple_choice'
                  ? 'checkbox'
                  : 'radio'
              "
              :name="'question-' + index"
              :value="option.optionId"
              v-model="userAnswers[index]"
            />
            {{ String.fromCharCode(65 + i) }}. {{ option.option }}
          </label>
        </div>
      </div>
      <div class="submit-container">
        <button class="submit-btn" @click="submitExam">交卷</button>
      </div>
    </div>

  
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal">
        <button class="close-btn" @click="cancelSubmit">✕</button>
        <p class="modal-title">提交考卷</p>
        <hr />
        <p class="modal-message">
          {{
            answeredCount === totalQuestions
              ? "答題時間尚未截止，確定要交卷嗎？"
              : `還有 ${
                  totalQuestions - answeredCount
                } 題未作答，確定要交卷嗎？`
          }}
        </p>

        <div class="modal-actions">
          <button @click="confirmSubmit" class="confirm">確定</button>
          <button @click="cancelSubmit" class="cancel">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  computed,
} from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();

import { useIdleLogout } from "../../composables/useIdleLogout";
useIdleLogout();

import { useExamStore } from "../../stores/examStore";

const examStore = useExamStore();
const exam = examStore.currentExam;

if (!exam) {
  // 沒資料可能是直接進入頁面而不是從按鈕進來，你可以導回列表
  console.warn("未帶入測驗資料");
  router.push("/user");
}

const examId = ref(null);

// 測驗名稱
const examName = ref("數學期末考");

// 剩餘時間（秒）
// const timeLeft = ref(30 * 60); // 30分鐘 = 1800秒
const timeLeft = ref(exam ? exam.limitTime * 60 : 0);
let timer = null;

// 答題進度
const totalQuestions = ref(4); // 假設總共有4題（將來由API回應決定）

const isAutoSubmit = ref(false); // 判斷是否是自動交卷

// Modal 顯示控制
const showConfirmModal = ref(false);
const pendingSubmit = ref(false);

// 計算已答題數
const answeredCount = computed(
  () =>
    userAnswers.value.filter((ans) => ans !== null && ans.length !== 0).length
);

// 從API獲取題目
const questions = ref([]);

const userAnswers = ref([]);

// 根據API回應格式填充題目和選項
const getExam = async () => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.post(
      "http://172.16.46.163/csexam/user/exam/paper",
      { examId: examId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = response.data;

    if (data.code === "0000") {
      // 讀取測驗資料
      questions.value = data.data.questionList;
      userAnswers.value = questions.value.map((q) =>
        q.questionType === "multiple_choice" ? [] : ""
      );
    } else {
      alert(data.message || "讀取測驗失敗");
    }
  } catch (error) {
    alert("發生錯誤，請稍後再試");
    console.error("讀取測驗失敗:", error);
  }
};

// 計算已答題數
const answeredQuestions = computed(() => {
  return userAnswers.value.filter(
    (answer) => answer !== null && answer.length > 0
  ).length;
});

// 交卷按鈕的點擊處理
const submitExam = () => {
  if (isAutoSubmit.value) {
    // 自動交卷就直接送出
    confirmSubmit();
  } else {
    // 手動交卷才顯示確認視窗
    showConfirmModal.value = true;
  }
};

// 點確認 -> 執行真正交卷
const confirmSubmit = () => {
  clearInterval(timer); // 清除計時器，防止額外觸發
  console.log("提交答案：", userAnswers.value);
  showConfirmModal.value = false;
  router.push("/answer"); // 原本的交卷動作
};

// 點取消 -> 關閉 Modal
const cancelSubmit = () => {
  showConfirmModal.value = false;
};

// 倒數計時
const startCountdown = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
      isAutoSubmit.value = true; // 自動交卷 flag
      submitExam(); // 時間到，執行交卷
    }
  }, 1000);
};

// 格式化時間顯示（將秒轉換為 MM:SS 格式）
/*const formattedTime = () => {
  const minutes = Math.floor(timeLeft.value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft.value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};*/
const formattedTime = () => {
  const totalSeconds = timeLeft.value;
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return totalSeconds >= 3600
    ? `${hours}:${minutes}:${seconds}`
    : `${minutes}:${seconds}`;
};

// 當組件掛載時開始計時
onMounted(() => {
  startCountdown();
  const storedExamId = localStorage.getItem("examId"); // 從 localStorage 中讀取 examId
  if (storedExamId) {
    examId.value = storedExamId;
    console.log("接收到的 examId:", examId.value);
  }
  getExam();
});

// 當組件卸載時清除計時器，防止內存泄漏
onUnmounted(() => {
  clearInterval(timer);
});

onBeforeUnmount(() => {
  localStorage.removeItem("examId");
});
</script>
-->
<style scoped>
#app {
  position: relative;
  z-index: 0; /* 原本 -999 可能導致背景無法顯示 */
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh; /* 至少和視窗一樣高 */
  background-color: #eee;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #5d5a5a;
  width: 100%;
  height: 40px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.left-header {
  display: flex;
  gap: 30px;
}

.right-header {
  display: flex;
  gap: 30px;
  align-items: center;
  margin-right: 50px;
}

.exam-name {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.time-left,
.progress {
  font-size: 20px;
  color: white;
}

.progress {
  font-size: 18px;
}

.submit-btn {
  padding: 10px 30px;
  background-color: #13b57f;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 3px; /* 設定圓角 */
}

.submit-btn:hover {
  background-color: #158553;
}

.exam-container {
  position: relative; /* ✅ 讓它影響 .container 的高度 */
  width: 70%;
  margin: 110px auto 50px; /* ✅ 考慮 header 高度 */
  padding: 20px 40px;
  border: 1px solid #d1d1d1;
  background-color: white;
}

.question {
  margin-bottom: 40px;
}

.question-text {
  font-weight: bold;
  text-align: left;
  margin-bottom: 10px;
}

.question-type {
  text-align: left;
  margin: 0;
}

.options {
  margin-top: 10px;
  text-align: left;
}

.option {
  display: block;
  margin: 10px 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  text-align: center;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
  padding: 6px 12px;
}

.modal-title {
  font-weight: bold;
  font-size: 18px;
  margin: 5px;
  text-align: left;
  margin-bottom: 12px;
}

.modal-message {
  margin: 16px 0;
  font-size: 16px;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
}

.confirm {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel {
  background-color: #f44336;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
