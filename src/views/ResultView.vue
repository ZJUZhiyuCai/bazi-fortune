<template>
  <div class="result-container">
    <div class="result-card">
      <h1>您的{{ currentYear }}年运势预测</h1>
      
      <div class="user-info">
        <p><strong>姓名：</strong>{{ userInfo.name }}</p>
        <p><strong>出生日期：</strong>{{ formatDate(userInfo.birthdate) }} {{ formatHour(userInfo.birthHour) }}</p>
      </div>
      
      <div class="bazi-info">
        <h2>您的生辰八字</h2>
        <div class="bazi-columns">
          <div class="bazi-column">
            <div class="column-title">年柱</div>
            <div class="column-value">{{ baZiInfo.yearColumn }}</div>
          </div>
          <div class="bazi-column">
            <div class="column-title">月柱</div>
            <div class="column-value">{{ baZiInfo.monthColumn }}</div>
          </div>
          <div class="bazi-column">
            <div class="column-title">日柱</div>
            <div class="column-value">{{ baZiInfo.dayColumn }}</div>
          </div>
          <div class="bazi-column">
            <div class="column-title">时柱</div>
            <div class="column-value">{{ baZiInfo.hourColumn }}</div>
          </div>
        </div>
        <p class="shengxiao">生肖：{{ baZiInfo.shengXiao }}</p>
      </div>
      
      <div class="overall-fortune">
        <h2>总体运势</h2>
        <div class="chart-container">
          <v-chart class="chart" :option="gaugeOption" autoresize />
        </div>
        <p>{{ overallDescription }}</p>
      </div>
      
      <div class="fortune-details">
        <div class="chart-container">
          <v-chart class="chart" :option="radarOption" autoresize />
        </div>
        <el-tabs type="card">
          <el-tab-pane label="事业运">
            <div class="fortune-item">
              <h3>事业运势 <span class="rating">{{ careerRating }}/10</span></h3>
              <p>{{ careerDescription }}</p>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="财运">
            <div class="fortune-item">
              <h3>财富运势 <span class="rating">{{ wealthRating }}/10</span></h3>
              <p>{{ wealthDescription }}</p>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="感情运">
            <div class="fortune-item">
              <h3>感情运势 <span class="rating">{{ loveRating }}/10</span></h3>
              <p>{{ loveDescription }}</p>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="健康运">
            <div class="fortune-item">
              <h3>健康运势 <span class="rating">{{ healthRating }}/10</span></h3>
              <p>{{ healthDescription }}</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="action-buttons">
        <el-button type="primary" @click="shareResult">分享结果</el-button>
        <el-button @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { calculateBaZi, analyzeWuXing, generateFortune } from '../utils/bazi'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart, GaugeChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'

use([
  CanvasRenderer,
  RadarChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

const route = useRoute()
const router = useRouter()

// 获取当前年份
const currentYear = new Date().getFullYear()

// 用户信息
const userInfo = reactive({
  name: '',
  birthdate: '',
  birthHour: '',
  gender: ''
})

// 八字信息
const baZiInfo = reactive({
  yearColumn: '',
  monthColumn: '',
  dayColumn: '',
  hourColumn: '',
  shengXiao: ''
})

// 运势评分
const overallRating = ref(3)
const careerRating = ref(7)
const wealthRating = ref(8)
const loveRating = ref(6)
const healthRating = ref(7)

// 运势描述
const overallDescription = ref('')
const careerDescription = ref('')
const wealthDescription = ref('')
const loveDescription = ref('')
const healthDescription = ref('')

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 格式化时辰
const formatHour = (hour) => {
  const hourMap = {
    '23': '子时 (23:00-1:00)',
    '1': '丑时 (1:00-3:00)',
    '3': '寅时 (3:00-5:00)',
    '5': '卯时 (5:00-7:00)',
    '7': '辰时 (7:00-9:00)',
    '9': '巳时 (9:00-11:00)',
    '11': '午时 (11:00-13:00)',
    '13': '未时 (13:00-15:00)',
    '15': '申时 (15:00-17:00)',
    '17': '酉时 (17:00-19:00)',
    '19': '戌时 (19:00-21:00)',
    '21': '亥时 (21:00-23:00)'
  }
  return hourMap[hour] || ''
}

// 初始化数据
const initData = () => {
  try {
    // 从路由参数获取数据
    const { name, birthdate, birthHour, gender, baZiInfo: baZiStr, wuXingAnalysis: wuXingStr } = route.query
    
    if (!name || !birthdate || !birthHour || !gender) {
      ElMessage.error('数据不完整，请重新填写')
      router.push('/')
      return
    }

    // 设置用户信息
    Object.assign(userInfo, {
      name,
      birthdate,
      birthHour,
      gender
    })

    // 解析八字信息
    const baZiData = JSON.parse(baZiStr)
    Object.assign(baZiInfo, baZiData)

    // 解析五行分析
    const wuXingData = JSON.parse(wuXingStr)
    
    // 生成运势预测
    const fortune = generateFortune(baZiData, wuXingData)
    
    // 设置运势描述
    overallDescription.value = fortune.fortune.overall || '今年整体运势不错，有贵人相助，事业有所突破，财运稳定增长。注意健康和情感平衡，保持积极心态，把握机遇。'
    careerDescription.value = fortune.fortune.career
    wealthDescription.value = fortune.fortune.wealth
    loveDescription.value = fortune.fortune.love
    healthDescription.value = fortune.fortune.health

  } catch (error) {
    console.error('初始化数据失败：', error)
    ElMessage.error('数据加载失败，请重试')
    router.push('/')
  }
}

// 返回首页
const goHome = () => {
  router.push('/')
}

// 生成分享图片
const generateShareImage = async () => {
  try {
    // 生成当前页面URL的二维码
    const currentUrl = window.location.href
    const qrCodeDataUrl = await QRCode.toDataURL(currentUrl, {
      width: 100,
      margin: 2,
      color: {
        dark: '#b388ff',
        light: '#ffffff'
      }
    })

    // 创建二维码图片元素
    const qrImg = document.createElement('img')
    qrImg.src = qrCodeDataUrl
    qrImg.style.position = 'absolute'
    qrImg.style.bottom = '20px'
    qrImg.style.right = '20px'
    qrImg.style.width = '100px'
    qrImg.style.height = '100px'
    
    // 将二维码临时添加到结果卡片
    const resultCard = document.querySelector('.result-card')
    resultCard.style.position = 'relative'
    resultCard.appendChild(qrImg)

    // 生成图片
    const canvas = await html2canvas(resultCard, {
      backgroundColor: '#1a1a2e',
      scale: 2,
      logging: false,
      useCORS: true
    })

    // 移除临时添加的二维码
    resultCard.removeChild(qrImg)

    // 转换为图片并下载
    const imgData = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `八字运势_${userInfo.name}.png`
    link.href = imgData
    link.click()

    ElMessage.success('分享图片已生成')
  } catch (error) {
    console.error('生成分享图片失败:', error)
    ElMessage.error('生成分享图片失败，请重试')
  }
}

// 替换原有的 shareResult 函数
const shareResult = async () => {
  await generateShareImage()
}

// 雷达图配置
const radarOption = computed(() => ({
  radar: {
    indicator: [
      { name: '事业运', max: 10 },
      { name: '财运', max: 10 },
      { name: '感情运', max: 10 },
      { name: '健康运', max: 10 }
    ],
    radius: '65%',
    splitNumber: 5,
    axisName: {
      color: '#e6e6fa'
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 197, 252, 0.2)'
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(30, 25, 44, 0.3)', 'rgba(40, 35, 54, 0.3)']
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(142, 197, 252, 0.2)'
      }
    }
  },
  series: [{
    type: 'radar',
    data: [{
      value: [careerRating.value, wealthRating.value, loveRating.value, healthRating.value],
      name: '运势分析',
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        color: '#b388ff',
        width: 2
      },
      areaStyle: {
        color: 'rgba(179, 136, 255, 0.3)'
      },
      itemStyle: {
        color: '#b388ff'
      }
    }]
  }],
  tooltip: {
    trigger: 'item'
  }
}))

// 仪表盘配置
const gaugeOption = computed(() => ({
  series: [{
    type: 'gauge',
    startAngle: 180,
    endAngle: 0,
    min: 0,
    max: 100,
    splitNumber: 5,
    radius: '100%',
    itemStyle: {
      color: '#b388ff',
      shadowColor: 'rgba(179, 136, 255, 0.5)',
      shadowBlur: 10
    },
    progress: {
      show: true,
      roundCap: true,
      width: 18
    },
    pointer: {
      show: false
    },
    axisLine: {
      roundCap: true,
      lineStyle: {
        width: 18,
        color: [
          [0.3, '#ff4757'],
          [0.7, '#ffd700'],
          [1, '#2ed573']
        ]
      }
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      show: false
    },
    title: {
      show: false
    },
    detail: {
      valueAnimation: true,
      offsetCenter: [0, '0%'],
      fontSize: 36,
      fontWeight: 'bold',
      color: '#e6e6fa',
      formatter: '{value}%'
    },
    data: [{
      value: overallRating.value * 20
    }]
  }]
}))

onMounted(() => {
  initData()
})
</script>

<style scoped>
.result-container {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.result-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: rgba(26, 26, 46, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.8s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.2em;
  font-weight: bold;
  text-shadow: 0 0 20px rgba(157, 80, 187, 0.5);
  background: linear-gradient(120deg, #b388ff 0%, #8e72dc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2 {
  color: #fff;
  font-size: 1.8em;
  margin-bottom: 20px;
  text-shadow: 0 0 15px rgba(142, 197, 252, 0.5);
}

.user-info {
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(30, 25, 44, 0.9);
  border-radius: 12px;
  border: 1px solid rgba(142, 197, 252, 0.2);
}

.user-info p {
  color: #e6e6fa;
  margin: 10px 0;
  font-size: 1.1em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.user-info strong {
  color: #b388ff;
  margin-right: 10px;
}

.bazi-info {
  margin-bottom: 40px;
  text-align: center;
  padding: 20px;
  background: rgba(30, 25, 44, 0.9);
  border-radius: 12px;
  border: 1px solid rgba(142, 197, 252, 0.2);
}

.bazi-columns {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.bazi-column {
  background: rgba(40, 35, 54, 0.95);
  padding: 20px;
  border-radius: 8px;
  min-width: 120px;
  border: 1px solid rgba(142, 197, 252, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.column-title {
  color: #b388ff;
  margin-bottom: 12px;
  font-size: 1.1em;
  font-weight: bold;
}

.column-value {
  color: #fff;
  font-size: 1.4em;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.shengxiao {
  color: #e6e6fa;
  margin-top: 20px;
  font-size: 1.2em;
  font-weight: bold;
}

.overall-fortune {
  margin-bottom: 40px;
  text-align: center;
  padding: 20px;
  background: rgba(30, 25, 44, 0.9);
  border-radius: 12px;
  border: 1px solid rgba(142, 197, 252, 0.2);
}

.overall-fortune p {
  color: #e6e6fa;
  font-size: 1.1em;
  line-height: 1.8;
  margin-top: 20px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.chart-container {
  width: 100%;
  height: 300px;
  margin: 20px 0;
  background: rgba(30, 25, 44, 0.9);
  border-radius: 12px;
  border: 1px solid rgba(142, 197, 252, 0.2);
  padding: 20px;
}

.chart {
  width: 100%;
  height: 100%;
}

.fortune-details {
  margin-bottom: 40px;
}

.fortune-item {
  padding: 30px;
  background: linear-gradient(145deg, rgba(40, 35, 54, 0.95), rgba(60, 50, 80, 0.95));
  border-radius: 16px;
  margin-bottom: 25px;
  border: 1px solid rgba(142, 197, 252, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.fortune-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.fortune-item h3 {
  color: #b388ff;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3em;
  border-bottom: 1px solid rgba(142, 197, 252, 0.2);
  padding-bottom: 10px;
}

.rating {
  color: #ffd700;
  font-size: 1em;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  background: rgba(255, 215, 0, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.fortune-item p {
  color: #e6e6fa;
  line-height: 1.8;
  font-size: 1.1em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

:deep(.el-tabs__item) {
  color: #b388ff !important;
  font-size: 1.1em !important;
  padding: 0 25px !important;
}

:deep(.el-tabs__item.is-active) {
  color: #fff !important;
  font-weight: bold !important;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: rgba(142, 197, 252, 0.2) !important;
}

:deep(.el-button) {
  font-size: 1.1em !important;
  padding: 12px 30px !important;
  border-radius: 8px !important;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #9d50bb, #6e48aa) !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(157, 80, 187, 0.3) !important;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #b388ff, #8e72dc) !important;
  transform: translateY(-2px);
}

:deep(.el-button--default) {
  background: rgba(40, 35, 54, 0.95) !important;
  border: 1px solid rgba(142, 197, 252, 0.3) !important;
  color: #e6e6fa !important;
}

:deep(.el-button--default:hover) {
  background: rgba(50, 45, 64, 0.95) !important;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .result-card {
    padding: 20px;
  }
  
  .bazi-columns {
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .bazi-column {
    min-width: calc(50% - 15px);
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  :deep(.el-button) {
    width: 100%;
  }
}
</style>