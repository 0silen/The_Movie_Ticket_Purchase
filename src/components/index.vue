<script setup>
import { inject, ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';  // 引入 ElMessageBox
import { fetchFilms } from '../utils/api.js';

const pageIndex = inject('pageIndex');
const s_film = inject('film');
const films = ref([]);
const user = inject('user');

onMounted(async () => {
  try {
    const response = await fetchFilms();
    films.value = response.data; // 假设返回的数据是一个数组
  } catch (error) {
    console.error('Failed to fetch films:', error);
  }
});

// 显示完整电影简介的对话框
const showFullDescription = (film) => {
  ElMessageBox.alert(film.电影介绍, '电影简介', {
    confirmButtonText: '关闭',
    callback: () => {
      ElMessage({
        type: 'info',
        message: '已关闭电影简介'
      });
    },
  });
};
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
  <div class="home" style="margin-top: 30px">
    <!-- Carousel Section -->
    <el-carousel trigger="hover" height="300px" class="carousel">
      <el-carousel-item v-for="(film, index) in films" :key="index">
        <img :src="film.照片" :alt="film.电影名称" class="carousel-img"/>
      </el-carousel-item>
    </el-carousel>

    <!-- Movie List Section -->
    <section class="movie-list">
      <h2>当前热映电影</h2>
      <div class="movies" style="z-index: 99999">
        <el-card
          v-for="(film, index) in films"
          :key="index"
          :body-style="{ padding: '20px' }"
          class="movie-card"
        >
          <div class="movie-card-content">
            <img :src="film.照片" :alt="film.电影名称" class="movie-img"/>
            <div class="movie-info">
              <h3>{{ film.电影名称 }}</h3>
              <p class="movie-description">{{ film.电影介绍 }}</p>
              <el-button type="text" @click="showFullDescription(film)">展开</el-button>
              <el-button type="primary" @click="buy(film)">立即购票</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
}

.carousel {
  margin: 20px 0;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-list {
  margin-top: -38px;
  padding: 1rem;
}

.movies {
  margin-top: -8px;
  display: flex;
  justify-content: space-around;
  gap: 20px;
  flex-wrap: wrap;
}

.movie-card {
  width: 240px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.movie-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.movie-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

.movie-info {
  padding: 1rem;
  text-align: center;
}

.movie-info h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.movie-info p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;  /* 限制显示3行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Add some spacing and style for the expand button */
.movie-info el-button {
  margin-top: 10px;
}
</style>
