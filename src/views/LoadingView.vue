<template>
  <div class="loading-container">
    <div class="loading-content">
      <div class="fortune-wheel"></div>
      <h2>正在测算您的运势...</h2>
      <p>{{ loadingMessage }}</p>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { calculateBaZi, analyzeWuXing } from '../utils/bazi.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const progress = ref(0)
const loadingMessage = ref('正在准备您的个性化运势预测...')

const calculateWithProgress = async () => {
  try {
    const { name, birthdate, birthHour, gender } = route.query
    
    if (!name || !birthdate || !birthHour || !gender) {
      ElMessage.error('参数不完整，请重新填写')
      router.push('/')
      return
    }
    
    // 更新进度和消息
    progress.value = 20
    loadingMessage.value = '正在解析生辰八字...'
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 计算生辰八字
    const baZiInfo = calculateBaZi(new Date(birthdate), parseInt(birthHour))
    
    progress.value = 50
    loadingMessage.value = '正在分析五行属性...'
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 分析五行
    const wuXingAnalysis = analyzeWuXing(baZiInfo)
    
    progress.value = 80
    loadingMessage.value = '正在生成运势预测...'
    await new Promise(resolve => setTimeout(resolve, 800))
    
    progress.value = 100
    loadingMessage.value = '预测完成，即将为您展示结果...'
    
    // 等待进度条动画完成
    setTimeout(() => {
      router.push({
        path: '/result',
        query: {
          name,
          birthdate,
          birthHour,
          gender,
          baZiInfo: JSON.stringify(baZiInfo),
          wuXingAnalysis: JSON.stringify(wuXingAnalysis)
        }
      })
    }, 500)
  } catch (error) {
    console.error('计算过程出错：', error)
    ElMessage.error('计算出错，请重试')
    router.push('/')
  }
}

onMounted(() => {
  calculateWithProgress()
})
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  position: relative;
  overflow: hidden;
}

.loading-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.3;
  animation: starTwinkle 3s ease-in-out infinite;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}

.loading-content {
  text-align: center;
  padding: 40px;
  width: 80%;
  max-width: 400px;
  background: rgba(26, 26, 46, 0.8);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  animation: fadeIn 0.8s ease-out;
  border: 2px solid rgba(74, 0, 224, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.loading-content::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 16px;
  background: linear-gradient(45deg, #4a00e0, #8e2de2);
  z-index: -1;
  animation: borderGlow 2s linear infinite;
  opacity: 0.5;
}

@keyframes borderGlow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

.fortune-wheel {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #9d50bb;
  border-top-color: transparent;
  border-bottom-color: #6e48aa;
  margin: 0 auto 30px;
  animation: spin 1.5s linear infinite;
  box-shadow: 0 0 20px rgba(157, 80, 187, 0.5);
  position: relative;
}

.fortune-wheel::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  border: 2px solid rgba(157, 80, 187, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.fortune-wheel::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(157, 80, 187, 0.2) 0%, transparent 70%);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.5; }
}

h2 {
  color: #ffffff;
  margin-bottom: 20px;
  text-shadow: 0 0 15px rgba(157, 80, 187, 0.8), 0 0 30px rgba(74, 0, 224, 0.6);
  font-family: 'YouYuan', 'STXihei', sans-serif;
  letter-spacing: 3px;
  font-size: 2em;
  font-weight: bold;
  background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #ffffff;
  margin-bottom: 25px;
  font-family: 'STXihei', sans-serif;
  font-size: 1.2em;
  animation: fadeInOut 3s infinite;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 500;
  letter-spacing: 1px;
}

@keyframes fadeInOut {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

.progress-bar {
  height: 10px;
  background: rgba(30, 30, 60, 0.7);
  border-radius: 5px;
  overflow: hidden;
  margin-top: 20px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #9d50bb, #6e48aa);
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(157, 80, 187, 0.5);
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

.progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.2), 
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes glow {
  from {
    box-shadow: 0 0 4px rgba(64, 158, 255, 0.5);
  }
  to {
    box-shadow: 0 0 12px rgba(64, 158, 255, 0.8);
  }
}
</style>