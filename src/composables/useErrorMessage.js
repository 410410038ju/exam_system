import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

export function useErrorMessage() {
  const toast = useToast();
  const { t } = useI18n();

  const showError = (error) => {
    let code = 'unknown';

    if (typeof error === 'string') {
      code = error;
    } else if (error?.response?.data?.code) {
      // 從 API 回傳的錯誤結構提取錯誤碼
      code = error.response.data.code;
    } else if (error?.response?.status === 401) {
      code = 'unauthorized';
    } else if (error?.response?.status === 404) {
      code = 'notFound';
    } else if (error?.response?.status === 500) {
      code = 'serverError';
    }

    const message = t(`errors.${code}`);
    toast.error(message); // 顯示錯誤訊息
  };

  return { showError };
}
