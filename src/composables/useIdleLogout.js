
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

export function useIdleLogout(timeoutMinutes = 15) {
  const router = useRouter(); 
  let timeout;
  const timeoutMs = timeoutMinutes * 60 * 1000;

  const resetTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(logout, timeoutMs);
  };

  const logout = () => {
    alert("您已閒置超過 15 分鐘，將自動登出");
    localStorage.removeItem("authToken");
    localStorage.clear();
    sessionStorage.clear();
    router.push("/"); 
  };

  const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

  onMounted(() => {
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
    resetTimer(); // 初始化 timer
  });

  onUnmounted(() => {
    events.forEach((event) => {
      window.removeEventListener(event, resetTimer);
    });
    clearTimeout(timeout);
  });
}


/* 1分鐘前提醒
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

export function useIdleLogout({
  timeoutMinutes = 15,
  warningBeforeMinutes = 1,
  onLogout = null,
} = {}) {
  const router = useRouter(); 
  let logoutTimer;
  let warningTimer;

  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = timeoutMs - warningBeforeMinutes * 60 * 1000;

  const resetTimers = () => {
    clearTimeout(logoutTimer);
    clearTimeout(warningTimer);

    warningTimer = setTimeout(() => {
      // 提醒使用者是否還在使用
      const confirmed = window.confirm("您已閒置一段時間，是否繼續使用系統？");
      if (confirmed) {
        resetTimers(); // 使用者點了確認 → 重設計時器
      }
    }, warningMs);

    logoutTimer = setTimeout(() => {
      localStorage.removeItem("authToken");
      if (typeof onLogout === "function") {
        onLogout();
      } else {
        alert("您已閒置過久，系統已自動登出");
        router.push("/");
      }
    }, timeoutMs);
  };

  const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

  onMounted(() => {
    events.forEach((event) => {
      window.addEventListener(event, resetTimers);
    });
    resetTimers();
  });

  onUnmounted(() => {
    events.forEach((event) => {
      window.removeEventListener(event, resetTimers);
    });
    clearTimeout(logoutTimer);
    clearTimeout(warningTimer);
  });
}
*/

