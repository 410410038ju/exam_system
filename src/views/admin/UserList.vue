<template>
  <div class="container">
    <AdminNavBar />

    <div class="content">
      <div class="header-container">
        <h1>人員管理</h1>

        <button @click="showModal = true" class="open-modal-btn">
          新增人員
        </button>

        <button @click="exportToExcel" class="button export-btn">
          匯出EXCEL
        </button>

        <!-- 搜尋欄位 -->
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜尋姓名或人員編號"
            class="search-input"
          />
          <button @click="searchUsers" class="search-btn">搜尋</button>
        </div>
      </div>

      <!-- 新增人員的懸浮視窗 (Modal) -->
      <div v-if="showModal" class="modal-overlay" @click="closeAddModal">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="closeAddModal">x</button>
          <h2>新增人員</h2>
          <br />
          <div class="form-group">
            <label>
              <span>人員姓名：</span>
              <input
                type="text"
                v-model="newUser.name"
                placeholder="輸入人員姓名"
              />
            </label>
          </div>
          <div class="form-group">
            <label>
              <span>人員編號：</span>
              <input
                type="text"
                v-model="newUser.id"
                placeholder="輸入人員編號"
              />
            </label>
          </div>

          <div class="form-group">
            <label>
              <span>人員密碼：</span>
              <input
                type="password"
                v-model="newUser.password"
                placeholder="輸入人員密碼"
                :class="{ 'invalid-input': !isNewPasswordValid }"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$"
                title="密碼需至少 12 個字元，包含大寫字母、小寫字母和數字"
              />
            </label>
          </div>

          <div class="form-group">
            <label>
              <div v-if="!isNewPasswordValid" class="error-message">
                <i class="fas fa-times-circle" style="color: red"></i>
                密碼需至少 12 個字元，包含大寫字母、小寫字母和數字
              </div>
              <div v-if="isNewPasswordValid" class="correct-message">
                <i class="fas fa-check-circle" style="color: green"></i>
                密碼符合規定
              </div>
            </label>
          </div>

          <div class="form-group">
            <label>
              <span>人員權限：</span>
              <select v-model="newUser.role">
                <option value="EXAM_TAKER">客服</option>
                <option value="MANAGER">主管</option>
                <option value="ADMIN">最高管理員</option>
              </select>
            </label>
          </div>
          <div class="modal-actions">
            <button class="button" @click="addUser">確定</button>
            <button class="button cancel-btn" @click="closeAddModal">
              取消
            </button>
          </div>
        </div>
      </div>

      <!-- 修改人員的懸浮視窗 (Modal) -->
      <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="closeEditModal">x</button>
          <h2>修改人員資料</h2>
          <br />
          <div class="form-group">
            <label>
              <span>人員姓名：</span>
              <input
                type="text"
                v-model="editUserData.name"
                placeholder="輸入新姓名"
              />
            </label>
          </div>
          <div class="form-group">
            <label>
              <span>人員編號：</span>
              <input
                type="text"
                v-model="editUserData.id"
                placeholder="輸入人員編號"
                readonly
              />
            </label>
          </div>

          <div class="form-group">
            <label>
              <span>人員密碼：</span>
              <input
                type="password"
                v-model="editUserData.password"
                placeholder="輸入新密碼"
                :class="{ 'invalid-input': !isEditPasswordValid }"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$"
                title="密碼需至少 12 個字元，包含大寫字母、小寫字母和數字"
              />
            </label>
          </div>

          <div class="form-group">
            <label>
              <div v-if="!isEditPasswordValid" class="error-message">
                <i class="fas fa-times-circle" style="color: red"></i>
                密碼需至少 12 個字元，包含大寫字母、小寫字母和數字
              </div>
              <div v-if="isEditPasswordValid" class="correct-message">
                <i class="fas fa-check-circle" style="color: green"></i>
                密碼符合規定
              </div>
            </label>
          </div>

          <div class="form-group">
            <label>
              <span>人員權限：</span>
              <select v-model="editUserData.role">
                <option value="EXAM_TAKER">客服</option>
                <option value="MANAGER">主管</option>
                <option value="ADMIN">最高管理員</option>
              </select>
            </label>
          </div>
          <div class="modal-actions">
            <button class="button" @click="saveChanges">保存更改</button>
            <button class="button cancel-btn" @click="closeEditModal">
              取消
            </button>
          </div>
        </div>
      </div>

      <table id="user-table">
        <thead>
          <tr>
            <th @click="sortTable('name')">
              人員姓名
              <span v-if="sortKey === 'name'">
                <span v-if="sortOrder === 1">▲</span>
                <span v-if="sortOrder === -1">▼</span>
              </span>
            </th>
            <th @click="sortTable('id')">
              人員編號
              <span v-if="sortKey === 'id'">
                <span v-if="sortOrder === 1">▲</span>
                <span v-if="sortOrder === -1">▼</span>
              </span>
            </th>
            <th @click="sortTable('role')">
              人員權限
              <span v-if="sortKey === 'role'">
                <span v-if="sortOrder === 1">▲</span>
                <span v-if="sortOrder === -1">▼</span>
              </span>
            </th>
            <th>鎖定</th>
            <th>密碼狀態</th>
            <th>最近一次登入IP</th>
            <th>資料建立日期</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.id }}</td>
            <td>{{ getRoleName(user.role) }}</td>
            <td :style="{ color: user.locked === 'Y' ? 'red' : 'black' }">
              {{ user.locked === "Y" ? "是" : "否" }}
            </td>
            <td
              :style="{
                color: user.passwordExpiredFlag === 'Y' ? 'red' : 'black',
              }"
            >
              {{ user.passwordExpiredFlag === "Y" ? "需要更改" : "無須變更" }}
            </td>
            <td>
              {{ user.lastLoginIp === null ? "尚未登入" : user.lastLoginIp }}
            </td>
            <td>{{ user.createDate }}</td>
            <td>
              <div class="button-container">
                <button class="button edit-btn" @click="editUser(user.id)">
                  編輯
                </button>
                <button class="button delete-btn" @click="deleteUser(user.id)">
                  刪除
                </button>
                <button class="button unlock-btn" @click="unlockUser(user.id)">
                  解除鎖定
                </button>
                <!-- <span v-if="!canModifyUser(user.role)" style="color: red"
                  >沒有權限</span
                > -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<!-- vue 2 
<script>
import AdminNavBar from "../../components/AdminNavBar.vue";
import * as XLSX from "xlsx";

export default {
  name: "UserList",
  components: {
    AdminNavBar,
  },
  data() {
    return {
      users: [],
      searchQuery: "", // 搜尋字串
      sortKey: "", // 目前排序的欄位
      sortOrder: 1, // 1: 升序, -1: 降序
      editUserData: {
        name: "",
        id: "",
        role: "User",
      },
      showModal: false, // 控制新增人員Modal顯示
      showEditModal: false, // 控制修改人員Modal顯示
      newUser: {
        name: "",
        id: "",
        role: "User",
        locked: false,
        failedAttempts: 0,
      },
      filteredUsers: [], // 儲存搜尋後的使用者
    };
  },
  computed: {
    // 過濾並排序後的使用者列表
    /*filteredUsers() {
      const searchQuery = this.searchQuery.toLowerCase();
      return this.sortedUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery) ||
          user.id.toLowerCase().includes(searchQuery)
      );
    },*/
    sortedUsers() {
      return [...this.users].sort((a, b) => {
        if (!this.sortKey) return 0; // 如果沒有選擇排序，直接返回原順序
        let valA = a[this.sortKey];
        let valB = b[this.sortKey];

        // 轉成字串比較，確保數字與文字都能正常排序
        return (
          valA.toString().localeCompare(valB.toString(), "zh-Hant") *
          this.sortOrder
        );
      });
    },
  },
  methods: {
    /*sortTable(key) {
      if (this.sortKey === key) {
        this.sortOrder *= -1; // 如果是同一個欄位，就切換升降序
      } else {
        this.sortKey = key;
        this.sortOrder = 1; // 新的欄位排序預設為升序
      }
    },*/
    // 排序方法
    sortTable(key) {
      if (this.sortKey === key) {
        // 如果點擊的是當前排序欄位，則切換排序方向
        this.sortOrder = this.sortOrder === 1 ? -1 : 1;
      } else {
        // 如果是點擊新欄位，則設置升序
        this.sortKey = key;
        this.sortOrder = 1;
      }

      // 排序
      this.users.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
        if (typeof aValue === "string") {
          return this.sortOrder * aValue.localeCompare(bValue); // 字串排序
        } else {
          return this.sortOrder * (aValue - bValue); // 數字排序
        }
      });
    },
    loadUsers() {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      this.users = users;
    },
    /*
    searchUsers() {
      // 當按下搜尋按鈕時，進行搜尋
      const searchQuery = this.searchQuery.toLowerCase();
      this.filteredUsers = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery) ||
          user.id.toLowerCase().includes(searchQuery)
      );
    },
    */
    searchUsers() {
      if (!this.searchQuery) {
        this.filteredUsers = this.users; // 如果沒有搜尋字串，顯示所有使用者
      } else {
        this.filteredUsers = this.users.filter(
          (user) =>
            user.name.includes(this.searchQuery) ||
            user.id.includes(this.searchQuery)
        );
      }
    },
    addUser() {
      if (!this.newUser.name || !this.newUser.id) {
        alert("請輸入完整資料！");
        return;
      }

      // 讀取本地存儲的使用者數據
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // 檢查ID是否已存在
      if (users.some((user) => user.id === this.newUser.id)) {
        alert("該人員編號已存在！");
        return;
      }

      // 預設密碼
      this.newUser.password = "1111";
      this.newUser.locked = false; // 初始化為未鎖定
      this.newUser.failedAttempts = 0; // 初始化失敗次數

      // 新增使用者
      users.push({ ...this.newUser });
      localStorage.setItem("users", JSON.stringify(users));

      //alert(`已新增：${this.newUser.name}`);

      // 清空輸入欄位
      // this.newUser = { name: "", id: "", role: "User" };
      this.newUser = {
        name: "",
        id: "",
        role: "User",
        locked: false,
        failedAttempts: 0,
      };

      // 重新載入列表
      this.loadUsers();
      this.filteredUsers = this.users;

      // 關閉視窗
      this.closeModal();
    },
    editUser(id) {
      if (id === "admin") {
        alert("無法修改系統管理員帳號！");
        return;
      }

      const user = this.users.find((user) => user.id === id);
      if (user) {
        this.editUserData = { ...user };
        this.originalUserId = user.id; // 存儲原本的ID
        this.showEditModal = true; // 顯示修改視窗
      }
    },
    saveChanges() {
      // 檢查新的編號是否已經存在於其他使用者（排除自己）
      if (
        this.users.some(
          (user) =>
            user.id === this.editUserData.id && user.id !== this.originalUserId
        )
      ) {
        alert("該人員編號已存在！");
        return;
      }

      const index = this.users.findIndex(
        (user) => user.id === this.originalUserId
      );

      if (index !== -1) {
        // 更新使用者資訊，包含新的編號
        this.users[index] = { ...this.editUserData };
        localStorage.setItem("users", JSON.stringify(this.users));
        alert("資料已更新！");
        this.closeEditModal(); // 關閉視窗
        this.loadUsers(); // 重新加載列表
      }
    },
    // 另一個 saveChanges( 還沒測試 )
    /*saveChanges() {
      // 找到原來的使用者
      const oldIndex = this.users.findIndex(
        (user) => user.id === this.editUserData.id
      );

      if (oldIndex === -1) {
        alert("發生錯誤，找不到該使用者！");
        return;
      }

      // 如果編號被修改，需檢查新編號是否已存在
      const isIdChanged = this.editUserData.id !== this.users[oldIndex].id;
      if (isIdChanged) {
        const idExists = this.users.some(
          (user) => user.id === this.editUserData.id
        );
        if (idExists) {
          alert("該人員編號已存在，請輸入其他編號！");
          return;
        }
      }

      // 更新使用者資料
      this.users[oldIndex] = { ...this.editUserData };

      // 儲存到 localStorage
      localStorage.setItem("users", JSON.stringify(this.users));

      alert("資料已更新！");
      this.cancelEdit();
    },*/

    cancelEdit() {
      this.closeEditModal();
      /*this.editUserData = { name: "", id: "", role: "User" };
       */
    },
    resetPassword() {
      const user = this.users.find((user) => user.id === this.editUserData.id);
      if (user) {
        user.password = "1111";
        localStorage.setItem("users", JSON.stringify(this.users));
        alert("密碼已重設為 1111");
      }
    },
    deleteUser(id) {
      /*if (id === "admin") {
        alert("無法刪除系統管理員帳號！");
        return;
      }*/
      /*
      const confirmDelete = confirm(`確定要刪除${id}的帳號嗎？`);
      if (confirmDelete) {
        this.users = this.users.filter((user) => user.id !== id);
        localStorage.setItem("users", JSON.stringify(this.users));
        this.loadUsers();
      }*/
      const user = this.users.find((user) => user.id === id);

      // 彈出輸入框讓使用者確認刪除的人員編號
      const inputId = prompt(`請輸入要刪除的人員編號：`);

      if (inputId === id) {
        //alert(`已刪除編號${id}的帳號`);
        this.users = this.users.filter((user) => user.id !== id);
        localStorage.setItem("users", JSON.stringify(this.users));
        this.loadUsers();
        this.filteredUsers = this.users;
      } else {
        alert("輸入人員編號錯誤");
      }
    },
    unlockUser(user) {
      if (!user.locked) {
        alert("此帳號沒有被鎖住");
        return;
      }
      user.locked = false; // 解除鎖定
      user.failedAttempts = 0; // 重設失敗次數
      alert(`帳號 ${user.id} 已解除鎖定`);
      this.updateUserData(user);
    },
    // 更新使用者資料（包含鎖定狀態）
    updateUserData(user) {
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const index = users.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        users[index] = { ...user };
        localStorage.setItem("users", JSON.stringify(users));
      }
    },

    closeModal() {
      this.showModal = false;
      this.newUser = { name: "", id: "", role: "User" }; // 清空表單
    },
    closeEditModal() {
      this.showEditModal = false; // 隱藏修改表單
    },
    exportToExcel() {
      const ws = XLSX.utils.table_to_sheet(
        document.getElementById("user-table")
      ); // 從表格中轉換為工作表
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "人員資料"); // 添加工作表
      XLSX.writeFile(wb, "user_data.xlsx"); // 下載EXCEL檔案
    },
  },
  created() {
    this.loadUsers();
    this.filteredUsers = this.users; // 預設顯示所有使用者
  },
  watch: {
    searchQuery(newQuery) {
      this.searchUsers();
    },
  },
};
</script>
-->

<!-- vue 3 -->
<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router"; // 引入 Vue Router
import axios from "axios";
import AdminNavBar from "../../components/AdminNavBar.vue";
import * as XLSX from "xlsx";

// 初始化 Vue Router
const router = useRouter();

// 使用 ref 和 reactive 定義狀態
const users = ref([]);
const searchQuery = ref("");
const sortKey = ref("");
const sortOrder = ref(1);
const originalUserId = ref(""); // 定義變數來保存原始的使用者 ID
const editUserData = reactive({
  name: "",
  id: "",
  password: "",
  role: "EXAM_TAKER",
});
const showModal = ref(false);
const showEditModal = ref(false);
const newUser = reactive({
  name: "",
  id: "",
  password: "",
  role: "EXAM_TAKER",
  locked: false,
  failedAttempts: 0,
});
const filteredUsers = ref([]);
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const currentUserRole = ref(loggedInUser?.role || "MANAGER");
const isNewPasswordValid = ref(false); // 用來檢查新增人員的密碼是否有效
const isEditPasswordValid = ref(false); // 用來檢查修改人員的密碼是否有效

// 檢查登入狀況
const checkLogin = () => {
  if (!loggedInUser) {
    alert("你尚未登入");
    router.push("/"); // 跳轉到 Home.vue（根路由）
  }
};

// 檢查新密碼是否符合要求
const checkNewPassword = () => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;
  isNewPasswordValid.value = regex.test(newUser.password);
};

// 檢查編輯的密碼是否符合要求
const checkEditPassword = () => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;
  isEditPasswordValid.value = regex.test(editUserData.password);
};

// 監聽新密碼變更，並且檢查密碼是否合法
watch(() => newUser.password, checkNewPassword);

// 監聽編輯密碼變更，並且檢查密碼是否合法
watch(() => editUserData.password, checkEditPassword);

// 人員權限英文轉換中文
const getRoleName = (role) => {
  switch (role) {
    case "EXAM_TAKER":
      return "客服";
    case "MANAGER":
      return "主管";
    case "ADMIN":
      return "最高管理員";
    default:
      return "未知角色";
  }
};

// 排序過後的使用者列表
const sortedUsers = computed(() => {
  return [...users.value].sort((a, b) => {
    if (!sortKey.value) return 0;
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];
    return (
      valA.toString().localeCompare(valB.toString(), "zh-Hant") *
      sortOrder.value
    );
  });
});

// 排序方法
const sortTable = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 1 ? -1 : 1;
  } else {
    sortKey.value = key;
    sortOrder.value = 1;
  }

  users.value.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    if (typeof aValue === "string") {
      return sortOrder.value * aValue.localeCompare(bValue);
    } else {
      return sortOrder.value * (aValue - bValue);
    }
  });
};

const loadUsers = () => {
  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  users.value = storedUsers;
};

// 讀取所有人員資料API
/*
const loadUsers = async () => {
  const token = localStorage.getItem('authToken');

  try {
    // const response = await axios.get("http://172.16.46.163/csexam/admin/users");
    const response = await axios.get("http://172.16.46.163/csexam/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;

    if (data.code === "0000") {
      users.value = data.data.userList.map((user) => ({
        id: user.empId,
        name: user.username,
        role: user.roleList.join(", "), // 角色列表轉為字串
        locked: user.lockedFlag,
        createDate: user.createDate,
        lastLoginIp: user.lastLoginIp,
        passwordExpiredFlag: user.passwordExpiredFlag
      }));
      filteredUsers.value = users.value;
    } else {
      alert(data.message || "載入人員資料失敗");
    }
  } catch (error) {
    console.error("載入使用者資料時出錯:", error);
    alert("載入使用者資料時出錯");
  }
};
*/

const searchUsers = () => {
  if (!searchQuery.value) {
    filteredUsers.value = users.value;
  } else {
    filteredUsers.value = users.value.filter(
      (user) =>
        user.name.includes(searchQuery.value) ||
        user.id.includes(searchQuery.value)
    );
  }
};

// 計算是否可以編輯/刪除使用者
// const canModifyUser = (role) => {
//   if (currentUserRole.value === "ADMIN") return true;
//   if (currentUserRole.value === "MANAGER" && role === "EXAM_TAKER") return true;
//   return false;
// };

// 新增人員
const addUser = () => {
  if (!isNewPasswordValid.value) {
    alert("密碼不符合要求");
    return;
  }

  if (!newUser.name || !newUser.id || !newUser.password) {
    alert("請輸入完整資料！");
    return;
  }

  let usersList = JSON.parse(localStorage.getItem("users")) || [];

  if (usersList.some((user) => user.id === newUser.id)) {
    alert("該人員編號已存在！");
    return;
  }

  newUser.locked = false;
  newUser.failedAttempts = 0;

  usersList.push({ ...newUser });
  localStorage.setItem("users", JSON.stringify(usersList));

  Object.assign(newUser, {
    name: "",
    id: "",
    password: "",
    role: "EXAM_TAKER",
    locked: false,
    failedAttempts: 0,
  });

  loadUsers();
  filteredUsers.value = users.value;
  closeAddModal();
};

// 新增人員API
/*
const addUser = async () => {
  if (!isNewPasswordValid.value) {
    alert("密碼不符合要求");
    return;
  }

  if (!newUser.name || !newUser.id || !newUser.password) {
    alert("請輸入完整資料！");
    return;
  }

  const userData = {
    empId: newUser.id,
    password: newUser.password,
    username: newUser.name,
    role: newUser.role,
  };

  const token = localStorage.getItem('authToken');

  try {
    const response = await axios.post(
      "http://172.16.46.163/csexam/admin/sign-up",
      userData, {
      headers: { Authorization: `Bearer ${token}` },
    }
    );

    const data = response.data;

    if (data.code === "0000") {
      alert("新增人員成功");
      loadUsers();
    } else {
      alert(data.message || "新增人員失敗");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data.code === "UE001") {
        alert(error.response.data.message); //使用者已存在
      } else if (error.response.data.code === "RE001") {
        alert(error.response.data.message); //權限不存在(沒有這個權限名稱)
      } else if (error.response.data.code === "9999" && error.response.data.message === "上行參數錯誤") {
        alert(error.response.data.errorReason); //密碼不符合規定
      } else if (error.response.data.code === "9999") {
        alert(error.response.data.message); //系統忙碌中(其他問題)
      } else {
        alert("錯誤訊息:", error.response.data.message);
      }
    } else {
      alert("發生錯誤，請稍後再試");
    }
    console.error("新增人員失敗:", error);
  }

  Object.assign(newUser, {
    name: "",
    id: "",
    password: "",
    role: "EXAM_TAKER",
    locked: false,
    failedAttempts: 0,
  });

  loadUsers();
  filteredUsers.value = users.value;
  closeAddModal();
};
*/

const editUser = (id) => {
  if (id === "admin") {
    alert("無法修改系統管理員帳號！");
    return;
  }

  const user = users.value.find((user) => user.id === id);
  if (user) {
    // 記錄原始的 user id
    originalUserId.value = user.id;
    Object.assign(editUserData, user);
    editUserData.password = "";
    showEditModal.value = true;
  }
};

/*const saveChanges = () => {
  const existingUser = users.value.find(
    (user) =>
      user.id === editUserData.value.id && user.id !== originalUserId.value
  );
  if (existingUser) {
    alert("該人員編號已存在！");
    return;
  }

  const index = users.value.findIndex(
    (user) => user.id === originalUserId.value
  );
  if (index !== -1) {
    // 更新使用者資訊
    users.value.splice(index, 1, { ...editUserData.value });
    localStorage.setItem("users", JSON.stringify(users.value));
    alert("資料已更新！");
    closeEditModal(); // 關閉修改視窗
    loadUsers(); // 重新加載使用者列表
  }
};*/

// 編輯人員資料
/*const saveChanges = () => {
  if (
    !editUserData ||
    !editUserData.id ||
    !editUserData.name ||
    !editUserData.password
  ) {
    alert("請輸入完整資料！");
    return;
  }

  if (!isEditPasswordValid.value) {
    alert("密碼不符合要求");
    return;
  }

  // 檢查新編號是否已經存在
  const existingUser = users.value.find(
    (user) => user.id === editUserData.id && user.id !== originalUserId.value
  );
  if (existingUser) {
    alert("該人員編號已存在！");
    return;
  }

  // 找到原始使用者並更新
  const index = users.value.findIndex(
    (user) => user.id === originalUserId.value
  );
  if (index !== -1) {
    // 更新使用者資訊，包括修改編號
    users.value[index] = { ...editUserData };
    localStorage.setItem("users", JSON.stringify(users.value));
    alert("資料已更新！");
    closeEditModal(); // 關閉修改視窗
    loadUsers(); // 重新加載使用者列表
    location.reload();
  } else {
    alert("未找到原始使用者！");
  }
};*/

// 編輯人員資料API
// 員工編號不能修改
/*
const saveChanges = async () => {
  if (
    !editUserData ||
    !editUserData.id ||
    !editUserData.name ||
    !editUserData.role
  ) {
    alert("請輸入完整資料！");
    return;
  }

  // 如果密碼不為空，則檢查密碼是否符合規則
  if (editUserData.password && !isEditPasswordValid.value) {
    alert("密碼不符合要求");
    return;
  }

  const UserDataUpdate = {
    empId: editUserData.id,
    username: editUserData.name,
    role: [editUserData.role],
  };

  if (editUserData.password) {
    UserDataUpdate.password = editUserData.password; 
  } else {
    UserDataUpdate.password = ""; 
  }

  try {
    const token = localStorage.getItem("authToken"); // 從 localStorage 取得 token
    const response = await axios.patch(
      "http://172.16.46.163/csexam/admin/users",
      // {
      //   empId: editUserData.id,
      //   password: editUserData.password,
      //   username: editUserData.name,
      //   role: editUserData.role,
      // },
      UserDataUpdate,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.code === "0000") {
      alert("資料更新成功！");
      closeEditModal(); // 關閉修改視窗
      loadUsers();
    } else {
      alert(response.data.message || "更新失敗，請稍後再試！");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data.code) {
        alert(error.response.data.message);
        // UE002 使用者不存在
        // UE008 密碼規則不符合
        // RE001 角色不存在
        // 9999  系統忙碌中(其他問題)
      } else {
        alert("錯誤訊息:", error.response.data.message);
      }
    } else {
      alert("發生錯誤，請稍後再試");
    }
    console.error("資料更新失敗:", error);
  }
};
*/

const cancelEdit = () => {
  closeEditModal();
};

/* 重設密碼
const resetPassword = () => {
  const user = users.value.find((user) => user.id === editUserData.id);
  if (user) {
    user.password = "1111";
    localStorage.setItem("users", JSON.stringify(users.value));
    alert("密碼已重設為 1111");
  }
};
*/

const deleteUser = (id) => {
  const inputId = prompt(`請輸入要刪除的人員編號：`);

  // 如果按下取消，則不做任何事情
  if (inputId === null) {
    return;
  }

  if (inputId === id) {
    users.value = users.value.filter((user) => user.id !== id);
    localStorage.setItem("users", JSON.stringify(users.value));
    loadUsers();
    filteredUsers.value = users.value;
  } else {
    alert("輸入人員編號錯誤");
  }
};

// 刪除人員API
/*
const deleteUser = async (id) => {
  const verifyEmpid = prompt(`請輸入要刪除的人員編號：`);
  const token = localStorage.getItem('authToken');

  // 如果按下取消，則不做任何事情
  if (verifyEmpid === null) {
    return;
  }

  if (verifyEmpid === id) {
    try {
      const response = await axios.post(
        "http://172.16.46.163/csexam/admin/users/delete",
        {
          empId: id,
          verifyEmpId: verifyEmpid,
        }, {
      headers: { Authorization: `Bearer ${token}` },
    }
      );

      // 根據回應結果進行處理
      // 如果回應狀態是 204，表示刪除成功
      if (response.status === 204) {
        // 刪除成功後更新前端資料
        // users.value = users.value.filter((user) => user.id !== id);
        // localStorage.setItem("users", JSON.stringify(users.value));
        loadUsers();
        filteredUsers.value = users.value;
        alert("人員資料已成功刪除！");
      } else {
        // 根據回應的錯誤碼處理不同的錯誤情況
        if (response.data.code === "UE002") {
          alert("使用者不存在！");
        } else if (response.data.code === "UE007") {
          alert("刪除失敗，請確認輸入的員編是否正確！");
        } else {
          alert("刪除失敗，請稍後再試！");
        }
      }
    } catch (error) {
      console.error(error);
      alert("刪除人員資料時發生錯誤！");
    }
  } else {
    // alert("輸入人員編號錯誤");
    alert("刪除失敗，請確認輸入的員編是否正確");
  }
};
*/

/* 解除鎖定帳號
const unlockUser = (user) => {
  if (!user.locked) {
    alert("此帳號沒有被鎖住");
    return;
  }
  user.locked = false;
  user.failedAttempts = 0;
  alert(`帳號 ${user.id} 已解除鎖定`);
  updateUserData(user);
};*/

// 解鎖帳號API
const unlockUser = async (empId) => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await axios.put(
      "http://172.16.46.163/csexam/admin/users/unlock",
      { empId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.code === "0000") {
      alert("帳號已解除鎖定！");
      loadUsers(); // 重新加載使用者列表
    } else {
      alert(response.data.message || "解除鎖定失敗！");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.data.code === "UE004") {
        alert(error.response.data.message); //帳號已解鎖，請勿重複解鎖
      } else if (error.response.data.code === "UE002") {
        alert(error.response.data.message); //使用者不存在
      } else if (error.response.data.code === "9999") {
        alert(error.response.data.message); //系統忙碌中(其他問題)
      } else {
        alert("錯誤訊息:", error.response.data.message);
      }
    } else {
      alert("發生錯誤，請稍後再試");
    }
    console.error("解除鎖定失敗:", error);
    // alert("發生錯誤，請稍後再試");
  }
};

// 有API之後，這個也不用了
const updateUserData = (user) => {
  let usersList = JSON.parse(localStorage.getItem("users")) || [];
  const index = usersList.findIndex((u) => u.id === user.id);
  if (index !== -1) {
    usersList[index] = { ...user };
    localStorage.setItem("users", JSON.stringify(usersList));
  }
};

const closeAddModal = () => {
  showModal.value = false;
  Object.assign(newUser, {
    name: "",
    id: "",
    password: "",
    role: "EXAM_TAKER",
  });
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const exportToExcel = () => {
  const ws = XLSX.utils.table_to_sheet(document.getElementById("user-table"));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "人員資料");
  XLSX.writeFile(wb, "線上測驗系統人員資料.xlsx");
};

// 初始化
onMounted(() => {
  checkLogin();
  loadUsers();
  filteredUsers.value = users.value;
});

// 監聽搜尋字串變化
watch(searchQuery, () => {
  searchUsers();
});
</script>

<!--
<style scoped>
/* 懸浮視窗背景 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  /*z-index: 1000;*/
}

/* 內容區域 */
.modal-content {
  /*background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-sizing: border-box;*/
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  position: relative;
}

/* 關閉按鈕 */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid black;
}

th,
td {
  padding: 10px;
  text-align: center;
}

.button {
  padding: 5px 10px;
  margin: 2px;
  cursor: pointer;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
  border: none;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
}

/* 按鈕樣式 */
.open-modal-btn {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.open-modal-btn:hover {
  background-color: #0056b3;
}

/* 右上角關閉按鈕 */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

/* 按鈕區域 */
.modal-actions {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

/* 取消按鈕 */
.cancel-btn {
  background-color: #aaa;
}
.cancel-btn:hover {
  background-color: #888;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
select {
  width: 200px;
  padding: 5px;
}

.hidden {
  display: none;
}
</style>
-->
<!-- 不好看
<style scoped>
.container {
  height: auto;
  width: 800px;
}

.content {
  padding-top: 70px; 
}
/* 新增按鈕 */
.open-modal-btn {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}
.open-modal-btn:hover {
  background-color: #0056b3;
}

/* 按鈕樣式 */
.button {
  padding: 5px 10px;
  margin: 2px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
  border: none;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
}

.cancel-btn {
  background-color: #aaa;
}
.cancel-btn:hover {
  background-color: #888;
}

/* 懸浮視窗背景 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 內容區域 */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 關閉按鈕 */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

/* 表格樣式 */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table,
th,
td {
  border: 1px solid #ddd;
}

th,
td {
  padding: 10px;
  text-align: center;
}

th {
  cursor: pointer;
}

/* 表格排序箭頭樣式 */
th span {
  font-size: 16px;
  margin-left: 5px;
  cursor: pointer;
}

/* 表格操作按鈕 */
.edit-btn,
.delete-btn {
  padding: 5px 10px;
  border-radius: 5px;
}

.edit-btn {
  background-color: #4caf50;
}

.delete-btn {
  background-color: #f44336;
}
</style>
-->
<!--gpt的款式-->
<style scoped>
/* 整體容器樣式 */
.container {
  /*
  display: flex;
  flex-direction: column;
  */
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  width: 90%;
  margin: 0 auto; /* 水平置中 */
}

/* 內容區塊樣式 */
.content {
  background-color: #f4f4f4;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 標題和按鈕容器 */
.header-container {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  align-items: center;
  margin-bottom: 5px;
}

/* 標題樣式 */
h1 {
  font-size: 36px;
  color: #333;
  margin: 0;
}

h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

/* 按鈕樣式 */

/* 新增人員按鈕 */
.open-modal-btn {
  background-color: #12b51f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

.button,
.cancel-btn,
.search-btn {
  background-color: #00bcd4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

/* 懸停效果 */
.button:hover,
.cancel-btn:hover,
.search-btn:hover {
  background-color: #0097a7;
}

.open-modal-btn:hover {
  background-color: #05a112;
}

.export-btn {
  background-color: #8e5d0e;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

.export-btn:hover {
  background-color: #554305;
}

/* 搜尋欄位容器 */
.search-container {
  display: flex;
  gap: 10px;
  margin: 20px;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
}

/* 搜尋輸入框樣式 */
.search-input {
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 200px;
}

/* Modal 視窗樣式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  position: relative; /* 讓關閉按鈕相對於此容器定位 */
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.close-btn {
  background-color: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
  position: absolute;
  top: 10px;
  right: 10px;
}

/* 表單區域樣式 */
.form-group {
  margin-bottom: 15px;
}

label {
  font-size: 16px;
  display: flex;
  justify-content: space-between; /* 使 label 文字靠左，並讓表單元素水平置中 */
  align-items: center;
  margin-bottom: 10px; /* 增加標籤下方的間距 */
}

label span {
  width: 25%; /* 設置 label 文字區域的寬度 */
  text-align: left;
}

/* 表單輸入框樣式，設置寬度為80% */
input,
select {
  width: 80%; /* 設置寬度為 80% */
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: block;
  margin-left: auto;
  margin-right: auto; /* 使表單元素水平置中 */
}

.error-message {
  width: 100%;
  text-align: center;
  font-size: 15px;
  color: red;
}

.correct-message {
  width: 100%;
  text-align: center;
  color: green;
}

/* Modal 按鈕區塊 */
.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

/* 表格樣式 */
#user-table {
  width: 100%;
  border-collapse: collapse;
  /* table-layout: fixed;  */
  margin-top: 20px;
}

#user-table th,
#user-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

/* 表頭樣式 */
#user-table th {
  background-color: #00bcd4;
  color: white;
  cursor: pointer;
  width: 15%;
  text-align: left;
  padding: 8px;
  border: 1px solid #ddd;
}

/* 表格內容樣式 */
#user-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
  overflow: hidden; /* 防止內容過長時顯示超出範圍的部分 */
  text-overflow: ellipsis; /* 內容過長時顯示省略號 */
  white-space: nowrap; /* 不換行 */
}

#user-table td .button-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  gap: 10px; /* 按鈕之間的間隔 */
}

.button-container button {
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 編輯、刪除按鈕樣式 */
.edit-btn {
  background-color: #ffa500;
  color: white;
}

.edit-btn:hover {
  background-color: #e68900;
}

.delete-btn {
  background-color: #ff4081;
  color: white;
}

.delete-btn:hover {
  background-color: #e91e63;
}

/* 解除鎖定按鈕 */
.unlock-btn {
  background-color: #40cd86;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.unlock-btn:hover {
  background-color: #22a95f;
}
</style>

<!--
<template>
  <div class="user-list">
    <h2>人員管理</h2>
    <button @click="showModal = true" class="open-modal-btn">新增人員</button>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>
        <h2>新增人員</h2>
        <div class="form-group">
          <label
            >人員姓名：
            <input
              type="text"
              v-model="newUser.name"
              placeholder="輸入人員姓名"
            />
          </label>
        </div>
        <div class="form-group">
          <label
            >人員編號：
            <input
              type="text"
              v-model="newUser.id"
              placeholder="輸入人員編號"
            />
          </label>
        </div>
        <div class="form-group">
          <label
            >人員權限：
            <select v-model="newUser.role">
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
        </div>
        <div class="modal-actions">
          <button class="button" @click="addUser">新增人員</button>
          <button class="button cancel-btn" @click="closeModal">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false, // 控制Modal顯示
      newUser: { name: "", id: "", role: "User" },
    };
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
    addUser() {
      if (!this.newUser.name || !this.newUser.id) {
        alert("請輸入完整資料！");
        return;
      }
      alert(`已新增：${this.newUser.name}`);
      this.closeModal();
    },
  },
};
</script>

<style>
/* 按鈕樣式 */
.open-modal-btn {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.open-modal-btn:hover {
  background-color: #0056b3;
}

/* 模態視窗背景 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 模態視窗內容 */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  position: relative;
}

/* 右上角關閉按鈕 */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

/* 按鈕區域 */
.modal-actions {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

/* 取消按鈕 */
.cancel-btn {
  background-color: #aaa;
}
.cancel-btn:hover {
  background-color: #888;
}
</style>
-->
