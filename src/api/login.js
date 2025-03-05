import api from "./api";

async function loginUser(username, password) {
  try {
    const response = await api.post("/login", {
      username,
      password,
    });

    const { token, role } = response.data; // 假設後端回傳 token 和權限
    localStorage.setItem("token", token);
    localStorage.setItem("role", role); // 儲存使用者權限

    console.log("登入成功，權限:", role);
    return true;
  } catch (error) {
    console.error("登入失敗", error.response?.data || error.message);
    return false;
  }
}
