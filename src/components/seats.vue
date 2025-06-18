<script setup>
import {ref, computed, inject} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import axios from 'axios';

// 获取父组件传递的数据
const pageIndex = inject('pageIndex');
const s_film = inject('film');
const s_showing = inject('show');
const user = inject('user');
const ticket = inject('ticket');

const SEAT_COLUMNS = 11;
const MAX_TICKETS = 5;

// 获取电影信息并初始化座位状态
const filmInfo1 = s_film.value;
const filmInfo2 = s_showing.value;
const seatflag = ref(filmInfo2.座位.split('\n').map(row => row.trim().split('').map(Number))); // 使用二维数组存储座位状态

const curSeat = ref([]);
const count = ref(0);

// 计算总价格
const totalPrice = computed(() => count.value * filmInfo2.price);

// 是否达到最大选择数量
const maxFlag = computed(() => count.value >= MAX_TICKETS);

// 当前选择的座位展示
const curSeatDisp = computed(() =>
    curSeat.value.map((item) => `${Math.floor(item / SEAT_COLUMNS) + 1}排${(item % SEAT_COLUMNS) + 1}号`)
);

// 处理点击事件
const handleClick = (rowIndex, colIndex) => {
  const seatStatus = seatflag.value[rowIndex][colIndex]; // 获取当前座位的状态

  if (seatStatus === 1) {
    unselectSeat(rowIndex, colIndex);
  } else if (seatStatus === 0 && count.value < MAX_TICKETS) {
    selectSeat(rowIndex, colIndex);
  } else if (seatStatus === 2) {
    ElMessage.warning("该座位不可用！");
  } else if (count.value >= MAX_TICKETS) {
    ElMessage.warning("最多只能选择五个座位！");
  }
};

// 选择座位
const selectSeat = (rowIndex, colIndex) => {
  seatflag.value[rowIndex][colIndex] = 1; // 标记为已选
  const index = rowIndex * SEAT_COLUMNS + colIndex; // 根据行列计算座位的全局索引
  curSeat.value.push(index);
  count.value++;
};

// 取消选择座位
const unselectSeat = (rowIndex, colIndex) => {
  seatflag.value[rowIndex][colIndex] = 0; // 标记为未选
  const index = rowIndex * SEAT_COLUMNS + colIndex; // 根据行列计算座位的全局索引
  const seatIndex = curSeat.value.findIndex((item) => item === index);
  curSeat.value.splice(seatIndex, 1);
  count.value--;
};

// 提交座位选择
const filmSubmit = async () => {
  const use = user.value.username;
  const filmname = filmInfo1.电影名称;
  const room = filmInfo2.房间;
  const showing_tm = filmInfo2.时间;
  const price = filmInfo2.price;

  // 检查用户是否登录
  if (!user.value.username) {
    ElMessage.warning("请先登录！");
    return;
  }

  // 提示选择的座位和总价


  // 构造提交的数据
  const postData = curSeat.value.map((seatIndex) => {
    const row = Math.floor(seatIndex / SEAT_COLUMNS) + 1; // 行号
    const col = (seatIndex % SEAT_COLUMNS) + 1; // 列号

    return {
      'user': use,          // 确保这里的变量名与定义时一致
      'film_name': filmname,
      'room': room,
      'showing_tm': showing_tm,
      'price': price,
      'row': row,           // 行号
      'col': col            // 列号
    };
  });
  console.log(postData);

  // 发送 POST 请求

  const response = await axios.post('/api/Ticket/Buy', postData, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (response.data.success) {
    ElMessage.success("购票成功！");
  }
  ElMessage.success(
      `您已选择 ${curSeatDisp.value.join(", ")}，总价为 ${totalPrice.value} 元！`
  );

  ElMessageBox.confirm(
      '购买成功，是否需要查看订单？点击确认前往订单页，取消则保持在当前页面。',
      '确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }
  ).then(() => {
    // 用户点击确认后跳转到订单页面
    pageIndex.value = '6';  // 跳转到订单页面
  }).catch(() => {
    // 用户点击取消后，保持在当前页面
    console.log('保持在当前页面');
  });

};
</script>


<template>
  <el-row :gutter="20" class="container">
    <el-col :span="14" class="seats">
      <h1 id="screen">屏幕</h1>
      <div class="seat-grid">
        <!-- 使用 v-for 渲染每一行 -->
        <div v-for="(row, rowIndex) in seatflag" :key="rowIndex" class="seat-row">
          <!-- 使用 v-for 渲染每个座位 -->
          <div
              v-for="(seat, colIndex) in row"
              :key="colIndex"
              class="seat"
              :class="{
              noSeat: seat === -1,
              seatSpace: seat === 0,
              seatActive: seat === 1,
              seatNoUse: seat === 2
            }"
              @click="handleClick(rowIndex, colIndex)"
          ></div>
        </div>
      </div>
      <div class="seat-notices" style="margin-bottom: 10px">
        <div class="seat-notice seatActive"></div>
        <span>已选座位</span>
        <div class="seat-notice seatSpace"></div>
        <span>可选座位</span>
        <div class="seat-notice seatNoUse"></div>
        <span>售出座位</span>
      </div>
    </el-col>

    <el-col :span="10" style="margin-top: 3px">
      <el-card shadow="hover" class="info-card">
        <div slot="header">
          <h2>影片信息</h2>
        </div>
        <el-row>
          <el-col :span="8">
            <img :src="filmInfo1.照片" alt="影片海报" class="film-poster"/>
          </el-col>
          <el-col :span="16">
            <p><strong>中文名：</strong>{{ filmInfo1.电影名称 }}</p>
            <!--            <p><strong>英文名：</strong>暂无</p>-->
            <!--            <p><strong>剧情：</strong>暂无</p>-->
            <!--            <p><strong>版本：</strong>暂无</p>-->
            <!--            <p><strong>时长：</strong>暂无</p>-->
            <!--            <p><strong>上映：</strong>暂无</p>-->
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <p><strong>影院：</strong>万达影院</p>
        <p><strong>影厅：</strong>{{ filmInfo2.房间 }}</p>
        <p><strong>场次：</strong>{{ filmInfo2.时间 }}</p>
        <p><strong>座位：</strong>{{ curSeatDisp.join(", ") }}</p>
        <p>
          已选择 <strong style="color: red;">{{ count }}</strong> 个座位
          <span v-if="maxFlag" style="color: red;">（最多选5个座位！）</span>
        </p>
        <p><strong>单价：</strong>{{ filmInfo2.price }} 元</p>
        <p><strong>总价：</strong><span style="color: red;">{{ totalPrice }}</span> 元</p>
        <el-button
            type="success"
            size="large"
            @click="filmSubmit()"
            :disabled="count === 0"
            class="submit-btn"
            style="margin-bottom: 30px"
        >
          确认信息，下单
        </el-button>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
.container {
  padding: 20px;
  margin-top: 40px;
}

.seats {
  text-align: center;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease; /* 添加平滑过渡效果 */
}

.seats:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* 更强烈的阴影效果 */
}

#screen {
  margin-bottom: 20px;
  font-size: 24px;
}

.seat-grid {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

.seat-row {
  display: flex;
  gap: 7px; /* 控制座位之间的横向间距 */
  justify-content: center; /* 居中显示每一行座位 */
  margin-bottom: 15px; /* 增加行与行之间的上下边距 */
}

.seat {
  width: 40px;
  height: 40px;
  background-color: #f5f5f5;
  cursor: pointer;
  border: 1px solid #ccc;
  transition: all 0.3s;
  margin-top: 8px; /* 增加座位与座位之间的上下边距 */
  margin-bottom: 10px; /* 增加座位与座位之间的上下边距 */
}

.seatActive {
  background-color: #4caf50;
}

.seatNoUse {
  background-color: #d9534f;
}

.noSeat {
  background-color: transparent;
}

.seat-notices {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.seat-notice {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
}

.info-card {
  padding: 20px;
}

.film-poster {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.submit-btn {
  margin-top: 20px;
  width: 100%;
}
</style>
