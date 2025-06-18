<script setup>
import {inject, ref, onMounted} from 'vue';
import axios from 'axios';
import {ElMessage, ElMessageBox} from 'element-plus';
import {fetchFilms} from '../utils/api.js'

const pageIndex = inject('pageIndex');
const s_film = inject('film');
const films = ref([]);
const user = inject('user')

// const fetchFilms = async () => {
//   try {
//     const response = await axios.get('api/Film/List');
//     films.value = response.data;
//   } catch (error) {
//     console.error('Error fetching films:', error.message);
//     if (error.response) {
//       console.error('Response data:', error.response.data);
//       console.error('Response status:', error.response.status);
//       console.error('Response headers:', error.response.headers);
//     } else if (error.request) {
//       console.error('Request data:', error.request);
//     } else {
//       console.error('Error message:', error.message);
//     }
//   }
// };
// fetchFilms();
onMounted(async () => {
  try {
    const response = await fetchFilms()
    films.value = response.data

  } catch (error) {
    console.error('Failed to fetch films:', error)
  }
})
const buy = async (film) => {

  if (!user.value) {
    ElMessage.warning('您还没有登录，请先登录再进行购票');
    pageIndex.value = '2';
    return;
  }


  try {
    // 显示确认对话框并等待用户选择
    await ElMessageBox.confirm(
      `确定要购买《${film.电影名称}》的票吗？`,
      '购票确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    ElMessage({
      message: '购票成功！',
      type: 'success'
    });


    console.log(film);
    console.log(user.value);
    s_film.value = film;

    pageIndex.value = '4';

    // 这里可以添加实际的购票逻辑，比如发送API请求等

  } catch (error) {
    // 如果用户点击了“取消”或关闭了对话框，则会抛出异常，这里可以选择忽略或者记录日志
    console.log('购票操作被取消或发生错误:', error);
  }
};
</script>

<template>
  <el-main >
    <div class="container" id="app" style="margin-top: 42px;">
      <div class="row">
        <el-table :data="films" style="width: 100%;">
          <el-table-column prop="电影名称" label="电影名称" width="100" align="center">
            <template #header>
              <span style="text-align: center; display: block;">电影名称</span>
            </template>
          </el-table-column>
          <el-table-column label="照片" width="180" align="center">
            <template #header>
              <span style="text-align: center; display: block;">照片</span>
            </template>
            <template #default="scope">
              <img :src="scope.row.照片" alt="电影海报" style="width: 100px; height: auto;">
            </template>
          </el-table-column>
          <el-table-column prop="电影介绍" label="介绍" width="700" align="center">
            <template #header>
              <span style="text-align: center; display: block;">介绍</span>
            </template>
          </el-table-column>
          <el-table-column label="购票" width="150" align="center">
            <template #header>
              <span style="text-align: center; display: block;">购票</span>
            </template>
            <template #default="scope">
              <el-button type="info" @click="buy(scope.row)" class="buy-button">购票</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-main>
</template>

<style scoped>
.el-main {
  background-color: #f5f5f5;
  padding: 20px;
}

/* 容器设置 */
.container {
  max-width: 1200px; /* 可以根据需要调整最大宽度 */
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 表格样式 */
.el-table {
  font-size: 14px;
  color: #333;
  border-collapse: separate;
  border-spacing: 0;
  border: none;
  overflow: visible;
}

/* 列头样式 */
.el-table-column__header {
  background-color: #eef1f6;
  font-weight: bold;
  color: #333;
  padding: 12px 0;
  text-align: center; /* 居中对齐 */
}

/* 行样式 */
.el-table__row {
  transition: background-color 0.3s ease;
}

.el-table__row:hover {
  background-color: #f5f7fa;
}

/* 图片样式 */
.movie-poster {
  width: 150px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 按钮样式 */
.buy-button {
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block; /* 确保按钮块级显示 */
  margin: 0 auto; /* 水平居中 */
}

.buy-button:hover {
  background-color: #66b1ff;
}
</style>