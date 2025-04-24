<template>
  <div class="container">
    <div class="header">
      <div class="left-header">
        <div>
          <button class="back-btn" @click="backtoList">返回考試列表</button>
        </div>
        <div class="exam-name">{{ examName }}</div>
        <div class="time-left">剩餘時間： {{ formattedTime }}</div>
      </div>
      <div class="right-header">
        <div class="answering-time">答題時間： 2025-02-20 15:45</div>
        <div class="exam-score">試卷得分 100</div>
      </div>
    </div>
    <div class="exam-container">
      <div v-for="(question, index) in questions" :key="index" class="question">
        <p class="question-text">
          {{ index + 1 }}. {{ question.text }}
          <span
            class="answer-status"
            :class="isCorrect(question) ? 'correct' : 'wrong'"
          >
            {{ isCorrect(question) ? "✅ 正確" : "❌ 錯誤" }}
          </span>
        </p>
        <p class="question-type">【{{ question.type }}】</p>
        <div class="options">
          <label
            v-for="(option, i) in question.options"
            :key="i"
            class="option"
          >
            <input
              :type="question.type === '多選題' ? 'checkbox' : 'radio'"
              :name="'question-' + index"
              :value="option"
              v-model="question.userAnswer"
              disabled
            />
            {{ String.fromCharCode(65 + i) }}. {{ option }}
          </label>
        </div>
        <div class="correct-answer">
          <p>
            正確答案：
            <span v-if="Array.isArray(question.correctAnswer)">
              {{
                question.correctAnswer
                  .map(
                    (ans) =>
                      `${String.fromCharCode(
                        65 + question.options.indexOf(ans)
                      )}. ${ans}`
                  )
                  .join(", ")
              }}
            </span>
            <span v-else>
              {{
                String.fromCharCode(
                  65 + question.options.indexOf(question.correctAnswer)
                )
              }}. {{ question.correctAnswer }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useIdleLogout } from "../../composables/useIdleLogout";

useIdleLogout();

const router = useRouter();

// 測驗名稱
const examName = ref("數學期末考");

// 剩餘時間（秒）
const timeLeft = ref(2 * 60); // 2分鐘
let timer; // ✅ 初始化時不使用 null，避免 Vue 無法追蹤變更

const questions = ref([
  {
    text: "以下哪一項是 Vue.js 的特性？",
    type: "單選題",
    options: ["雙向資料綁定", "單向資料流", "虛擬 DOM", "以上皆是"],
    correctAnswer: "以上皆是",
    userAnswer: "雙向資料綁定", // ✅ 模擬已作答的答案
  },
  {
    text: "Vue 3 中引入了哪一個 Composition API？",
    type: "單選題",
    options: ["data()", "methods()", "ref()", "computed()"],
    correctAnswer: "ref()",
    userAnswer: "computed()", // ✅ 模擬已作答的答案
  },
  {
    text: "Vue.js 是一個前端框架？",
    type: "是非題",
    options: ["對", "錯"],
    correctAnswer: "對",
    userAnswer: "對", // ✅ 模擬已作答的答案
  },
  {
    text: "以下哪些是 Vue.js 的特性？",
    type: "多選題",
    options: ["雙向資料綁定", "單向資料流", "虛擬 DOM", "以上皆是"],
    correctAnswer: ["雙向資料綁定", "虛擬 DOM"],
    userAnswer: ["單向資料流", "虛擬 DOM"], // ✅ 模擬已作答的答案
  },
]);

// ✅ userAnswers 應該用 reactive，而非 ref([]) 來保持響應式
const userAnswers = reactive(
  questions.value.map((q) => (q.type === "多選題" ? [] : null))
);

const isCorrect = (question) => {
  if (Array.isArray(question.correctAnswer)) {
    return (
      question.userAnswer.length === question.correctAnswer.length &&
      question.userAnswer.every((ans) => question.correctAnswer.includes(ans))
    );
  }
  return question.userAnswer === question.correctAnswer;
};

// ✅ 計時器啟動時應該檢查是否已存在
const startCountdown = () => {
  if (timer) return; // 避免重複執行
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
      timer = null;
      backtoList(); // 時間到，返回考試列表
    }
  }, 1000);
};

// ✅ 格式化時間顯示，改為 computed 避免重複計算
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft.value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});

// ✅ 返回考試列表時應該確保計時器被清除
const backtoList = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  router.push("/user");
};

// 當組件掛載時開始計時
onMounted(() => {
  startCountdown();
});

// 當組件卸載時清除計時器，防止內存泄漏
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

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

.back-btn {
  background-color: white;
  color: black;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 3px;
  font-size: 14px;
}

.back-btn:hover {
  background-color: #e7e7e7;
}

.exam-name {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin: auto;
  padding: auto;
}

.time-left {
  font-size: 20px;
  color: white;
  margin: auto;
  padding: auto;
}

.answering-time {
  color: white;
}

.exam-score {
  color: white;
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

.answer-status {
  float: right;
  font-weight: bold;
  font-size: 16px;
}

.answer-status::before {
  content: " ";
  display: inline-block;
  width: 10px;
}

.correct {
  color: green;
}

.wrong {
  color: red;
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

.correct-answer {
  margin-top: 10px;
  padding: 8px;
  border-radius: 5px;
  background-color: #f6f6f6;
}

.correct-answer p {
  margin: 5px 0;
  text-align: left;
  color: #7371fc;
}

.correct-answer p span {
  color: #7371fc;
}

.correct {
  color: green;
  font-weight: bold;
}

.incorrect {
  color: red;
  font-weight: bold;
}
</style>
