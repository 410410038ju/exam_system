import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import Home from "../views/Home.vue";
import ChangePassword from "../views/ChangePassword.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import UserDashboard from "../views/UserDashboard.vue";
import UserList from "../views/admin/UserList.vue";
import CreateQuestion from "../views/admin/CreateQuestion.vue";
import ModifyQuestion from "../views/admin/ModifyQuestion.vue";
import ManageQuestionBankTypes from "../views/admin/ManageQuestionBankTypes.vue";
import OpenExam from "../views/admin/OpenExam.vue";
import ViewExamRecords from "../views/admin/ViewExamRecords.vue";
import ScoreList from "../views/admin/ScoreList.vue";
import CreateQuestionData from "../views/admin/create_question/CreateQuestionData.vue";
import Testing from "../views/user/testing.vue";
import Answer from "../views/user/answer.vue";
import ExamInfo from "../views/admin/exam-info/ExamInfo.vue";
import AnswerRecord from "../views/admin/exam-info/AnswerRecord.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "首頁" }, //設定標題
  },
  {
    path: "/change-password",
    name: "change-password",
    component: ChangePassword,
    meta: { title: "修改密碼" },
  },
  {
    path: "/user",
    name: "UserDashboard",
    component: UserDashboard,
    meta: { title: "考生頁面" },
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { title: "管理者頁面" },
  },
  {
    path: "/user_list",
    name: "UserList",
    component: UserList,
    meta: { title: "人員管理" },
  },
  {
    path: "/create_question",
    name: "CreateQuestion",
    component: CreateQuestion,
    meta: { title: "新增題目" },
  },
  {
    path: "/modify_question",
    name: "ModifyQuestion",
    component: ModifyQuestion,
    meta: { title: "題目管理" },
  },
  {
    path: "/manage_question_bank_types",
    name: "ManageQuestionBankTypes",
    component: ManageQuestionBankTypes,
    meta: { title: "管理題目類別" },
  },
  {
    path: "/open_exam",
    name: "OpenExam",
    component: OpenExam,
    meta: { title: "新增測驗" },
  },
  {
    path: "/view_exam_records",
    name: "ViewExamRecords",
    component: ViewExamRecords,
    meta: { title: "測驗管理" },
  },
  {
    path: "/score_list",
    name: "ScoreList",
    component: ScoreList,
    meta: { title: "成績列表" },
  },
  {
    path: "/create_question_data",
    name: "CreateQuestionData",
    component: CreateQuestionData,
    meta: { title: "出題" },
  },
  {
    path: "/exam_info",
    name: "ExamInfo",
    component: ExamInfo,
    meta: { title: "測驗詳情" },
  },
  {
    path: "/answer_record",
    name: "AnswerRecord",
    component: AnswerRecord,
    meta: { title: "作答紀錄" },
  },
  {
    path: "/testing",
    name: "Testing",
    component: Testing,
    meta: { title: "測驗" },
  },
  {
    path: "/answer",
    name: "Answer",
    component: Answer,
    meta: { title: "查看解答" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(import.meta.env.BASE_URL), // 使用 Hash #
  routes,
});

// 監聽路由變化，更新 title
router.afterEach((to) => {
  document.title = to.meta.title || "預設標題";
});

export default router;
