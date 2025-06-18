<script setup>
import { ref, inject } from 'vue';
import axios from "axios";
const pageIndex = inject('pageIndex');
const user = inject('user');
const username = ref('');
const password = ref('');

const login = async () => {
  try {
    const response = await axios.post('api/User/Login', { username: username.value, password: password.value });
    // 假设登录成功后返回一个 token
    localStorage.setItem('token', response.data.token); // 存储 token
    user.value = { username: username.value }; // 保存用户信息
    alert('登录成功');
    pageIndex.value = '1'; // 登录成功后跳转到首页
  } catch (error) {
    console.error('登录失败:', error);
    alert('登录失败，请检查用户名或密码');
  }
};

const register = async () => {
  try {
    const response = await axios.post('api/User/Register', { username: username.value, password: password.value });
    alert('注册成功，请输入账号密码以进行登录');
  } catch (error) {
    console.error('注册失败:', error);
    alert('注册失败，请检查输入信息');
  }
};
</script>

<template>
  <el-main>
    <div class="container" id="app" style="margin-top: 80px">
      <div class="row">
        <p>用户名
          <el-input type="text" v-model="username" placeholder="请输入用户名"></el-input>
        </p>
        <p>密码
          <el-input type="password" v-model="password" placeholder="请输入密码"></el-input>
        </p>
        <p class="button-group">
          <el-button @click="register" type="info" class="form-button">注册</el-button>
          <el-button @click="login" type="primary" class="form-button">登录</el-button>
        </p>
      </div>
    </div>
  </el-main>
</template>
<style>
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #fffefe; /* 设置背景图片路径 */
  background-size: cover; /* 图片大小覆盖整个背景 */
  background-position: center; /* 图片位置居中 */
  background-repeat: no-repeat; /* 不重复背景图片 */
}
</style>

<style scoped>


.container {
  width: 300px;
  margin: 0 auto; /* 水平居中 */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  opacity: 95%;
}

/* 行内元素之间的间距 */
.row p {
  margin-bottom: 20px;
}

/* 输入框样式 */
.el-input {
  width: 100%;
  border-radius: 5px; /* 圆角 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 添加输入框阴影 */
  padding: 8px 12px;
}

/* 给按钮添加一些间距和圆角 */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.form-button {
  width: 48%;
  padding: 10px;
  border-radius: 5px;
  text-align: left; /* 左对齐按钮文本 */
}



.el-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 鼠标悬停时的阴影效果 */
}

.el-button--info:hover {
  background-color: #7cb342; /* 注册按钮悬停颜色 */
}

.el-button--primary:hover {
  background-color: #1976d2; /* 登录按钮悬停颜色 */
}

.el-input__inner {
  padding: 10px; /* 输入框内部内边距 */
}

</style>
