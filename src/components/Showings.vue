<script setup>
import {inject, ref, computed, onMounted} from 'vue';
import axios from "axios";
import {ElMessage, ElMessageBox, ElLoading} from "element-plus";
import {fetchShowing} from "../utils/api.js";

const s_film = inject('film');
const user = inject('user');
const pageIndex = inject('pageIndex');
const s_showing = inject('show');

const showing = ref([]);
console.log(s_film.value)

// 获取上映信息
// const fetchShowing = async () => {
//   try {
//     const response = await axios.get('api/Showing/ShowingList');
//     showing.value = response.data;
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
onMounted(async () => {
  try {
    const response = await fetchShowing();
    showing.value = response.data;
  } catch (error) {
    console.error('Failed to fetch showings:', error);
  }
});


// 过滤上映的电影
const filteredShowings = computed(() => {
  if (Array.isArray(showing.value) && s_film?.value?.电影名称) {
    return showing.value.filter(showing => showing.电影名称 === s_film.value.电影名称);
  }
  return []; // 如果没有选择电影，返回空数组
});


// 购买操作
const buy = async (showingItem) => {
  if (!user.value) {
    ElMessage.warning('请先登录才能继续购买票！');
    pageIndex.value = '2'; // 跳转到登录页面
    return;
  }

  try {
    // 显示确认对话框并等待用户选择
    await ElMessageBox.confirm(
        `确定要购买这一场次的票吗？`,
        '购票确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    );

    // 模拟购票请求，并显示加载指示器
    const loading = ElLoading.service({fullscreen: true});

    // 假设实际购票逻辑（这里假设是异步操作）
    await new Promise((resolve) => setTimeout(resolve)); // 模拟网络延迟

    // 关闭加载指示器
    loading.close();

    // 更新全局状态或路由
    s_showing.value = showingItem; // 记录选中的场次
    pageIndex.value = '5';

    // 显示成功消息提示
    ElMessage({
      message: '购票成功！',
      type: 'success'
    });

  } catch (error) {
    // 如果用户点击了“取消”或关闭了对话框，则会抛出异常
    console.log('购票操作被取消或发生错误:', error);
    if (error !== 'cancel') { // 用户点击取消时不会触发错误信息
      ElMessage.error('购票失败，请稍后再试。');
    }
  }
};


</script>

<template>
  <el-main>
    <div class="container" id="app" style="margin-top: 30px">
      <!-- 如果没有选择电影，显示提示信息 -->
      <div v-if="!s_film?.电影名称" class="no-film-selected">
        <el-alert
          title="你还没有选择电影，不回去看看吗？"
          type="warning"
          show-icon
          center
          :closable="false"
        />
        <el-button @click="pageIndex='3'" type="warning">返回</el-button>
      </div>

      <!-- 如果有选择电影，显示表格或提示 -->
      <div v-else>
        <div v-if="filteredShowings.length > 0" class="row">
          <el-table :data="filteredShowings" style="width: 100%">
            <el-table-column prop="电影名称" label="电影名称" width="150" align="center">
              <template #header>
                <span style="text-align: center; display: block">电影名称</span>
              </template>
            </el-table-column>
            <el-table-column prop="房间" label="房间" width="150" align="center">
              <template #header>
                <span style="text-align: center; display: block">房间</span>
              </template>
            </el-table-column>
            <el-table-column prop="时间" label="时间" width="150" align="center">
              <template #header>
                <span style="text-align: center; display: block">时间</span>
              </template>
            </el-table-column>
            <el-table-column prop="座位" label="座位" width="150" align="center">
              <template #header>
                <span style="text-align: center; display: block">座位</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="150" align="center">
              <template #header>
                <span style="text-align: center; display: block">价格</span>
              </template>
            </el-table-column>
            <el-table-column label="购票" width="150" align="center">
              <template #header>
                <span style="text-align: center; display: block">购票</span>
              </template>
              <template #default="scope">
                <el-button type="info" style="font-size: 130%" @click="buy(scope.row)">购票</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </el-main>
</template>




<style scoped>
.no-film-selected {
  margin: 20px auto;
  text-align: center;
  font-size: 18px;
  color: #ff9800;
}

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