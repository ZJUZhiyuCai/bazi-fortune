<template>
  <div class="share-container">
    <div class="share-card">
      <h1>分享运势预测</h1>
      
      <div v-if="loading" class="loading-state">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <p>正在加载分享内容...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <el-icon class="error-icon"><Warning /></el-icon>
        <p>{{ error }}</p>
        <el-button @click="goHome">返回首页</el-button>
      </div>
      
      <div v-else class="share-content">
        <div class="qr-code-container">
          <img :src="qrCode" alt="分享二维码" class="qr-code" />
          <p class="share-code">分享码：{{ shareCode }}</p>
        </div>
        
        <div class="share-actions">
          <el-button type="primary" @click="copyShareLink">
            复制分享链接
          </el-button>
          <el-button @click="saveQRCode">
            保存二维码
          </el-button>
        </div>
        
        <div class="share-tips">
          <h3>分享提示</h3>
          <p>1. 扫描二维码或使用分享链接可查看运势预测结果</p>
          <p>2. 分享码有效期为30天</p>
          <p>3. 请妥善保管分享码，避免泄露个人信息</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getShareQRCode } from '../services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref('')
const qrCode = ref('')
const shareCode = ref('')

const copyShareLink = async () => {
  try {
    const shareUrl = `${window.location.origin}/share/${shareCode.value}`
    await navigator.clipboard.writeText(shareUrl)
    ElMessage.success('分享链接已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  }
}

const saveQRCode = () => {
  const link = document.createElement('a')
  link.download = `运势预测分享_${shareCode.value}.png`
  link.href = qrCode.value
  link.click()
}

const goHome = () => {
  router.push('/')
}

onMounted(async () => {
  try {
    shareCode.value = route.params.shareCode
    if (!shareCode.value) {
      throw new Error('分享码不存在')
    }
    
    const response = await getShareQRCode(shareCode.value)
    qrCode.value = response.qrCode
    loading.value = false
  } catch (err) {
    error.value = err.message || '加载分享内容失败'
    loading.value = false
  }
})
</script>

<style scoped>
.share-container {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.share-card {
  max-width: 600px;
  width: 100%;
  padding: 40px;
  background: rgba(26, 26, 46, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2em;
  text-shadow: 0 0 20px rgba(157, 80, 187, 0.5);
  background: linear-gradient(120deg, #b388ff 0%, #8e72dc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
}

.loading-icon,
.error-icon {
  font-size: 48px;
  color: #b388ff;
  margin-bottom: 20px;
}

.qr-code-container {
  text-align: center;
  margin-bottom: 30px;
}

.qr-code {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 15px;
  border: 4px solid rgba(179, 136, 255, 0.3);
  box-shadow: 0 0 20px rgba(157, 80, 187, 0.3);
}

.share-code {
  color: #e6e6fa;
  font-size: 1.2em;
  margin: 15px 0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.share-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.share-tips {
  background: rgba(30, 25, 44, 0.9);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(142, 197, 252, 0.2);
}

.share-tips h3 {
  color: #b388ff;
  margin-bottom: 15px;
  font-size: 1.2em;
}

.share-tips p {
  color: #e6e6fa;
  margin: 10px 0;
  font-size: 1em;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .share-card {
    padding: 20px;
  }
  
  .share-actions {
    flex-direction: column;
  }
  
  .qr-code {
    width: 150px;
    height: 150px;
  }
}
</style> 