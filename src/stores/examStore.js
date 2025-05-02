// stores/examStore.js
import { defineStore } from "pinia";

export const useExamStore = defineStore("exam", {
  state: () => ({
    currentExam: null,
  }),
  actions: {
    setCurrentExam(exam) {
      this.currentExam = exam;
    },
  },
});
