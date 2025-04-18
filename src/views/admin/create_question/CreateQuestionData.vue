<!-- 不用API的版本 
<template>
  <div class="container">
    <div class="createquestion-container">
      <form @submit.prevent="submitQuestion">
        <div class="createquestion-content">
          <h1>出題</h1>
          <div class="question-num">第 {{ currentQuestionCount + 1 }} 題</div>

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
                <textarea
                  v-model="trueFalseQuestionText"
                  placeholder="請輸入是非題問題敘述"
                  rows="5"
                  cols="30"
                  required
                ></textarea>
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
                  <label for="trueOption" class="tf-ans answer-option"
                    >是</label
                  >

                  <input
                    type="radio"
                    id="falseOption"
                    value="false"
                    v-model="trueFalseAnswer"
                  />
                  <label for="falseOption" class="tf-ans answer-option"
                    >否</label
                  >
                </div>
              </div>
            </div>

            <div v-if="questionType === 'single-choice'" class="question-form">
              <div class="form-group">
                <label for="single-choice-question-text">題目</label>
                <textarea
                  v-model="singleChoiceQuestionText"
                  placeholder="請輸入單選題問題敘述"
                  rows="5"
                  cols="30"
                  required
                ></textarea>
              </div>
              <div v-for="(option, index) in singleChoiceOptions" :key="index">
                <label :for="'single-choice-option' + (index + 1)"
                  >選項 {{ String.fromCharCode(65 + index) }}</label
                >
                <textarea
                  cols="30"
                  rows="1"
                  v-model="singleChoiceOptions[index]"
                  :placeholder="'請輸入選項 ' + String.fromCharCode(65 + index)"
                  required
                ></textarea>
              </div>
              <div class="form-group">
                <label for="single-choice-answer">正確答案</label>

                <div class="answer-group">
                  <input
                    type="radio"
                    v-model="singleChoiceAnswer"
                    :value="1"
                    class="answer-option"
                  />
                  選項 A
                  <input
                    type="radio"
                    v-model="singleChoiceAnswer"
                    :value="2"
                    class="answer-option"
                  />
                  選項 B
                  <input
                    type="radio"
                    v-model="singleChoiceAnswer"
                    :value="3"
                    class="answer-option"
                  />
                  選項 C
                  <input
                    type="radio"
                    v-model="singleChoiceAnswer"
                    :value="4"
                    class="answer-option"
                  />
                  選項 D
                  <input
                    type="radio"
                    v-model="singleChoiceAnswer"
                    :value="5"
                    class="answer-option"
                  />
                  選項 E
                </div>
              </div>
            </div>

            <div
              v-if="questionType === 'multiple-choice'"
              class="question-form"
            >
              <div class="form-group">
                <label for="multiple-choice-question-text">題目</label>
                <textarea
                  v-model="multipleChoiceQuestionText"
                  placeholder="請輸入複選題問題敘述"
                  rows="5"
                  cols="30"
                  required
                ></textarea>
              </div>
              <div
                v-for="(option, index) in multipleChoiceOptions"
                :key="index"
              >
                <label :for="'multiple-choice-option' + (index + 1)"
                  >選項 {{ String.fromCharCode(65 + index) }}</label
                >
                <textarea
                  cols="30"
                  rows="1"
                  v-model="multipleChoiceOptions[index]"
                  :placeholder="'請輸入選項 ' + String.fromCharCode(65 + index)"
                  required
                ></textarea>
              </div>
              <div class="form-group">
                <label for="multiple-choice-answer">正確答案</label>
                <div class="answer-group">
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="1"
                    class="answer-option"
                  />
                  選項 A
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="2"
                    class="answer-option"
                  />
                  選項 B
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="3"
                    class="answer-option"
                  />
                  選項 C
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="4"
                    class="answer-option"
                  />
                  選項 D
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="5"
                    class="answer-option"
                  />
                  選項 E
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
        <h2>目前已提交題目</h2>
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
              
              <td>
                <div v-for="(option, index) in question.options" :key="index">
                  {{ String.fromCharCode(65 + index) }}. {{ option }}
                </div>
              </td>
              <td>
                <div v-if="typeof question.correctAnswer === 'string'">
                  {{
                    String.fromCharCode(
                      65 + question.options.indexOf(question.correctAnswer)
                    )
                  }}. {{ question.correctAnswer }}
                </div>

                <div v-else>
                  <div
                    v-for="(answer, index) in question.correctAnswer"
                    :key="index"
                  >
                    {{
                      String.fromCharCode(
                        65 + question.options.indexOf(answer)
                      )
                    }}. {{ answer }}
                  </div>
                </div>
              </td>
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
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";

const router = useRouter();

const currentQuestionCount = ref(0);
const questionType = ref("true-false");
const trueFalseQuestionText = ref("");
const trueFalseAnswer = ref(null);
const singleChoiceQuestionText = ref("");
const singleChoiceOptions = ref(["", "", "", "", ""]);
const singleChoiceAnswer = ref(null);
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
  trueFalseAnswer.value = null;
  singleChoiceAnswer.value = null;
  multipleChoiceAnswers.value = [];
};

// 使用 computed 屬性來限制顯示的字符數
const truncatedText = computed(() => {
  // 限制顯示前50個字符，超過部分顯示省略號
  return question.value.text.length > 50
    ? question.value.text.slice(0, 50) + "..."
    : question.value.text;
});

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
  // 檢查每一種題型是否選擇了答案
  if (questionType.value === "true-false" && !trueFalseAnswer.value) {
    alert("請選擇正確答案！");
    return; // 防止提交表單
  }

  if (questionType.value === "single-choice" && !singleChoiceAnswer.value) {
    alert("請選擇正確答案！");
    return; // 防止提交表單
  }

  if (
    questionType.value === "multiple-choice" &&
    multipleChoiceAnswers.value.length === 0
  ) {
    alert("請選擇正確答案！");
    return; // 防止提交表單
  } else if (
    questionType.value === "multiple-choice" &&
    multipleChoiceAnswers.value.length === 1
  ) {
    alert("請選取多個正確答案！");
    return;
  }

  // 生成唯一的 questionId (可以根據需求進行調整，這裡用時間戳和隨機數字組合)
  const questionId = `Q${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  let question = {
    questionId, // 自動生成的 questionId
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
    question.options = ["是", "否"];
    question.correctAnswer = trueFalseAnswer.value === "true" ? "是" : "否";
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
    alert("無法讀取測驗資訊！");
  }
});
*/

onMounted(() => {
  const storedExamInfo = JSON.parse(localStorage.getItem("examInfo"));
  if (storedExamInfo) {
    // 更新 examInfo 和 maxQuestions
    Object.assign(examInfo, storedExamInfo);
  } else {
    alert("無法讀取測驗資訊！");
  }
});
</script>

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
  gap: 50px;
  align-items: flex-start;
  height: 97vh;
  max-width: 1300px;
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
  position: relative;
}

.createquestion-content {
  width: 100%;
  height: 100%;
  padding: 20px;
  padding-top: 0;
  box-sizing: border-box;
  overflow-y: auto;
  min-height: 625px;
  /* min-height: 825px */
}

.question-content {
  padding: 0 20px;
  min-height: 600px;
  /* min-height: 800px */
  box-sizing: border-box;
  overflow: hidden; /* 讓內部不要有滾動條 */
}

/* 標題樣式 */
h1,
h2 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333; /* 深色文字 */
}

.question-num {
  font-size: 20px;
  text-align: left;
}

.info {
  text-align: left;
  font-size: 20px;
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
  margin: 10px 0;
  color: #444;
  text-align: left;
}

.answer-option {
  text-align: center;
}

.tf-ans {
  font-weight: normal;
}

/* 輸入文字框樣式 */
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
  height: auto; /* 調整高度 */
  line-height: 1.5; /* 保持字距 */
  text-align: left; /* 讓文字靠左 */
  vertical-align: top; /* 讓游標顯示在上方 */
  white-space: pre-wrap; /* 讓文字在超過邊界時自動換行 */
  word-wrap: break-word; /* 防止長單字超出邊界 */
  resize: none;
}

textarea:focus {
  border-color: #4caf50;
  outline: none;
}

/* 選擇框樣式 */
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

/* 答案群組排列 */
.answer-group {
  display: flex;
  gap: 10px; /* 調整選項之間的間隔 */
  flex-wrap: wrap; /* 讓選項能夠換行，防止太長時超出容器 */
}

/* 按鈕樣式 */
button.button {
  position: sticky;
  bottom: 20px; /* 讓 div A 置於 div B 的底部 */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%);
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

td {
  max-width: 20ch; /* 每行最多顯示 50 個字符 */
  max-height: 100px; /* 設定最大高度，根據需要調整 */
  overflow: hidden; /* 隱藏溢出部分 */
  word-wrap: break-word; /* 超過寬度時換行 */
  white-space: normal; /* 允許換行 */
  text-overflow: ellipsis; /* 使用省略號顯示超出的部分 */
  line-height: 1.5em; /* 調整行高，方便換行顯示 */
  display: table-cell; /* 保持表格單元格的布局 */
  /* vertical-align: top;      */
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
-->
<!-- API-->
<template>
  <div class="container">
    <ErrorModal
      v-model="showError"
      :message="errorMsg"
      @confirm="handleRedirect"
    />

    <div class="createquestion-container">
      <form @submit.prevent="submitQuestion">
        <div class="createquestion-content">
          <h1>出題</h1>
          <div class="question-num">第 {{ currentQuestionCount + 1 }} 題</div>

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
                <textarea
                  v-model="trueFalseQuestionText"
                  placeholder="請輸入是非題問題敘述"
                  rows="5"
                  cols="30"
                  required
                ></textarea>
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
                  <label for="trueOption" class="tf-ans answer-option"
                    >是</label
                  >

                  <input
                    type="radio"
                    id="falseOption"
                    value="false"
                    v-model="trueFalseAnswer"
                  />
                  <label for="falseOption" class="tf-ans answer-option"
                    >否</label
                  >
                </div>
              </div>
            </div>

            <div v-if="questionType === 'single-choice'" class="question-form">
              <div class="form-group">
                <label for="single-choice-question-text">題目</label>
                <textarea
                  v-model="singleChoiceQuestionText"
                  placeholder="請輸入單選題問題敘述"
                  rows="5"
                  cols="30"
                  required
                ></textarea>
              </div>
              <div v-for="(option, index) in singleChoiceOptions" :key="index">
                <label :for="'single-choice-option' + (index + 1)"
                  >選項 {{ String.fromCharCode(65 + index) }}</label
                >
                <textarea
                  cols="30"
                  rows="1"
                  v-model="singleChoiceOptions[index]"
                  :placeholder="'請輸入選項 ' + String.fromCharCode(65 + index)"
                  required
                ></textarea>
              </div>
              <div class="form-group">
                <label for="single-choice-answer">正確答案</label>

                <div class="answer-group">
                  <input
                    type="radio"
                    v-model="singleChoiceAnswer"
                    :value="1"
                    class="answer-option"
                  />
                  選項 A
                  <input
                    type="radio"
                    v-model="singleChoiceAnswer"
                    :value="2"
                    class="answer-option"
                  />
                  選項 B
                  <input
                    type="radio"
                    v-model="singleChoiceAnswer"
                    :value="3"
                    class="answer-option"
                  />
                  選項 C
                  <input
                    type="radio"
                    v-model="singleChoiceAnswer"
                    :value="4"
                    class="answer-option"
                  />
                  選項 D
                  <input
                    type="radio"
                    v-model="singleChoiceAnswer"
                    :value="5"
                    class="answer-option"
                  />
                  選項 E
                </div>
              </div>
            </div>

            <div
              v-if="questionType === 'multiple-choice'"
              class="question-form"
            >
              <div class="form-group">
                <label for="multiple-choice-question-text">題目</label>
                <textarea
                  v-model="multipleChoiceQuestionText"
                  placeholder="請輸入複選題問題敘述"
                  rows="5"
                  cols="30"
                  required
                ></textarea>
              </div>
              <div
                v-for="(option, index) in multipleChoiceOptions"
                :key="index"
              >
                <label :for="'multiple-choice-option' + (index + 1)"
                  >選項 {{ String.fromCharCode(65 + index) }}</label
                >
                <textarea
                  cols="30"
                  rows="1"
                  v-model="multipleChoiceOptions[index]"
                  :placeholder="'請輸入選項 ' + String.fromCharCode(65 + index)"
                  required
                ></textarea>
              </div>
              <div class="form-group">
                <label for="multiple-choice-answer">正確答案</label>
                <div class="answer-group">
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="1"
                    class="answer-option"
                  />
                  選項 A
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="2"
                    class="answer-option"
                  />
                  選項 B
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="3"
                    class="answer-option"
                  />
                  選項 C
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="4"
                    class="answer-option"
                  />
                  選項 D
                  <input
                    type="checkbox"
                    v-model="multipleChoiceAnswers"
                    :value="5"
                    class="answer-option"
                  />
                  選項 E
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
          <div class="info">業務種類：{{ examInfo.categoryName }}</div>
          <div class="info">
            測驗範圍：{{ examInfo.chapterName }} {{ examInfo.partName }}
          </div>
        </div>
        <h2>目前已提交題目</h2>
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
              <td>
                <div v-for="(option, index) in question.options" :key="index">
                  {{ String.fromCharCode(65 + index) }}. {{ option }}
                </div>
              </td>
              <td>
                <div v-if="typeof question.correctAnswer === 'string'">
                  {{
                    String.fromCharCode(
                      65 + question.options.indexOf(question.correctAnswer)
                    )
                  }}. {{ question.correctAnswer }}
                </div>

                <div v-else>
                  <div
                    v-for="(answer, index) in question.correctAnswer"
                    :key="index"
                  >
                    {{
                      String.fromCharCode(
                        65 + question.options.indexOf(answer)
                      )
                    }}. {{ answer }}
                  </div>
                </div>
              </td>
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
import axios from "axios";
import ErrorModal from "../../../components/APIerror.vue";

const router = useRouter();

// 控制錯誤視窗顯示與否
const showError = ref(false);

// 儲存錯誤訊息
const errorMsg = ref({
  status: 0,
  code: 0,
  message: "",
});

const currentQuestionCount = ref(0);
const questionType = ref("true-false");
const trueFalseQuestionText = ref("");
const trueFalseAnswer = ref(null);
const singleChoiceQuestionText = ref("");
const singleChoiceOptions = ref(["", "", "", "", ""]);
const singleChoiceAnswer = ref(null);
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
  trueFalseAnswer.value = null;
  singleChoiceAnswer.value = null;
  multipleChoiceAnswers.value = [];
};

// 取得登入者 ID
// const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

const submitQuestion = () => {
  // 檢查每一種題型是否選擇了答案
  if (questionType.value === "true-false" && !trueFalseAnswer.value) {
    alert("請選擇正確答案！");
    return; // 防止提交表單
  }

  if (questionType.value === "single-choice" && !singleChoiceAnswer.value) {
    alert("請選擇正確答案！");
    return; // 防止提交表單
  }

  if (
    questionType.value === "multiple-choice" &&
    multipleChoiceAnswers.value.length === 0
  ) {
    alert("請選擇正確答案！");
    return; // 防止提交表單
  } else if (
    questionType.value === "multiple-choice" &&
    multipleChoiceAnswers.value.length === 1
  ) {
    alert("請選取多個正確答案！");
    return;
  }

  let questionData = {
    question: "",
    categoryId: examInfo.categoryId,
    chapterId: examInfo.chapterId,
    partId: examInfo.partId,
    questionType: questionType.value.replace("-", "_"),
    // creatorId: loggedInUser ? loggedInUser.empId : null, // 確保有取得使用者ID
    // creatorId: loggedInUser ? String(loggedInUser.empId) : null, // 強制轉換為 string
    optionItemList: [],
  };

  // 根據題型不同，填充不同的資料
  if (questionType.value === "true-false") {
    questionData.question = trueFalseQuestionText.value;
    questionData.optionItemList = [
      { content: "是", isCorrect: trueFalseAnswer.value === "true" },
      { content: "否", isCorrect: trueFalseAnswer.value === "false" },
    ];
  } else if (questionType.value === "single-choice") {
    questionData.question = singleChoiceQuestionText.value;
    const options = singleChoiceOptions.value.map((option, index) => {
      return {
        content: option,
        isCorrect: singleChoiceAnswer.value === index + 1,
      };
    });
    questionData.optionItemList = options;
  } else if (questionType.value === "multiple-choice") {
    questionData.question = multipleChoiceQuestionText.value;
    const options = multipleChoiceOptions.value.map((option, index) => {
      return {
        content: option,
        isCorrect: multipleChoiceAnswers.value.includes(index + 1),
      };
    });
    questionData.optionItemList = options;
  }

  currentQuestionCount.value++;
  changeQuestionType(); // 清空表單

  // 發送 API 請求
  submitToAPI(questionData);
};

// submitToAPI 函式
const submitToAPI = async (questionData) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.post(
      "http://172.16.46.163/csexam/admin/question",
      questionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.code === "0000") {
      console.log("題目提交成功！");

      // 顯示新題目
      const newQuestion = {
        text: questionData.question,
        type: questionData.questionType.replace("_", "-"),
        options: questionData.optionItemList.map((item) => item.content),
        correctAnswer: questionData.optionItemList
          .filter((item) => item.isCorrect)
          .map((item) => item.content),
      };

      submittedQuestions.value.push(newQuestion);
    } else {
      alert(response.data.message || "題目提交失敗，請稍後再試！");
    }
  } catch (error) {
    console.error("提交題目失敗", error);
    if (error.response) {
      if (error.response.data.code) {
        alert(error.response.data.message);
      } else {
        alert("錯誤訊息:", error.response.data.message);
      }
    } else {
      alert("發生錯誤，請稍後再試");
    }

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
    } else if (error.request) {
      // 請求已發送但沒有收到回應
      errorMsg.value = {
        status: "timeout",
        code: 0,
        message: "伺服器回應超時，請稍後再試",
      };
    } else {
      // 發生其他錯誤（例如設定錯誤等）
      errorMsg.value = {
        status: 0,
        code: 0,
        message: "發生未知錯誤，請稍後再試",
      };
    }
    // 顯示錯誤視窗
    showError.value = true;
  }
};

// 結束出題
const endCreateQuestion = () => {
  localStorage.setItem("examInfo", JSON.stringify({}));
  router.push("/create_question");
};

// 當錯誤視窗按下確認後跳轉到首頁
const handleRedirect = () => {
  showError.value = false; // 關閉錯誤視窗
  router.push("/"); // 跳轉到首頁
};

onMounted(() => {
  const storedExamInfo = JSON.parse(localStorage.getItem("examInfo"));
  if (storedExamInfo) {
    // 更新 examInfo 和 maxQuestions
    Object.assign(examInfo, storedExamInfo);
  } else {
    alert("無法讀取測驗資訊！");
    router.push("/create_question");
  }
});
</script>

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
  gap: 50px;
  align-items: flex-start;
  height: 97vh;
  max-width: 1300px;
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
  position: relative;
}

.createquestion-content {
  width: 100%;
  height: 100%;
  padding: 20px;
  padding-top: 0;
  box-sizing: border-box;
  overflow-y: auto;
  min-height: 825px;
}

.question-content {
  padding: 0 20px;
  min-height: 800px;
  box-sizing: border-box;
  overflow: hidden; /* 讓內部不要有滾動條 */
}

/* 標題樣式 */
h1,
h2 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333; /* 深色文字 */
}

.question-num {
  font-size: 20px;
  text-align: left;
}

.info {
  text-align: left;
  font-size: 20px;
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
  margin: 10px 0;
  color: #444;
  text-align: left;
}

.answer-option {
  text-align: center;
}

.tf-ans {
  font-weight: normal;
}

/* 輸入文字框樣式 */
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
  height: auto; /* 調整高度 */
  line-height: 1.5; /* 保持字距 */
  text-align: left; /* 讓文字靠左 */
  vertical-align: top; /* 讓游標顯示在上方 */
  white-space: pre-wrap; /* 讓文字在超過邊界時自動換行 */
  word-wrap: break-word; /* 防止長單字超出邊界 */
  resize: none;
}

textarea:focus {
  border-color: #4caf50;
  outline: none;
}

/* 選擇框樣式 */
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

/* 答案群組排列 */
.answer-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* 按鈕樣式 */
button.button {
  position: sticky;
  bottom: 20px; /* 讓 div A 置於 div B 的底部 */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%);
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
-->
