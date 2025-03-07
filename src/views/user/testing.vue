<template>
  <div class="exam-container">
    <header class="exam-header">
      <button class="back-button">返回測驗</button>
      <h1>單元學習評量</h1>
      <div class="score-info">試卷得分 <span>100</span></div>
    </header>

    <div class="content">
      <div class="answer-card">
        <h3>答題卡</h3>
        <div class="question-box correct">1</div>
      </div>

      <div class="question-section">
        <h2>第二週課程學習檢核</h2>
        <p>
          1. 叢計算可以視為雲端運算的延伸，這個架構可以將運算需求
          <span class="blank">(1)</span> 和 <span class="blank">(2)</span>
          處理，以化解可能出現的網路塞車現象。
        </p>

        <div class="fill-in-the-blanks">
          <label>①</label>
          <input type="text" v-model="answer1" disabled value="分層次" />
          <label>②</label>
          <input type="text" v-model="answer2" disabled value="分割區域" />
        </div>

        <div class="correct-answers">
          <h3>正確答案：</h3>
          <p>① 分層次</p>
          <p>② 分割區域</p>
        </div>

        <div class="explanation">
          <h3>答案解釋：</h3>
          <p>詳細課程教材 Chapter 0 - Bridge-In 單元之叢計算的定義。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const answer1 = ref("分層次");
const answer2 = ref("分割區域");
</script>


<style scoped>
.exam-container {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: auto;
}
.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #333;
  color: white;
  padding: 10px;
  border-radius: 5px;
}
.back-button {
  background: white;
  color: black;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
.content {
  display: flex;
  margin-top: 20px;
}
.answer-card {
  width: 20%;
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}
.question-box {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: green;
  color: white;
  line-height: 30px;
  border-radius: 50%;
}
.question-section {
  width: 75%;
  padding: 20px;
  border: 1px solid #ddd;
}
.fill-in-the-blanks {
  margin-top: 10px;
}
.fill-in-the-blanks input {
  display: block;
  margin: 5px 0;
  padding: 5px;
}
.correct-answers,
.explanation {
  margin-top: 15px;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
}
</style>
