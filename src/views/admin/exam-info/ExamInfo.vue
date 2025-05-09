<template>
  <div class="container">
    <ErrorModal
      v-model="showError"
      :message="errorMsg"
      @confirm="handleRedirect"
    />
    <AdminNavBar />
    <div class="content">
      <button class="back-btn" @click="goBack">
        <i class="arrow-icon">＜</i> 返回
      </button>

      <div class="exam-info-card">
        <h2>{{ exam.examName }}</h2>
        <div :class="['status-wrapper', exam.status]">
          <p class="status-tag">
            <span class="status-icon">
              <i
                v-if="exam.status === 'ongoing'"
                class="fas fa-hourglass-half"
                :class="'icon-ongoing'"
              ></i>
              <i
                v-else-if="exam.status === 'done'"
                class="fas fa-check-circle"
                :class="'icon-done'"
              ></i>
              <i
                v-else-if="exam.status === 'canceled'"
                class="fas fa-times-circle"
                :class="'icon-canceled'"
              ></i>
            </span>
            測驗{{ getStatusName(exam.status) }}
          </p>
        </div>
        <div class="exam-info-content">
          <div class="exam-info-text">
            <p>及格分數：{{ exam.targetScore }} 分</p>
            <p>答題時間：{{ exam.limitTime }} 分鐘</p>

            <p>測驗出題者員工編號：{{ exam.creatorId }}</p>
            <p>
              測驗進行日期：{{ exam.startDate?.replaceAll("-", "/") }} ~
              {{ exam.endDate?.replaceAll("-", "/") }}
              <button class="edit-time-btn" @click="showModal = true">
                修改測驗日期
              </button>
            </p>
          </div>

          <table class="exam-range-table">
            <thead>
              <tr>
                <th
                  colspan="4"
                  style="
                    text-align: center;
                    font-size: 18px;
                    background-color: #b3e0ff;
                  "
                >
                  測驗範圍
                </th>
              </tr>
              <tr>
                <th>業務種類</th>
                <th>章</th>
                <th>節</th>
                <th>題數</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>存款篇</td>
                <td>第一章通則</td>
                <td>01-01 存款經辦員應有之認識</td>
                <td>5</td>
              </tr>
              <tr>
                <td>存款篇</td>
                <td>第一章通則</td>
                <td>01-02 存款種類</td>
                <td>5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn" @click="setupMakeupExam">設定補考測驗</button>
        <button class="btn" @click="openMakeupExam">開啟補考測驗</button>
        <button
          class="btn"
          @click="viewMakeupRecords"
          :class="{
            'original-score': isOriginalScore,
            'makeup-score': !isOriginalScore,
          }"
        >
          {{ score_btn_Text }}
        </button>
        <button class="btn" @click="exportGrades">匯出成績</button>
      </div>

      <!-- 成績表格 -->
      <div class="exam-score" v-show="isOriginalScore">
        <!-- 搜尋欄位和搜尋按鈕 -->
        <div class="search-bar">
          <h2>成績</h2>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜尋員工編號或姓名"
            @keyup.enter="filterRecords"
          />
          <button class="search-btn" @click="filterRecords">搜尋</button>
        </div>
        <!-- 成績表格 -->
        <table class="exam-records-table">
          <thead>
            <tr>
              <th>索引</th>
              <th>員工編號</th>
              <th>姓名</th>
              <th>第一次測驗交卷時間</th>
              <th>第一次測驗成績</th>
              <th>第一次測驗及格與否</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredRecords.length === 0">
              <td colspan="7" class="text-center">沒有資料</td>
            </tr>
            <tr v-for="(record, index) in filteredRecords" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ record.empId }}</td>
              <td>{{ record.userName }}</td>
              <td>{{ record.submissionTime }}</td>
              <td>{{ record.score }}</td>
              <td :class="record.pass === '及格' ? 'text-green' : 'text-red'">
                {{ record.pass }}
              </td>
              <td>
                <button class="view-record-btn" @click="viewAnswerRecord">
                  答題記錄
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 補考名單表格 -->
      <div class="exam-score" v-show="!isOriginalScore">
        <!-- 搜尋欄位和搜尋按鈕 -->
        <div class="search-bar">
          <h2>補考名單</h2>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜尋員工編號或姓名"
            @keyup.enter="makeupSearch"
          />
          <button class="search-btn" @click="makeupSearch">搜尋</button>
        </div>

        <table class="exam-records-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                />全選
              </th>
              <th>索引</th>
              <th>員工編號</th>
              <th>姓名</th>
              <th>狀態</th>
              <th>第一次測驗交卷時間</th>
              <th>第一次測驗成績</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="makeupfilteredRecords.length === 0">
              <td colspan="8" class="text-center">沒有資料</td>
            </tr>
            <tr v-for="(record, index) in makeupfilteredRecords" :key="index">
              <td>
                <input
                  v-if="record.status === 'pending'"
                  type="checkbox"
                  :checked="isSelected(record)"
                  @change="toggleEmployeeSelection(record)"
                />
              </td>
              <td>{{ index + 1 }}</td>
              <td>{{ record.empId }}</td>
              <td>{{ record.userName }}</td>
              <td>
                <span
                  :class="{
                    'badge-blue': record.status === 'ongoing',
                    'badge-green': record.status === 'done',
                    'badge-brown': record.status === 'pending',
                  }"
                >
                  <span
                    class="status-circle"
                    :style="{
                      backgroundColor:
                        record.status === 'ongoing'
                          ? '#456ee7'
                          : record.status === 'done'
                          ? '#28a745' // 已完成顯示綠色
                          : record.status === 'pending'
                          ? '#8e6034'
                          : '#8e6034', // 待處理顯示黃色，預設顯示棕色
                    }"
                  ></span>
                  {{ getMakeupStatusName(record.status) }}
                </span>
              </td>

              <td>{{ record.submissionTime }}</td>
              <td>{{ record.score }}</td>
              <td>
                <button class="delete-makeup-btn" @click="deleteMakeup">
                  刪除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 修改作答時間 modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <button @click="showModal = false" class="close-btn">×</button>
          <h3>修改作答時間</h3>
          <label class="modal-label">
            <span class="label-text">開始時間：</span>
            <input type="date" v-model="newStartTime" class="modal-input" />
          </label>
          <label class="modal-label">
            <span class="label-text">結束時間：</span>
            <input type="date" v-model="newEndTime" class="modal-input" />
          </label>
          <div class="modal-actions">
            <button @click="confirmEdit" class="confirm-btn">確認</button>
            <button @click="showModal = false" class="cancel-btn">取消</button>
          </div>
        </div>
      </div>

      <!-- 補考設定 Modal -->
      <div v-if="showMakeupModal" class="makeup-modal-overlay">
        <div class="makeup-modal">
          <button @click="showMakeupModal = false" class="close-btn">×</button>
          <h3>設定補考測驗</h3>
          <div class="form-group">
            <label>測驗名稱：</label>
            <p class="exam-name">{{ exam.examName }}</p>
          </div>
          <div class="form-group">
            <label>及格分數：</label>
            <input
              type="number"
              v-model="makeupTargetScore"
              min="1"
              @keyup.enter="submitMakeupExam"
            />
          </div>
          <div class="form-group">
            <label>補考開始日期：</label>
            <input type="date" v-model="makeupStartDate" class="date-input" />
          </div>
          <div class="form-group">
            <label>補考結束日期：</label>
            <input type="date" v-model="makeupEndDate" class="date-input" />
          </div>
          <div class="form-group">
            <label>答題時間(分鐘)：</label>
            <input
              type="number"
              v-model="makeupLimitTime"
              min="1"
              @keyup.enter="submitMakeupExam"
            />
          </div>
          <div class="modal-actions">
            <button @click="submitMakeupExam" class="confirm-btn">確認</button>
            <button @click="showMakeupModal = false" class="cancel-btn">
              取消
            </button>
          </div>
        </div>
      </div>

      <!-- 補考設定(有選人設定) Modal 
      <div v-if="showMakeupModal" class="makeup-modal-overlay">
        <div class="makeup-modal">
          <button @click="showMakeupModal = false" class="close-btn">×</button>
          <h3>設定補考測驗</h3>
          <div
            class="status-bar"
            :class="{
              'status-bar-selected': selectedRecords.length > 0,
              'status-bar-unselected': selectedRecords.length === 0,
            }"
          >
            <span v-if="selectedRecords.length > 0">
              <i class="fas fa-check-circle"></i>
              已選擇 {{ selectedRecords.length }} 名同仁，請設置補考其他事項
            </span>
            <span v-else>
              <i class="fas fa-exclamation-triangle"></i>
              尚未選擇任何同仁
            </span>
          </div>
          <div class="form-group">
            <label>測驗名稱：</label>
            <p class="exam-name">{{ exam.examName }}</p>
          </div>
          <div class="form-group">
            <label>及格分數：</label>
            <input
              type="number"
              v-model="makeupTargetScore"
              min="1"
              @keyup.enter="submitMakeupExam"
            />
          </div>
          <div class="form-group">
            <label>補考開始日期：</label>
            <input type="date" v-model="makeupStartDate" class="date-input" />
          </div>
          <div class="form-group">
            <label>補考結束日期：</label>
            <input type="date" v-model="makeupEndDate" class="date-input" />
          </div>
          <div class="form-group">
            <label>答題時間(分鐘)：</label>
            <input
              type="number"
              v-model="makeupLimitTime"
              min="1"
              @keyup.enter="submitMakeupExam"
            />
          </div>
          <div class="modal-actions">
            <button @click="submitMakeupExam" class="confirm-btn">確認</button>
            <button @click="showMakeupModal = false" class="cancel-btn">
              取消
            </button>
          </div>
        </div>
      </div>
      -->

      <!-- 選擇員工補考 modal -->
      <div v-if="showSelectModal" class="modal-overlay">
        <div class="modal">
          <button @click="showSelectModal = false" class="close-btn">×</button>
          <h3>選擇補考員工</h3>
          <div
            class="status-bar"
            :class="{
              'status-bar-selected': selectedRecords.length > 0,
              'status-bar-unselected': selectedRecords.length === 0,
            }"
          >
            <span v-if="selectedRecords.length > 0">
              <i class="fas fa-check-circle"></i>
              已選擇 {{ selectedRecords.length }} 名同仁，請確認已完成補考設定
            </span>
            <span v-else>
              <i class="fas fa-exclamation-triangle"></i>
              尚未選擇任何同仁
            </span>
          </div>
          <table v-if="selectedRecords.length > 0" class="selected-table">
            <thead>
              <tr>
                <th>員工編號</th>
                <th>姓名</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in selectedRecords" :key="record.empId">
                <td>{{ record.empId }}</td>
                <td>{{ record.userName }}</td>
              </tr>
            </tbody>
          </table>

          <!-- <ul>
            <li v-for="(record, index) in makeupfilteredRecords" :key="index">
              <input
                type="checkbox"
                :value="record.empId"
                v-model="selectedEmployees"
              />
              {{ record.userName }} (ID: {{ record.empId }})
            </li>
          </ul> -->
          <div class="modal-actions">
            <button @click="startMakeupExam" class="confirm-btn">
              開啟補考
            </button>
            <button @click="showSelectModal = false" class="cancel-btn">
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminNavBar from "../../../components/AdminNavBar.vue";
import ErrorModal from "../../../components/APIerror.vue";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useIdleLogout } from "../../../composables/useIdleLogout";

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

// 按鈕顯示的文字
const score_btn_Text = ref("查看補考名單");

const isOriginalScore = ref(true); // 顯示哪個成績表格 預設是True: 原始，False:補考

const showModal = ref(false);
const newStartTime = ref("");
const newEndTime = ref("");

const showMakeupModal = ref(false);
const makeupLimitTime = ref("");
const makeupStartDate = ref("");
const makeupEndDate = ref("");
const makeupTargetScore = ref("");

const showSelectModal = ref(false); // 控制選擇員工 modal 顯示與否
const selectedEmployees = ref([]); // 儲存選中的員工

const exam = ref({});

// 儲存選擇的員工ID
const selectedRecords = ref([]);

// 儲存是否選擇了全選
const selectAll = ref(false);

// 假資料
const records = ref([
  {
    empId: "2025001",
    userName: "張三",
    submissionTime: "2025.04.14 11:20",
    score: 85,
    pass: "及格",
  },
  {
    empId: "2025002",
    userName: "李四",
    submissionTime: "2025.04.14 11:25",
    score: 78,
    pass: "及格",
  },
  {
    empId: "0123456",
    userName: "小明",
    submissionTime: "2025.04.14 13:25",
    score: 58,
    pass: "不及格",
  },
  // 可以根據需要添加更多測試數據
]);

// const records = ref([]);

// 補考假資料
const makeupRecords = ref([
  {
    empId: "2025001",
    userName: "張三",
    submissionTime: "2025.04.16 10:30",
    score: 42,
    status: "pending",
  },
  {
    empId: "2025002",
    userName: "李四",
    submissionTime: "2025.04.16 10:30",
    score: 78,
    status: "ongoing",
  },
  {
    empId: "2025003",
    userName: "王五",
    submissionTime: "2025.04.16 11:00",
    score: 92,
    status: "done",
  },
  // 可以添加更多假資料來測試顯示效果
]);

// const makeupRecords = ref([]);

// 搜尋欄位的輸入文字
const searchQuery = ref("");
const filteredRecords = ref(records.value);
const makeupfilteredRecords = ref(makeupRecords.value);

const isSelected = (record) => {
  return selectedRecords.value.some(
    (selected) => selected.empId === record.empId
  );
};

// 全選/全不選功能(只選empId)
/*const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedRecords.value = makeupfilteredRecords.value.map(
      (record) => record.empId
    );
  } else {
    selectedRecords.value = [];
  }
};*/
// 全選/全不選功能
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedRecords.value = makeupfilteredRecords.value
      .filter((record) => record.status === "pending") // 加上這行過濾
      .map((record) => ({ ...record }));
  } else {
    selectedRecords.value = [];
  }
};

// 假設有一個方法用來處理選擇員工
const toggleEmployeeSelection = (employee) => {
  if (employee.status !== "pending") return;
  const index = selectedRecords.value.findIndex(
    (record) => record.empId === employee.empId
  );
  if (index === -1) {
    selectedRecords.value.push(employee); // 如果沒選擇過，加入選擇列表
  } else {
    selectedRecords.value.splice(index, 1); // 如果已選擇過，移除
  }
};

/*
  // 全選/全不選功能(選擇整筆資料)
  // 切換「全選」時
  function toggleSelectAll() {
    if (selectAll.value) {
      selectedRecords.value = [...filteredRecords.value]
    } else {
      selectedRecords.value = []
    }
  }
  
  // 如果使用者單勾或取消勾選，反映到 selectAll 狀態
  watch(selectedRecords, (newVal) => {
    selectAll.value = newVal.length === filteredRecords.value.length
  })
  */

// 測驗狀態英文名稱轉中文名稱
const getStatusName = (status) => {
  switch (status) {
    case "ongoing":
      return "進行中";
    case "done":
      return "已結束";
    case "canceled":
      return "已取消";
    default:
      return status;
  }
};

// 補考狀態英文名稱轉中文名稱
const getMakeupStatusName = (status) => {
  switch (status) {
    case "pending":
      return "待開啟";
    case "ongoing":
      return "已開放補考"; //進行中(已開放補考)
    case "done":
      return "已繳交";
    default:
      return status;
  }
};

const goBack = () => {
  router.push("/view_exam_records");
  localStorage.removeItem("selectedExam");
};

// 修改考試期間
/*
  const confirmEdit = () => {
    console.log("新的開始時間為：", newStartTime.value);
    console.log("新的結束時間為：", newEndTime.value);
    // 更新 exam.startDate 和 exam.endDate
    exam.value.startDate = newStartTime.value;
    exam.value.endDate = newEndTime.value;
  
    // 可以在此加上 axios 發送 API 更新時間
    showModal.value = false;
  };
  */

// 修改考試期間API
const confirmEdit = async () => {
  try {
    // 發送 PATCH 請求更新作答時間
    const token = localStorage.getItem("authToken");
    const examId = exam.value.examId;

    // 檢查 endDate 是否大於等於 startDate
    if (newEndTime.value <= newStartTime.value) {
      alert("結束時間不能早於開始時間！");
      return; // 終止後續操作
    }

    const response = await axios.patch(
      `http://172.16.46.163/csexam/admin/exam/${examId}`,
      {
        startDate: newStartTime.value,
        endDate: newEndTime.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // 設定 Authorization 標頭
        },
      }
    );

    if (response.data.code === "0000") {
      console.log("修改成功", response.data);
      // 更新當前測驗資料
      exam.value.startDate = newStartTime.value;
      exam.value.endDate = newEndTime.value;
      showModal.value = false;
    } else {
      alert("修改失敗，資料庫出現問題");
    }
  } catch (error) {
    console.error("修改作答時間失敗:", error);
    alert("修改作答時間失敗，請稍後再試");
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

// 查詢考試成績API
const fetchRecords = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const groupId = exam.value.groupId;

    const response = await axios.get(
      `http://172.16.46.163/csexam/admin/score-manager/${groupId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.code === "0000") {
      records.value = response.data.data.scoreLists;
    } else {
      alert("成績資料加載失敗！");
    }
  } catch (error) {
    console.error("載入成績資料失敗", error);
    alert("無法載入成績資料，請稍後再試");
    if (
      error.response?.data?.message === "請求未提供token" ||
      error.response?.data?.message === "token無效或已過期，請重新登入"
    ) {
      errorMsg.value = {
        status: error.response.status,
        code: error.response.data.code,
        message: error.response.data.message || "null",
      };
      showError.value = true;
    }
  }
};

// 補考名單查詢API
const fetchMakeupRecords = async () => {
  const token = localStorage.getItem("authToken");
  const groupId = exam.value.groupId;

  try {
    const response = await axios.get(
      `http://172.16.46.163/csexam/admin/makeup-exam/all/${groupId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.code === "0000") {
      makeupRecords.value = response.data.data;
      makeupfilteredRecords.value = response.data.data; // 若有搜尋功能需要用到
    } else {
      alert(response.data.message || "查詢補考名單失敗！");
    }
  } catch (error) {
    console.error("補考名單查詢失敗", error);
    alert("補考名單查詢失敗，請稍後再試");
    if (
      error.response?.data?.message === "請求未提供token" ||
      error.response?.data?.message === "token無效或已過期，請重新登入"
    ) {
      errorMsg.value = {
        status: error.response.status,
        code: error.response.data.code,
        message: error.response.data.message || "null",
      };
      showError.value = true;
    }
  }
};

const openMakeupExam = () => {
  // console.log("補考測驗");
  // alert("功能尚未實作");
  showSelectModal.value = true; // 顯示選擇員工的 modal
};

const setupMakeupExam = () => {
  showMakeupModal.value = true;
  // console.log("開啟補考測驗");
  // alert("功能尚未實作");
};

// 新增補考考試API
const submitMakeupExam = async () => {
  /*if (selectedRecords.value.length === 0) {
      alert("請先選擇要補考的同仁");
      return;
    }*/

  if (
    !makeupLimitTime.value ||
    !makeupStartDate.value ||
    !makeupEndDate.value ||
    !makeupTargetScore.value
  ) {
    alert("請填寫所有欄位！");
    return;
  }

  const start = new Date(makeupStartDate.value);
  const end = new Date(makeupEndDate.value);
  if (end < start) {
    alert("結束日期不能早於開始日期！");
    return;
  }

  console.log({
    groupId: exam.value.groupId,
    limitTime: makeupLimitTime.value,
    startDate: makeupStartDate.value,
    endDate: makeupEndDate.value,
    targetScore: makeupTargetScore.value,
  });

  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.post(
      "http://172.16.46.163/csexam/admin/exam/make-up",
      {
        groupId: exam.value.groupId,
        startDate: makeupStartDate.value,
        endDate: makeupEndDate.value,
        targetScore: Number(makeupTargetScore.value),
        limitTime: Number(makeupLimitTime.value),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.code === "0000") {
      alert("已開啟補考測驗");

      // 清空資料
      makeupLimitTime.value = "";
      makeupStartDate.value = "";
      makeupEndDate.value = "";
      makeupTargetScore.value = "";
      showMakeupModal.value = false;
    } else {
      alert(response.data.message || "新增補考測驗失敗！");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data.code) {
        alert(error.response.data.message);
        // EE003 補考考試已存在
      } else {
        alert("錯誤訊息:", error.response.data.message);
      }
    } else {
      alert("發生錯誤，請稍後再試");
    }
    console.error(error);
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

  // 清空資料
  makeupLimitTime.value = "";
  makeupStartDate.value = "";
  makeupEndDate.value = "";
  makeupTargetScore.value = "";
  showMakeupModal.value = false;
};

// 開啟補考考試API
const startMakeupExam = async () => {
  const token = localStorage.getItem("authToken");

  // 檢查是否選擇了要進行補考的員工
  if (selectedRecords.value.length === 0) {
    alert("請選擇至少一位員工！");
    return;
  }

  // 確保選擇了待補考的員工，並將其 failedListId 包裝成物件陣列
  const failedListIds = selectedRecords.value.map((record) => ({
    failedListId: record.failedListId,
  }));

  try {
    const response = await axios.patch(
      `http://172.16.46.163/csexam/admin/makeup-exam`,
      {
        failedListIds, // 傳送選中的員工的 failedListId 陣列
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.code === "0000") {
      alert("補考已成功開啟！");
      showMakeupModal.value = false;
      selectedRecords.value = []; // 清空選擇的員工列表
      await fetchMakeupRecords(); // 重新獲取補考資料
    } else {
      alert("補考開啟失敗：" + (response.data.message || ""));
    }
  } catch (error) {
    console.error("補考開啟失敗:", error);
    alert("補考開啟失敗，請稍後再試");
    if (
      error.response?.data?.message === "請求未提供token" ||
      error.response?.data?.message === "token無效或已過期，請重新登入"
    ) {
      errorMsg.value = {
        status: error.response.status,
        code: error.response.data.code,
        message: error.response.data.message || "null",
      };
      showError.value = true;
    }
  }
};

const viewMakeupRecords = () => {
  // alert("功能尚未實作");
  isOriginalScore.value = !isOriginalScore.value;

  // 根據當前顯示的 div 切換按鈕文字
  if (isOriginalScore.value) {
    score_btn_Text.value = "查看補考名單";
  } else {
    score_btn_Text.value = "查看成績";
  }
};

const exportGrades = () => {
  console.log("匯出成績");
  alert("功能尚未實作");
  // 這裡可以執行匯出成績的邏輯
};

// 搜尋原始成績
const filterRecords = () => {
  // 根據員工編號或姓名進行過濾
  filteredRecords.value = records.value.filter((record) => {
    return (
      record.empId.includes(searchQuery.value) ||
      record.userName.includes(searchQuery.value)
    );
  });
};

// 搜尋補考成績
const makeupSearch = () => {
  // 根據員工編號或姓名進行過濾
  makeupfilteredRecords.value = makeupRecords.value.filter((makeupRecord) => {
    return (
      makeupRecord.empId.includes(searchQuery.value) ||
      makeupRecord.userName.includes(searchQuery.value)
    );
  });
};

const viewAnswerRecord = (index) => {
  console.log("查看答題記錄，索引：", index);
  router.push("/answer_record");
};

// 當錯誤視窗按下確認後跳轉到首頁
const handleRedirect = () => {
  showError.value = false; // 關閉錯誤視窗
  router.push("/"); // 跳轉到首頁
};

onMounted(() => {
  const stored = localStorage.getItem("selectedExam");
  if (stored) {
    exam.value = JSON.parse(stored);
    // 當頁面加載完成後，初始化新的開始和結束時間
    newStartTime.value = exam.value.startDate;
    newEndTime.value = exam.value.endDate;
  }
  // fetchRecords();
  // fetchMakeupRecords();
});
</script>

<style scoped>
html,
body {
  background-color: #eee;
  margin: 0;
  padding: 0;
  height: 100%;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 1000px;
  min-height: 100vh;
  background-color: #eee;

  /*  display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;  */
}

.content {
  margin: 110px auto 20px;
  padding: 20px;
  max-width: 1100px;
  background-color: #fff;
  border: 2px solid #dfdfdf;
}

.back-btn {
  margin: 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 14px;
  color: #0c029a;
  background-color: #e7e7e7;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  color: #060053;
  background-color: #d3d3d3;
}

.arrow-icon {
  margin-right: 0;
  font-style: normal;
  font-size: 16px;
}

.exam-info-card {
  background-color: #fff;
  padding: 20px 0;
  margin: 0 auto;
  margin-top: 0;
  border-radius: 0;
  width: 100%;
}

.exam-info-card h2 {
  font-size: 24px;
  margin: 0;
  margin-bottom: 10px;
  color: #333;
  text-align: left;
}

.status-wrapper {
  box-sizing: border-box;
  width: 100%;
}

.status-wrapper.ongoing {
  background-color: #fff3cd;
  color: #856404;
  border: 2px solid #856404;
}

.status-wrapper.done {
  background-color: #d4edda;
  color: #155724;
  border: 2px solid #155724;
}

.status-wrapper.canceled {
  background-color: #f8d7da;
  color: #721c24;
  border: 2px solid #721c24;
}

.status-tag {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1rem;
  margin: 0;
  padding: 0.25rem 1rem;
}

.status-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.icon-ongoing {
  color: #856404; /* 黃色 */
}

.icon-done {
  color: #155724; /* 綠色 */
}

.icon-canceled {
  color: #721c24; /* 紅色 */
}

.exam-info-content {
  box-sizing: border-box;
  margin-top: 20px;
  padding: 10px 20px;
  width: 100%;
  background-color: #eee;

  display: flex; /* 啟用 flex 布局 */
  justify-content: space-between; /* 讓子元素分散排列 */
  align-items: flex-start; /* 預設上對齊 */
  align-items: stretch;
}

.exam-info-text {
  width: 50%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 讓內容上下平均分散 */
  height: 100%;
}

.exam-info-text p {
  text-align: left;
  margin: 15px 0;
  font-size: 16px;
  color: #555;
}

.edit-time-btn {
  margin-left: 12px;
  padding: 6px 12px;
  font-size: 14px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.edit-time-btn:hover {
  background-color: #38833c;
}

.exam-range-table {
  /* width: 50%;
  max-width: 800px; */
  width: 525px;
  height: 200px;
  margin: 20px auto;
  border-collapse: collapse;
  font-size: 16px;
  margin-right: 10px;
  /* margin: 0; */
}

.exam-range-table th,
.exam-range-table td {
  padding: 8px 12px;
  text-align: center;
  border: 1px solid #ccc; /* 輕微的淡邊框 */
}

.exam-range-table th {
  background-color: #f1d8ff;
  font-weight: bold;
  color: #333;
}

/* .exam-range-table tr:nth-child(even) {
    background-color: #fcfcfc;
  } */

.exam-range-table tr {
  background-color: white;
}

/* 按鈕容器 */
.action-buttons {
  display: flex;
  justify-content: flex-start;
  width: 80%;
  max-width: 800px;
  margin-top: 10px;
  margin-left: 0;
}

/* 按鈕樣式 */
.btn {
  padding: 8px 16px;
  margin: 0 10px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #38833c; /* 按鈕懸停時變色 */
}

.original-score {
  background-color: #a18cd6; /* 原始成績顏色 */
  color: white;
}

.original-score:hover {
  background-color: #6e55ad;
}

.makeup-score {
  background-color: #ff9800; /* 補考記錄顏色 */
  color: white;
}

.makeup-score:hover {
  background-color: #bf7300;
}

/*
  .btn:nth-child(1) {
    background-color: #4caf50;
    color: white;
  }
  
  .btn:nth-child(2) {
    background-color: #2196f3;
    color: white;
  }
  
  .btn:nth-child(3) {
    background-color: #ff9800;
    color: white;
  }
  */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

.modal {
  position: relative;
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  margin: 0;
  margin-bottom: 15px;
  font-size: 24px;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.modal-label {
  display: flex;
  flex-direction: column;
}

.label-text {
  text-align: left; /* 將文字對齊到左邊 */
  margin-bottom: 5px;
  font-size: 16px;
}

.modal-input {
  padding: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}
/*
  .form-group {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
  }*/

.makeup-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

.makeup-modal {
  position: relative;
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.status-bar {
  padding: 10px 16px;
  border-radius: 0;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  /* box-sizing: border-box; */
}

.status-bar span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-bar-selected {
  background-color: #e2fafa;
  border: 2px solid #bde7e6;
  color: #005782;
}

.status-bar-selected i {
  font-size: 18px;
  color: #4290e4;
}

.status-bar-unselected {
  background-color: #fdd8d8;
  border: 2px solid #e2bebe;
  color: #820000;
}

.status-bar-unselected i {
  font-size: 18px;
  color: #e44242;
}

.selected-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  background-color: #f9f9f9;
  border-radius: 0;
  overflow: hidden;
}

.selected-table thead {
  background-color: #3f51b5;
  color: white;
}

.selected-table th,
.selected-table td {
  padding: 0.75rem 1rem;
  text-align: center;
  border: 1px solid #ddd;
}

.selected-table tbody tr:hover {
  background-color: #f1f1f1;
}

.makeup-modal h3 {
  margin: 0;
  margin-bottom: 15px;
  font-size: 24px;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.form-group label {
  width: 130px;
  text-align: center;
}

.form-group input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.exam-name {
  font-size: 16px;
  padding: 0;
  margin: 0;
  color: #333;
}

.confirm-btn,
.cancel-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-btn {
  background-color: #4caf50;
  color: white;
}

.confirm-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #d7372d;
}

.close-btn {
  padding: 0 10px;
  margin: auto;
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: black;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #333;
}

.exam-score {
  border: 1px solid #333;
  margin-top: 30px;
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.search-bar h2 {
  margin: 0;
  margin-right: auto;
}

.search-bar input {
  width: 150px;
  padding: 8px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.search-btn {
  padding: 8px 16px;
  margin-left: 10px;
  font-size: 14px;
  background-color: #20bec8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-btn:hover {
  background-color: #0e8d96;
}

/* 答題記錄表格樣式 */
.exam-records-table {
  width: 100%;
  /* max-width: 800px; */
  margin: 20px auto 0;
  border-collapse: collapse;
  font-size: 16px;
}

.exam-records-table th,
.exam-records-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

.exam-records-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.exam-records-table tr:nth-child(even) {
  background-color: #fcfcfc;
}

.text-center {
  color: #0c029a;
  font-weight: 600;
  font-size: 20px;
}

.text-green {
  color: #28a745; /* 比較柔和的綠色 */
  font-weight: bold;
}

.text-red {
  color: #dc3545; /* 比較柔和的紅色 */
  font-weight: bold;
}

.badge-blue {
  color: #456ee7; /* 文字顏色 */
  padding-left: 15px; /* 給文字留出空間，讓圓形不會被擠到 */
  font-weight: bold;
  font-size: 16px;
  position: relative; /* 用於定位圓形 */
}

.badge-brown {
  color: #8e6034; /* 文字顏色 */
  padding-left: 15px; /* 給文字留出空間，讓圓形不會被擠到 */
  font-weight: bold;
  font-size: 16px;
  position: relative; /* 用於定位圓形 */
}

.badge-green {
  color: #28a745; /* 文字顏色 */
  padding-left: 15px; /* 給文字留出空間，讓圓形不會被擠到 */
  font-weight: bold;
  font-size: 16px;
  position: relative; /* 用於定位圓形 */
}

.status-circle {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%; /* 讓它變成圓形 */
}

/* 答題記錄按鈕樣式 */
.view-record-btn {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.view-record-btn:hover {
  background-color: #1976d2;
}

.delete-makeup-btn {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #ff3f3f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.delete-makeup-btn:hover {
  background-color: #b70101;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
