<!-- chatgpt直接轉的

<template>
  <div>
    <h1>考試題目管理</h1>
    <div id="exam-info">
      <p id="exam-category">業務種類: {{ examInfo.category }}</p>
      <p id="exam-range">
        測驗範圍: {{ examInfo.chapter }} {{ examInfo.section }}
      </p>
      <p id="exam-questions">題數: {{ examInfo.questions }}</p>
    </div>

    <div id="question-type-selector">
      <label for="question-type">選擇題型:</label>
      <select v-model="questionType" @change="changeQuestionType">
        <option value="true-false">是非題</option>
        <option value="single-choice">單選題</option>
        <option value="multiple-choice">多選題</option>
      </select>
    </div>

    
    <div v-if="questionType === 'true-false'" id="true-false-question">
      <input
        v-model="questionText"
        type="text"
        placeholder="請輸入是非題題目"
      />
      <select v-model="correctAnswerText">
        <option value="對">對</option>
        <option value="錯">錯</option>
      </select>
    </div>

    <div v-if="questionType === 'single-choice'" id="single-choice-question">
      <input
        v-model="questionText"
        type="text"
        placeholder="請輸入單選題題目"
      />
      <div v-for="n in 5" :key="n">
        <input v-model="optionsText[n - 1]" :placeholder="'請輸入選項 ' + n" />
      </div>
      <select v-model="correctAnswerText">
        <option v-for="n in 5" :key="n" :value="'選項 ' + n">
          {{ "選項 " + n }}
        </option>
      </select>
    </div>

    <div
      v-if="questionType === 'multiple-choice'"
      id="multiple-choice-question"
    >
      <input
        v-model="questionText"
        type="text"
        placeholder="請輸入多選題題目"
      />
      <div v-for="n in 5" :key="n">
        <input v-model="optionsText[n - 1]" :placeholder="'請輸入選項 ' + n" />
        <input
          type="checkbox"
          v-model="correctAnswerText[n - 1]"
          :value="'選項 ' + n"
        />
        正確答案
      </div>
    </div>

    <button @click="submitQuestion">提交題目</button>

    <h2>已提交的題目</h2>
    <table>
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
        <tr v-for="(question, index) in questions" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ question.type }}</td>
          <td>{{ question.text }}</td>
          <td>{{ question.options.join(" | ") }}</td>
          <td>{{ question.correctAnswer }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";

export default {
  name: "App",
  setup() {
    const examInfo = reactive({
      category: "",
      chapter: "",
      section: "",
      questions: 0,
    });

    const questionType = ref("true-false");
    const questionText = ref("");
    const optionsText = ref(["", "", "", "", ""]);
    const correctAnswerText = ref("");
    const questions = ref([]);

    const currentQuestionCount = ref(0);
    const maxQuestions = ref(0);

    onMounted(() => {
      // 讀取儲存在 localStorage 中的考試資訊
      const storedExamInfo = JSON.parse(localStorage.getItem("examInfo"));
      if (storedExamInfo) {
        examInfo.category = storedExamInfo.category;
        examInfo.chapter = storedExamInfo.chapter;
        examInfo.section = storedExamInfo.section;
        examInfo.questions = storedExamInfo.questions;
        maxQuestions.value = storedExamInfo.questions;
      } else {
        alert("無法讀取考試資訊！請先設定考試資訊。");
      }

      // 從 localStorage 讀取題目資料
      const storedQuestions =
        JSON.parse(localStorage.getItem("questions")) || [];
      questions.value = storedQuestions;
    });

    const changeQuestionType = () => {
      questionText.value = "";
      optionsText.value = ["", "", "", "", ""];
      correctAnswerText.value = "";
    };

    const submitQuestion = () => {
      if (currentQuestionCount.value >= maxQuestions.value) {
        alert("已達到最大題數，無法再提交題目！");
        return;
      }

      let correctAnswer = correctAnswerText.value;

      if (questionType.value === "true-false") {
        correctAnswer = correctAnswerText.value;
      } else if (questionType.value === "single-choice") {
        correctAnswer =
          "選項 " +
          (optionsText.value.indexOf(correctAnswerText.value) + 1) +
          ": " +
          correctAnswerText.value;
      } else if (questionType.value === "multiple-choice") {
        correctAnswer = correctAnswerText.value.join(", ");
      }

      const newQuestion = {
        type: questionType.value,
        text: questionText.value,
        options: optionsText.value.filter((option) => option !== ""),
        correctAnswer,
      };

      questions.value.push(newQuestion);

      localStorage.setItem("questions", JSON.stringify(questions.value));

      currentQuestionCount.value++;

      // 重置題目輸入框
      changeQuestionType();
    };

    return {
      examInfo,
      questionType,
      questionText,
      optionsText,
      correctAnswerText,
      questions,
      submitQuestion,
      changeQuestionType,
    };
  },
};
</script>

<style scoped>
/* 這裡可以加入樣式 */
</style>
-->

<!-- 只有美編，但醜
<template>
  <div>
    <div class="container">
      <h1>出題</h1>

      <div id="current-question-number"></div>

      <div class="form-group">
        <label for="question-type">選擇題型</label>
        <select
          id="question-type"
          name="question-type"
          class="question-type"
          onchange="changeQuestionType()"
        >
          <option value="true-false">是非題</option>
          <option value="single-choice">單選題</option>
          <option value="multiple-choice">複選題</option>
        </select>
      </div>

      <div id="true-false-question" class="question-form">
        <div class="form-group">
          <label for="true-false-question-text">題目</label>
          <input
            type="text"
            id="true-false-question-text"
            placeholder="請輸入是非題問題"
          />
        </div>
        <div class="form-group">
          <label for="true-false-answer">答案</label>
          <select id="true-false-answer">
            <option value="true">對</option>
            <option value="false">錯</option>
          </select>
        </div>
      </div>

      <div
        id="single-choice-question"
        class="question-form"
        style="display: none"
      >
        <div class="form-group">
          <label for="single-choice-question-text">題目</label>
          <input
            type="text"
            id="single-choice-question-text"
            placeholder="請輸入單選題問題"
          />
        </div>
        <div id="single-choice-options" class="option-group">
          <div>
            <label for="single-choice-option1">選項 1</label>
            <input
              type="text"
              id="single-choice-option1"
              placeholder="請輸入選項 1"
            />
          </div>
          <div>
            <label for="single-choice-option2">選項 2</label>
            <input
              type="text"
              id="single-choice-option2"
              placeholder="請輸入選項 2"
            />
          </div>
          <div>
            <label for="single-choice-option3">選項 3</label>
            <input
              type="text"
              id="single-choice-option3"
              placeholder="請輸入選項 3"
            />
          </div>
          <div>
            <label for="single-choice-option4">選項 4</label>
            <input
              type="text"
              id="single-choice-option4"
              placeholder="請輸入選項 4"
            />
          </div>
          <div>
            <label for="single-choice-option5">選項 5</label>
            <input
              type="text"
              id="single-choice-option5"
              placeholder="請輸入選項 5"
            />
          </div>
        </div>
        <div class="form-group">
          <label for="single-choice-answer">正確答案</label>
          <select id="single-choice-answer">
            <option value="1">選項 1</option>
            <option value="2">選項 2</option>
            <option value="3">選項 3</option>
            <option value="4">選項 4</option>
            <option value="5">選項 5</option>
          </select>
        </div>
      </div>

      <div
        id="multiple-choice-question"
        class="question-form"
        style="display: none"
      >
        <div class="form-group">
          <label for="multiple-choice-question-text">題目</label>
          <input
            type="text"
            id="multiple-choice-question-text"
            placeholder="請輸入複選題問題"
          />
        </div>
        <div id="multiple-choice-options" class="option-group">
          <div>
            <label for="multiple-choice-option1">選項 1</label>
            <input
              type="text"
              id="multiple-choice-option1"
              placeholder="請輸入選項 1"
            />
          </div>
          <div>
            <label for="multiple-choice-option2">選項 2</label>
            <input
              type="text"
              id="multiple-choice-option2"
              placeholder="請輸入選項 2"
            />
          </div>
          <div>
            <label for="multiple-choice-option3">選項 3</label>
            <input
              type="text"
              id="multiple-choice-option3"
              placeholder="請輸入選項 3"
            />
          </div>
          <div>
            <label for="multiple-choice-option4">選項 4</label>
            <input
              type="text"
              id="multiple-choice-option4"
              placeholder="請輸入選項 4"
            />
          </div>
          <div>
            <label for="multiple-choice-option5">選項 5</label>
            <input
              type="text"
              id="multiple-choice-option5"
              placeholder="請輸入選項 5"
            />
          </div>
        </div>
        <div class="form-group">
          <label for="multiple-choice-answer">正確答案</label>
          <div class="option-group" id="multiple-choice-answer-group">
            <input type="checkbox" id="multiple-choice-answer1" value="1" />
            選項 1
            <input type="checkbox" id="multiple-choice-answer2" value="2" />
            選項 2
            <input type="checkbox" id="multiple-choice-answer3" value="3" />
            選項 3
            <input type="checkbox" id="multiple-choice-answer4" value="4" />
            選項 4
            <input type="checkbox" id="multiple-choice-answer5" value="5" />
            選項 5
          </div>
        </div>
      </div>

      <div class="form-group">
        <button class="button" onclick="submitQuestion()">提交題目</button>
      </div>
    </div>

    <div class="container">
      <h1>考試資訊</h1>
      <div id="exam-category"></div>
      <div id="exam-range"></div>
      <div id="exam-questions"></div>

      <h2>已提交題目</h2>
      <table
        id="questions-table"
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
        <tbody id="questions-body">
         
        </tbody>
      </table>

      <div class="form-group">
        <button
          class="button"
          id="end-question-button"
          onclick="end_create_question()"
        >
          結束出題
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

.container {
  margin: 30px auto;
  max-width: 1200px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  margin-top: 6px;
}

.range-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.range-group input {
  width: 80px;
  text-align: center;
}

.button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 8px;
  width: 100%;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #45a049;
}

.question-type {
  margin-bottom: 20px;
}

.option-group div {
  margin-bottom: 15px;
}

.remove-option {
  color: red;
  cursor: pointer;
  font-size: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #4caf50;
  color: white;
}

tr:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  h1 {
    font-size: 24px;
  }

  .button {
    font-size: 16px;
  }
}
/*
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        input[type="text"] {
            width: 100%;
            padding: 8px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        input[type="number"] {
            width: 10%;
            padding: 8px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .container {
            margin: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .range-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .range-group span {
            white-space: nowrap; 
            font-size: 16px; 
        }

        .range-group input {
            width: 40px; 
            text-align: center; 
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            text-align: left;
        }
        
        .button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 4px;
        }
        .button:hover {
            background-color: #45a049;
        }
        .question-type {
            margin-bottom: 10px;
        }
        .option-group {
            margin-left: 20px;
        }
        .option-group div {
            margin-bottom: 10px;
        }
        .remove-option {
            color: red;
            cursor: pointer;
        }
        */
</style>

-->

<template>
  <div class="container">
    <h1>出題</h1>

    <!-- 顯示當前出題的題號 -->
    <div>{{ currentQuestionCount + 1 }} 題</div>

    <!-- 顯示題型選擇 -->
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

    <!-- 是非題 -->
    <div v-if="questionType === 'true-false'" class="question-form">
      <div class="form-group">
        <label for="true-false-question-text">題目</label>
        <input
          type="text"
          v-model="trueFalseQuestionText"
          placeholder="請輸入是非題問題"
        />
      </div>
      <div class="form-group">
        <label for="true-false-answer">答案</label>
        <select v-model="trueFalseAnswer">
          <option value="true">對</option>
          <option value="false">錯</option>
        </select>
      </div>
    </div>

    <!-- 單選題 -->
    <div v-if="questionType === 'single-choice'" class="question-form">
      <div class="form-group">
        <label for="single-choice-question-text">題目</label>
        <input
          type="text"
          v-model="singleChoiceQuestionText"
          placeholder="請輸入單選題問題"
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
        />
      </div>
      <div class="form-group">
        <label for="single-choice-answer">正確答案</label>
        <select v-model="singleChoiceAnswer">
          <option
            v-for="(option, index) in singleChoiceOptions"
            :key="index"
            :value="index + 1"
          >
            選項 {{ index + 1 }}
          </option>
        </select>
      </div>
    </div>

    <!-- 複選題 -->
    <div v-if="questionType === 'multiple-choice'" class="question-form">
      <div class="form-group">
        <label for="multiple-choice-question-text">題目</label>
        <input
          type="text"
          v-model="multipleChoiceQuestionText"
          placeholder="請輸入複選題問題"
        />
      </div>
      <div v-for="(option, index) in multipleChoiceOptions" :key="index">
        <label :for="'multiple-choice-option' + (index + 1)"
          >選項 {{ index + 1 }}</label
        >
        <input
          type="text"
          v-model="multipleChoiceOptions[index]"
          :placeholder="'請輸入選項 ' + (index + 1)"
        />
      </div>
      <div class="form-group">
        <label for="multiple-choice-answer">正確答案</label>
        <div class="option-group">
          <input type="checkbox" v-model="multipleChoiceAnswers" :value="1" />
          選項 1
          <input type="checkbox" v-model="multipleChoiceAnswers" :value="2" />
          選項 2
          <input type="checkbox" v-model="multipleChoiceAnswers" :value="3" />
          選項 3
          <input type="checkbox" v-model="multipleChoiceAnswers" :value="4" />
          選項 4
          <input type="checkbox" v-model="multipleChoiceAnswers" :value="5" />
          選項 5
        </div>
      </div>
    </div>

    <div class="form-group">
      <button class="button" @click="submitQuestion">提交題目</button>
    </div>

    <div class="container">
      <h1>考試資訊</h1>
      <div>{{ examInfo.category }}</div>
      <div>{{ examInfo.chapter }} - {{ examInfo.section }}</div>
      <div>{{ examInfo.questions }}</div>

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
            <td>{{ question.type }}</td>
            <td>{{ question.text }}</td>
            <td>{{ question.options.join(", ") }}</td>
            <td>{{ question.correctAnswer }}</td>
          </tr>
        </tbody>
      </table>

      <div class="form-group">
        <button class="button" @click="endCreateQuestion">結束出題</button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      currentQuestionCount: 0,
      maxQuestions: 0,
      questionType: "true-false",
      trueFalseQuestionText: "",
      trueFalseAnswer: "true",
      singleChoiceQuestionText: "",
      singleChoiceOptions: ["", "", "", "", ""],
      singleChoiceAnswer: 1,
      multipleChoiceQuestionText: "",
      multipleChoiceOptions: ["", "", "", "", ""],
      multipleChoiceAnswers: [],
      examInfo: {},
      submittedQuestions: []
    };
  },
  methods: {
    changeQuestionType() {
      this.trueFalseQuestionText = "";
      this.singleChoiceQuestionText = "";
      this.multipleChoiceQuestionText = "";
      this.singleChoiceOptions = ["", "", "", "", ""];
      this.multipleChoiceOptions = ["", "", "", "", ""];
      this.multipleChoiceAnswers = [];
    },
    submitQuestion() {
      if (this.currentQuestionCount >= this.maxQuestions) {
        alert("已達到最大題數，無法再提交題目！");
        return;
      }

      let question = {
        type: this.questionType,
        text: "",
        options: [],
        correctAnswer: ""
      };

      if (this.questionType === "true-false") {
        question.text = this.trueFalseQuestionText;
        question.correctAnswer = this.trueFalseAnswer === "true" ? "對" : "錯";
      } else if (this.questionType === "single-choice") {
        question.text = this.singleChoiceQuestionText;
        question.options = this.singleChoiceOptions;
        question.correctAnswer = `選項 ${this.singleChoiceAnswer}`;
      } else if (this.questionType === "multiple-choice") {
        question.text = this.multipleChoiceQuestionText;
        question.options = this.multipleChoiceOptions;
        question.correctAnswer = this.multipleChoiceAnswers.join(", ");
      }

      this.submittedQuestions.push(question);
      this.currentQuestionCount++;

      this.changeQuestionType();
    },
    endCreateQuestion() {
      if (this.currentQuestionCount >= this.maxQuestions) {
        // logic for ending the question creation
      } else {
        alert("請先達到最大題數再結束出題！");
      }
    }
  },
  mounted() {
    let examInfo = JSON.parse(localStorage.getItem("examInfo"));
    if (examInfo) {
      this.examInfo = examInfo;
      this.maxQuestions = parseInt(examInfo.questions);
    } else {
      alert("無法讀取考試資訊！");
    }
  }
};
</script>




