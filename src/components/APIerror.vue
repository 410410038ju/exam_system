<!-- <template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="modal-content">
      <p class="modal-text">{{ message }}</p>
      <button class="confirm-btn" @click="closeModal">確認</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  message: {
    type: String,
    default: "發生錯誤，請稍後再試",
  },
});

const emit = defineEmits(["update:modelValue"]);

const closeModal = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped>
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
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modal-text {
  margin-bottom: 20px;
  font-size: 16px;
  color: #e53935;
  white-space: pre-line;
}

.confirm-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-btn:hover {
  background-color: #d32f2f;
}
</style> -->

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay">
      <div class="modal-content">
        <p class="modal-text">{{ fullMessage }}</p>
        <button class="confirm-btn" @click="confirm">確認</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";
import { routeLocationKey } from "vue-router";

const props = defineProps({
  modelValue: Boolean,
  message: {
    type: Object,
    default: () => ({
      status: 0,
      code: 0,
      message: "發生錯誤，請稍後再試",
    }),
  },
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const closeModal = () => {
  emit("update:modelValue", false);
};

// 確認按鈕的動作
const confirm = () => {
  emit("confirm"); // 觸發父層的跳轉事件
  closeModal();
};

// 根據錯誤 code 加附加說明
const fullMessage = computed(() => {
  const { status, code, message } = props.message;
  let suffix = "\n如有疑問請聯絡管理員";

  switch (status) {
    case 400:
      suffix = "\n尚未登入，請重新登入";
      break;
    case 401:
      suffix = "\n身分驗證已過期，請重新登入";
      break;
    case 403:
      suffix = "\n您沒有操作權限";
      break;
    case 404:
      suffix = "\n找不到資源，請確認網址或操作";
      break;
    case 500:
      suffix = "\n伺服器異常，請稍後再試";
      break;
    case "timeout":
      suffix = "\n連線逾時，請檢查網路";
      break;
  }

  //   return message + suffix;
  return suffix;
});
</script>

<style scoped>
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
  z-index: 99999;
}

.modal-content {
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  max-width: 400px;
}

.modal-text {
  margin-bottom: 20px;
  font-size: 16px;
  color: #e53935;
  white-space: pre-line;
}

.confirm-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-btn:hover {
  background-color: #d32f2f;
}
</style>
