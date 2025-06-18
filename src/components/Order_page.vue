<script setup>
import {ref, computed, onMounted, inject} from 'vue';
import {ElMessageBox, ElMessage, ElLoading} from 'element-plus';
import {fetchFilms} from '../utils/api.js';
import {fetchTicket} from "../utils/api.js";
import axios from 'axios';

// 获取用户信息
const user = inject('user'); // 假设 `user` 是通过 inject 传入的当前用户对象
const username = user?.username || ''; // 获取当前用户名

// 定义存储电影和票务的变量
const films = ref([]); // 存储电影信息
const tickets = ref([]); // 存储票务信息

// 分页相关
const currentPage = ref(1);
const pageSize = ref(4);

// 计算属性，用于获取当前页的数据
const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tickets.value.slice(start, end);
});

onMounted(async () => {
  try {
    const response = await fetchFilms();
    films.value = response.data; // 获取电影数据

    await fetchTicket(); // 获取票务信息并进行过滤
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
onMounted(async () => {
  try {
    const response = await fetchTicket()
    let allTickets = response.data;
    tickets.value = allTickets.filter(ticket => ticket.user === user.value.username);
    console.log('过滤后的票务数据:', tickets.value);
  } catch (error) {
    console.error('Error fetching tickets:', error);
  }
})
// const fetchTicket = async () => {
//   try {
//     const response = await axios.get('api/Ticket/TicketList');
//     let allTickets = response.data;
//     tickets.value = allTickets.filter(ticket => ticket.user === user.value.username);
//     console.log('过滤后的票务数据:', tickets.value);
//   } catch (error) {
//     console.error('Error fetching tickets:', error);
//   }
// };

const deleteTicket = async (ticketId) => {
  try {
    const loading = ElLoading.service({fullscreen: true});
    const response = await axios.delete(`/api/Ticket/Cancel?id=${ticketId}`);
    if (response.status === 200) {
      tickets.value = tickets.value.filter(ticket => ticket.id !== ticketId);
      ElMessage({
        message: '退票成功！',
        type: 'success'
      });
    } else {
      ElMessage.error('退票失败');
    }
    loading.close();
  } catch (error) {
    ElMessage.error('取消票务请求失败');
    console.error('取消票务请求失败:', error);
  }
};

const cancelTicketAction = async (ticket) => {
  try {
    const confirmCancel = await ElMessageBox.confirm(
        '您确定要取消这张票吗？',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    );

    if (confirmCancel === 'confirm') {
      await deleteTicket(ticket.id);
    }
  } catch (error) {
    console.error('取消票务操作被取消或发生错误:', error);
  }
};

// 获取电影海报的方法
const getMovieImage = (filmName) => {
  const movie = films.value.find(item => item['电影名称'] === filmName);
  return movie ? movie['照片'] : ''; // 返回对应电影的图片
};

// 切换页码时触发
const handlePageChange = (page) => {
  currentPage.value = page;
};
</script>
<template>
  <el-main>

    <div class="container" id="app">

      <!--      <h1 class="title">个人中心</h1>-->
      <!--      <div class="sidebar">-->
      <!--        <button @click="showMyOrders" :class="{ active: activeTab === 'myOrders' }">我的订单</button>-->
      <!--        <button @click="showMyInfo" :class="{ active: activeTab === 'myInfo' }">我的信息</button>-->
      <!--      </div>-->
      <div class="row">
        <el-table :data="paginatedTickets" style="width: 100%;">
          <!-- 电影名称列 -->
          <el-table-column prop="film_name" label="电影名称" width="100" align="center">
            <template #header>
              <span style="text-align: center; display: block;">电影名称</span>
            </template>
          </el-table-column>

          <!-- 照片列 -->
          <el-table-column label="照片" width="180" align="center">
            <template #default="scope">
              <img :src="getMovieImage(scope.row.film_name)" alt="电影海报" style="width: 100px; height: auto;">
            </template>
          </el-table-column>

          <!-- 座位位置列 -->
          <el-table-column label="座位位置" width="200" align="center">
            <template #default="scope">
              <span>{{ `${scope.row.row}行 , ${scope.row.col}列 ` }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="100" align="center"></el-table-column>
          <el-table-column prop="showing_tm" label="放映时间" width="100" align="center"></el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="info" @click="cancelTicketAction(scope.row)" class="cancle-button">退订</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination
            layout="prev, pager, next"
            :total="tickets.length"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
            style="margin-top: 20px; text-align: center;"
        />
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
  max-width: 1200px;
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
  text-align: center;
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
.cancle-button {
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: block;
  margin: 0 auto;
  background-color: #909399;
}

.cancle-button:hover, .cancle-button:focus {
  background-color: #d3d7df;
  transform: scale(0.98);
}
</style>