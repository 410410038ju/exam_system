<!-- 目前版本-->
<template>
  <div class="container">
    <div class="createquestion-container">
      <form @submit.prevent="submitQuestion">
        <div class="createquestion-content">
          <h1>出題</h1>
          <div>第 {{ currentQuestionCount + 1 }} 題</div>

          <div class="form-group">
            <label for="question-type">選擇題型</label>
            <select
              id="question-type"
              v-model="questionType"
              @change="changeQuestionType"
            >
              <option value="true-false">是非題</option>
              <option value="single-choice">單選題</option>
              <option value="multiple-choice">複選題</option>
            </select>
          </div>

          <div class="questionType-container">
            <div v-if="questionType === 'true-false'" class="question-form">
              <div class="form-group">
                <label for="true-false-question-text">題目</label>
                <input
                  type="text"
                  v-model="trueFalseQuestionText"
                  placeholder="請輸入是非題問題"
                  required
                />
              </div>
              <div class="form-group">
                <label for="true-false-answer">正確答案</label>

                <div class="answer-group">
                  <input
                    type="radio"
                    id="trueOption"
                    value="true"
                    v-model="trueFalseAnswer"
                  />
                  <label for="trueOption">對</label>

                  <input
                    type="radio"
                    id="falseOption"
                    value="false"
                    v-model="trueFalseAnswer"
                  />
                  <label for="falseOption">錯</label>
                </div>
              </div>
            </div>

            <div v-if="questionType === 'single-choice'" class="question-form">
              <div class="form-group">
                <label for="single-choice-question-text">題目</label>
                <input
                  type="text"
                  v-model="singleChoiceQuestionText"
                  placeholder="請輸入單選題問題"
                  required
                />
              </div>
              <div v-for="(option, index) in singleChoiceOptions" :key="index">
                <label :for="'single-choice-option' + (index + 1)"
                  >選項 {{ index + 1 }}</label
                >
                <input
                  type="text"
                  v-model="singleChoiceOptions[index]"
                  :placeholder="'請輸入選項 ' + (index + 1)"
                  required
                />
              </div>
              <div class="form-group">
                <label for="single-choice-answer">正確答案</label>

                <div class="answer-group">
                  <div
                    v-for="(option, index) in singleChoiceOptions"
                    :key="index"
                    class="single-choice-answer"
                  >
                    <input
                      type="radio"
                      :id="'option' + (index + 1)"
                      :value="index + 1"
                      v-model="singleChoiceAnswer"
                    />

                    <label :for="'option' + (index + 1)"
                      >選項 {{ index + 1 }}</label
                    >
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="questionType === 'multiple-choice'"
              class="question-form"
            >
              <div class="form-group">
                <label for="multiple-choice-question-text">題目</label>
                <input
                  type="text"
                  v-model="multipleChoiceQuestionText"
                  placeholder="請輸入複選題問題"
                  required
                />
              </div>
              <div
                v-for="(option, index) in multipleChoiceOptions"
                :key="index"
              >
                <label :for="'multiple-choice-option' + (index + 1)"
                  >選項 {{ index + 1 }}</label
                >
                <input
                  type="text"
                  v-model="multipleChoiceOptions[index]"
                  :placeholder="'請輸入選項 ' + (index + 1)"
                  required
                />
              </div>
              <div class="form-group">
                <label for="multiple-choice-answer">正確答案</label>
                <div class="answer-group">
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="1"
                  />
                  選項 1
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="2"
                  />
                  選項 2
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="3"
                  />
                  選項 3
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="4"
                  />
                  選項 4
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="5"
                  />
                  選項 5
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group form-group-btn">
          <button type="submit" class="button">提交題目</button>
        </div>
      </form>
    </div>

    <div class="question-container">
      <div class="question-content">
        <div class="examInfo">
          <div class="info">業務種類：{{ examInfo.category }}</div>
          <div class="info">
            測驗範圍：{{ examInfo.chapter }} {{ examInfo.section }}
          </div>
        </div>
        <h2>已提交題目</h2>
        <table
          border="1"
          style="width: 100%; margin-top: 20px; border-collapse: collapse"
        >
          <thead>
            <tr>
              <th>題號</th>
              <th>題型</th>
              <th>題目</th>
              <th>選項</th>
              <th>正確答案</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(question, index) in submittedQuestions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <span v-if="question.type === 'true-false'">是非題</span>
                <span v-else-if="question.type === 'single-choice'"
                  >單選題</span
                >
                <span v-else-if="question.type === 'multiple-choice'"
                  >複選題</span
                >
              </td>

              <td>{{ question.text }}</td>
              <td>{{ question.options.join(", ") }}</td>
              <td>{{ question.correctAnswer }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="form-group form-group-btn end-btn">
        <button class="button" @click="endCreateQuestion">結束出題</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, reactive, onMounted } from "vue";

const router = useRouter();

const currentQuestionCount = ref(0);
const questionType = ref("true-false");
const trueFalseQuestionText = ref("");
const trueFalseAnswer = ref("true");
const singleChoiceQuestionText = ref("");
const singleChoiceOptions = ref(["", "", "", "", ""]);
const singleChoiceAnswer = ref(1);
const multipleChoiceQuestionText = ref("");
const multipleChoiceOptions = ref(["", "", "", "", ""]);
const multipleChoiceAnswers = ref([]);
const examInfo = reactive({});
const submittedQuestions = ref([]);

const changeQuestionType = () => {
  trueFalseQuestionText.value = "";
  singleChoiceQuestionText.value = "";
  multipleChoiceQuestionText.value = "";
  singleChoiceOptions.value = ["", "", "", "", ""];
  multipleChoiceOptions.value = ["", "", "", "", ""];
  multipleChoiceAnswers.value = [];
};
/*
const submitQuestion = () => {
  if (currentQuestionCount.value >= maxQuestions.value) {
    alert("已達到最大題數，無法再提交題目！");
    return;
  }

  let question = {
    type: questionType.value,
    text: "",
    options: [],
    correctAnswer: "",
  };

  if (questionType.value === "true-false") {
    question.text = trueFalseQuestionText.value;
    question.correctAnswer = trueFalseAnswer.value === "true" ? "對" : "錯";
  } else if (questionType.value === "single-choice") {
    question.text = singleChoiceQuestionText.value;
    question.options = singleChoiceOptions.value;
    question.correctAnswer = `選項 ${singleChoiceAnswer.value}`;
  } else if (questionType.value === "multiple-choice") {
    question.text = multipleChoiceQuestionText.value;
    question.options = multipleChoiceOptions.value;
    question.correctAnswer = multipleChoiceAnswers.value.join(", ");
  }

  submittedQuestions.value.push(question);
  currentQuestionCount.value++;

  // 儲存到 localStorage
  localStorage.setItem(
    "submittedQuestions",
    JSON.stringify(submittedQuestions.value)
  );

  changeQuestionType();
};*/

const submitQuestion = () => {
  // if (currentQuestionCount.value >= maxQuestions.value) {
  //   alert("已達到最大題數，無法再提交題目！");
  //   return;
  // }

  let question = {
    type: questionType.value,
    text: "",
    options: null,
    correctAnswer: null,
    creatorId: null,
  };

  // 取得出題者的 ID
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    question.creatorId = loggedInUser.id; // 將出題者 ID 設定到題目中
  }

  if (questionType.value === "true-false") {
    question.text = trueFalseQuestionText.value;
    question.options = ["對", "錯"];
    question.correctAnswer = trueFalseAnswer.value === "true" ? "對" : "錯";
  } else if (questionType.value === "single-choice") {
    question.text = singleChoiceQuestionText.value;
    question.options = singleChoiceOptions.value.filter(
      (opt) => opt.trim() !== ""
    );
    question.correctAnswer =
      singleChoiceOptions.value[singleChoiceAnswer.value - 1];
  } else if (questionType.value === "multiple-choice") {
    question.text = multipleChoiceQuestionText.value;
    question.options = multipleChoiceOptions.value.filter(
      (opt) => opt.trim() !== ""
    );
    question.correctAnswer = multipleChoiceAnswers.value.map(
      (index) => multipleChoiceOptions.value[index - 1]
    );
  }

  // 檢查題目是否已經存在
  const isQuestionExists = submittedQuestions.value.some((existingQuestion) => {
    return (
      existingQuestion.text === question.text &&
      JSON.stringify(existingQuestion.options) ===
        JSON.stringify(question.options)
    );
  });

  if (isQuestionExists) {
    alert("此題目已經存在！");
    return;
  }

  // 存入題目陣列
  submittedQuestions.value.push(question);

  // 讀取 examinfo 並生成 dynamic storage key
  const examinfo = JSON.parse(localStorage.getItem("examInfo"));
  if (examinfo) {
    const storageKey = `Q${examinfo.category}_${examinfo.chapter}-${examinfo.section}`;
    // 讀取已儲存的題目並合併，防止舊題目被覆蓋
    const savedQuestions = JSON.parse(localStorage.getItem(storageKey)) || [];
    savedQuestions.push(question);
    // 存回 localStorage
    localStorage.setItem(storageKey, JSON.stringify(savedQuestions));
  }

  currentQuestionCount.value++;
  changeQuestionType(); // 清空表單
};

// 結束出題
const endCreateQuestion = () => {
  localStorage.setItem("examInfo", JSON.stringify({}));
  router.push("/create_question");
};

/*
onMounted(() => {
  const examinfo = JSON.parse(localStorage.getItem("examInfo"));
  if (examinfo) {
    const storageKey = `Q${examinfo.category}_${examinfo.chapter}-${examinfo.section}`;
    const savedQuestions = localStorage.getItem(storageKey);
    if (savedQuestions) {
      submittedQuestions.value = JSON.parse(savedQuestions);
      currentQuestionCount.value = submittedQuestions.value.length;
    }
  } else {
    alert("無法讀取考試資訊！");
  }
});
*/

onMounted(() => {
  const storedExamInfo = JSON.parse(localStorage.getItem("examInfo"));
  if (storedExamInfo) {
    // 更新 examInfo 和 maxQuestions
    Object.assign(examInfo, storedExamInfo);
  } else {
    alert("無法讀取考試資訊！");
  }
});
</script>

<!-- 第一版
<style scoped>
body {
  margin: 0;
  padding: 0;
}

#app {
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.createquestion-container {
  width: 45%; /* 左側區域占50%寬度 */
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.question-container {
  width: 45%; /* 右側區域占50%寬度 */
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

button.button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button.button:hover {
  background-color: #45a049;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}

input[type="text"], select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.answer-items input[type="radio"] {
  margin-right: 5px;
}

.option-group input[type="checkbox"] {
  margin-right: 5px;
}

</style>
-->

<!-- 第二版
<style scoped>
/* 主要容器，讓兩個部分並排顯示 */
.container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
}

/* 左側創建題目的區塊 */
.createquestion-container {
  flex: 1; /* 佔用剩餘空間 */
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.createquestion-container h1 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.createquestion-container .form-group {
  margin-bottom: 15px;
}

.createquestion-container label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.createquestion-container input[type="text"],
.createquestion-container select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.createquestion-container input[type="radio"],
.createquestion-container input[type="checkbox"] {
  margin-right: 10px;
}

.createquestion-container .answer-items {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.createquestion-container .button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.createquestion-container .button:hover {
  background-color: #45a049;
}

/* 右側顯示已提交題目的區塊 */
.question-container {
  flex: 1;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.question-container h1 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.question-container table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.question-container table th,
.question-container table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

.question-container table th {
  background-color: #f1f1f1;
}

.question-container table td {
  background-color: #fff;
}

.question-container .form-group {
  text-align: center;
}

.question-container .form-group .button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.question-container .form-group .button:hover {
  background-color: #e64a19;
}

/* 處理題目選項的樣式 */
.question-form {
  margin-top: 20px;
}

.question-form input[type="text"] {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

.question-form .form-group {
  margin-bottom: 20px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.option-group input[type="checkbox"] {
  margin-right: 10px;
}

</style> 
-->

<!-- 第三版 
<style scoped>
/* 基本容器樣式 */
.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.createquestion-container, .question-container {
  width: 48%;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1, h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

/* 表單項目樣式 */
.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input[type="text"], select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

input[type="radio"], input[type="checkbox"] {
  margin-right: 5px;
}

.answer-items, .option-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button.button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

button.button:hover {
  background-color: #45a049;
}

/* 表格樣式 */
table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f1f1f1;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

/* 輸入框和選項的空間調整 */
.question-form {
  margin-bottom: 20px;
}

</style>
-->

<!-- 第四版 
<style scoped>
/* 移除所有元素的預設邊距和內邊距 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 確保所有元素的 box model 不會受到 padding 和 border 的影響 */
}

/* 如果有其他元素，像是 #app，也加上 */
#app {
  margin: 0;
  padding: 0;
  height: 100vh; /* 填滿整個視窗 */
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* 設定頁面背景和頁面高度 */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

/* 讓 #app 元素填滿整個頁面 */
/* #app {
  width: 100%;  
  display: flex;
  justify-content: center;  
  align-items: flex-start; 
  padding: 20px;
  margin: 0;
  box-sizing: border-box;
  background-color: #f4f4f4; 
} */

/* 設定 #app 內部容器 */
/* .container {
  width: 100%;  
  max-width: 1200px;  
  margin: 0 auto;  
  display: flex;
  justify-content: space-between;
  gap: 20px;  
  align-items: flex-start;
  box-sizing: border-box;
} */

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  width: 80%;
  margin: 0 auto;
}

/* 使創建題目和考試資訊容器能夠均分畫面 */
.createquestion-container,
.question-container {
  width: 48%;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-sizing: border-box;
  overflow-y: auto; /* 使容器內部如果超過高度時可滾動 */
}

/* 設定標題的樣式 */
h1,
h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

/* 其餘的表單樣式保持不變 */
.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

input[type="radio"],
input[type="checkbox"] {
  margin-right: 5px;
}

.answer-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button.button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

button.button:hover {
  background-color: #45a049;
}

/* 表格樣式 */
table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f1f1f1;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

/* 輸入框和選項的空間調整 */
.question-form {
  margin-bottom: 20px;
}
</style>
-->

<!-- 第五版 -->
<style scoped>
/* 移除所有元素的預設邊距和內邊距 */
* {
  box-sizing: border-box; /* 確保所有元素的 box model 不會受到 padding 和 border 的影響 */
}

/* 設定頁面背景和頁面高度 */
html,
body {
  height: 100%;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4; /* 頁面背景顏色 */
}

/* 設定 #app 內部容器 */
#app {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;
  margin: 0;
}

/* 主容器樣式 */
.container {
  display: flex;
  justify-content: space-between;
  gap: 70px;
  align-items: flex-start;
  height: 97vh;
  max-width: 1200px;
  margin: 10px auto;
}

/* 出題容器與考試資訊容器的樣式 */
.createquestion-container,
.question-container {
  width: 70%;
  height: 100%;
  padding: 20px;
  border-radius: 8px;
  box-sizing: border-box;
  overflow-y: auto;
  border: 1px solid #ddd;
}

.createquestion-content,
.question-content {
  width: 100%;
  height: 100%;
  padding: 20px;
  padding-top: 0;
  box-sizing: border-box;
  overflow-y: auto;
}

.createquestion-content {
  min-height: 620px;
}

.question-content {
  padding: 0 20px;
  height: 90%;
}

/* 標題樣式 */
h1,
h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333; /* 深色文字 */
}
/*
.form-group-btn {
  position: absolute;
  bottom: 20px;
  left: 50%; 
  transform: translateX(-50%); 
  position: relative; 
  bottom: 20px; 
  width: 92%; 
  margin: 0 auto;
}*/

/* 標籤樣式 */
label {
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
  color: #444; /* 略深的顏色 */
}

/* 輸入框和選擇框樣式 */
input[type="text"],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease; /* 加入過渡效果 */
}

input[type="text"]:focus,
select:focus {
  border-color: #4caf50; /* 聚焦時邊框變綠 */
  outline: none;
}

/* 單選框和複選框樣式 */
input[type="radio"],
input[type="checkbox"] {
  margin-right: 8px;
}

/* 答案群組排列 */
.answer-group {
  display: flex;
  gap: 10px; /* 調整選項之間的間隔 */
  flex-wrap: wrap; /* 讓選項能夠換行，防止太長時超出容器 */
}

.answer-group input[type="radio"] {
  margin-right: 10px;
}

.answer-group input[type="checkbox"] {
  margin-right: 0;
}

/* 按鈕樣式 */
button.button {
  padding: 12px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.button:hover {
  background-color: #45a049;
}

.end-btn {
  margin-top: 20px;
}

/* 表格樣式 */
table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f1f1f1;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

/* 輸入框和選項的空間調整 */
.question-form {
  margin-bottom: 20px;
}

/* 增加手機版響應式設計 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: center;
  }

  .createquestion-container,
  .question-container {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
