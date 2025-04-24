<script setup>
import { useIdleLogout } from "@/composables/useIdleLogout";

useIdleLogout(); // 這樣就啟動自動登出了！
// 或用 useIdleLogout(10); 設定為 10 分鐘
</script>


