<script setup>
import { ref, provide } from 'vue';
import axios from 'axios';
import seats from './components/seats.vue';
import Login from "./components/Login.vue";
import index from "./components/index.vue";
import Films from "./components/Films.vue";
import Showings from "./components/Showings.vue";
import Tails from "./components/tails.vue";
import Order_page from "./components/Order_page.vue";

const pageIndex = ref("1");
provide('pageIndex', pageIndex);

const film = ref(null);
provide('film', film);

const show = ref(null);
provide('show', show);

// 用户状态，null表示未登录
const user = ref(null);
provide('user', user);

const ticket = ref({
  id: null,
  user: '',
  film_name: '',
  room: '',
  showing_tm: '',
  price: '',
  row: 0,
  col: 0
});
provide('ticket', ticket);

// 登出处理
const handleLogout = () => {
  user.value = null;
  localStorage.removeItem('token'); // 清除token
  alert('退出成功！');
  pageIndex.value = '1';  // 跳转到首页
};

// 初始化时检查 token 并验证其有效性
const token = localStorage.getItem('token');
if (token) {
  // 发起请求验证 token 是否有效
  axios.post('api/User/ValidateToken', { token })
    .then(response => {
      if (response.data.valid) {
        // token有效，获取用户信息
        user.value = { username: response.data.username };
      } else {
        // token无效，清除 token 并提示用户重新登录
        localStorage.removeItem('token');
        alert('登录状态已过期，请重新登录');
      }
    })
    .catch(error => {
      console.error('验证 token 失败:', error);
      alert('登录状态验证失败，请重新登录');
      localStorage.removeItem('token');
    });
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header id="navTab" class="header">
        <nav class="navbar">
          <span class="el-dropdown-link" @click="pageIndex='1'" :class="{ active: pageIndex === '1' }">
            <img src="./assets/logo.png" alt="User Avatar" class="avatar " style="margin-top: -40px ;width: 140px;height: 140px">
          </span>
          <ul class="nav-list">
            <!-- 添加电影Logo -->
            <!-- 原有的导航链接 -->
            <li><a @click="pageIndex='1'" :class="{ active: pageIndex === '1' }">首页</a></li>
            <li><a @click="pageIndex='3'" :class="{ active: pageIndex === '3' }">电影列表</a></li>
            <li><a @click="pageIndex='4'" :class="{ active: pageIndex === '4' }">选择场次</a></li>
            <li><a @click="pageIndex='5'" :class="{ active: pageIndex === '5' }">选择座位</a></li>
            <li class="flex-grow"></li>
            <li>
              <el-dropdown trigger="hover" class="top-dropdown">
                <span class="el-dropdown-link">
                  <img src="./assets/Realme.png" alt="User Avatar" class="avatar " style="margin-top: -38px">
                </span>
                <template #dropdown>
                  <!-- 如果已登录，显示用户名、订单和退出按钮 -->
                  <el-dropdown-item v-if="user" class="username-item">{{ user.username }}</el-dropdown-item>
                  <el-dropdown-item v-if="user" @click="pageIndex='6'">我的订单</el-dropdown-item>
                  <el-dropdown-item v-if="user" @click="handleLogout">退出</el-dropdown-item>
                  <!-- 如果未登录，显示登录按钮 -->
                  <el-dropdown-item v-if="!user" @click="pageIndex='2'">登录</el-dropdown-item>
                  <el-dropdown-item v-if="!user" @click="pageIndex='2'">注册</el-dropdown-item>
                </template>
              </el-dropdown>
            </li>
          </ul>
        </nav>
      </el-header>
      <el-main class="main">
        <div v-if="pageIndex === '2'">
          <Login />
        </div>
        <div v-if="pageIndex === '1'">
          <index />
        </div>
        <div v-if="pageIndex === '3'">
          <Films />
        </div>
        <div v-if="pageIndex === '4'">
          <Showings />
        </div>
        <div v-if="pageIndex === '5'">
          <seats />
        </div>
        <div v-if="pageIndex === '6'">
          <Order_page />
        </div>
      </el-main>
      <el-footer>
        <tails />
      </el-footer>
    </el-container>
  </div>
</template>
<style>
body, html {
  margin: 0;
  padding: 0;
  background-image: url('src/assets/background.png');
  background-size: cover;
  background-position: center;

}
</style>

<style scoped>
.common-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #7799CC;
  color: white;
  padding: 10px 20px;
  height: 80px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
}

.nav-list .flex-grow {
  flex-grow: 1;
}

.nav-list li {
  display: inline;
  margin-right: 10px;
}

.nav-list a {
  text-decoration: none;
  color: white;
  font-size: 16px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.nav-list a:hover,
.nav-list a.active {
  background-color: #39c5bb;
  border-radius: 4px;
}

.logo-link {
  display: flex;
  align-items: center;
  padding: 0;
}

.logo {
  width: 40px; /* 根据需要调整 */
  height: 40px;
  border-radius: 8px;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.1);
}

.top-dropdown {
  position: relative;
}

.username-item {
  font-weight: bold;
}
</style>