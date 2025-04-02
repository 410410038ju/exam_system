<template>
  <div class="container">
    <div class="header">
      <div class="left-header">
        <div class="exam-name">{{ examName }}</div>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 測驗名稱
const examName = ref("數學期末考");

// 剩餘時間（秒）
const timeLeft = ref(1 * 60); // 30分鐘 = 1800秒
let timer = null;

// 答題進度
const totalQuestions = ref(4); // 假設總共有10題

const questions = ref([
  {
    text: "以下哪一項是 Vue.js 的特性？",
    type: "單選題",
    options: ["雙向資料綁定", "單向資料流", "虛擬 DOM", "以上皆是"],
  },
  {
    text: "Vue 3 中引入了哪一個 Composition API？",
    type: "單選題",
    options: ["data()", "methods()", "ref()", "computed()"],
  },
  {
    text: "Vue.js 是一個前端框架？",
    type: "是非題",
    options: ["對", "錯"],
  },
  {
    text: "以下哪些是 Vue.js 的特性？",
    type: "多選題",
    options: ["雙向資料綁定", "單向資料流", "虛擬 DOM", "以上皆是"],
  },
]);

const userAnswers = ref(
  questions.value.map((q) => (q.type === "多選題" ? [] : null))
);

// 計算已答題數
const answeredQuestions = computed(() => {
  return userAnswers.value.filter(
    (answer) => answer !== null && answer.length > 0
  ).length;
});

// 交卷按鈕的點擊處理
const submitExam = () => {
  clearInterval(timer); // 清除計時器，防止額外觸發
  console.log("提交答案：", userAnswers.value);
  router.push("/user"); // 跳轉至結果頁
};

// 倒數計時
const startCountdown = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
      submitExam(); // 時間到，執行交卷
    }
  }, 1000);
};

// 格式化時間顯示（將秒轉換為 MM:SS 格式）
const formattedTime = () => {
  const minutes = Math.floor(timeLeft.value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft.value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

// 當組件掛載時開始計時
onMounted(() => {
  startCountdown();
});

// 當組件卸載時清除計時器，防止內存泄漏
onUnmounted(() => {
  clearInterval(timer);
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

.exam-name {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.time-left,
.progress {
  font-size: 18px;
  color: white;
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
</style>
