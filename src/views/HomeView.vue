<template>
  <div class="home-container">
    <div class="chinese-pattern-top"></div>
    <h1 class="chinese-title">运势预测</h1>
    <p class="welcome-text">欢迎来到我们的运势预测网站。请输入您的基本信息，我们将为您生成个性化的运势预测。</p>
    <div class="form-wrapper">
      <div class="form-card">
    
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="fortune-form" size="large">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入您的姓名" class="chinese-input enhanced-input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birthdate">
            <el-date-picker v-model="form.birthdate" type="date" placeholder="选择出生日期" class="chinese-input enhanced-input" format="YYYY年MM月DD日" value-format="YYYY-MM-DD" :locale="zhCn"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生时间" prop="birthTime">
            <el-time-picker v-model="form.birthTime" placeholder="选择出生时间" class="chinese-input enhanced-input" format="HH:mm" value-format="HH:mm"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
          <el-option label="午时 (11:00-13:00)" value="11"></el-option>
          <el-option label="未时 (13:00-15:00)" value="13"></el-option>
          <el-option label="申时 (15:00-17:00)" value="15"></el-option>
          <el-option label="酉时 (17:00-19:00)" value="17"></el-option>
          <el-option label="戌时 (19:00-21:00)" value="19"></el-option>
          <el-option label="亥时 (21:00-23:00)" value="21"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender" class="chinese-radio">
          <el-radio label="male">男</el-radio>
          <el-radio label="female">女</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm" class="submit-btn" :loading="loading">开始测算</el-button>
      </el-form-item>
    </el-form>
      </div>
    </div>
    <div class="chinese-pattern-bottom"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const router = useRouter()
const formRef = ref(null)

const form = reactive({
  name: '',
  birthdate: '',
  birthTime: '',
  gender: ''
})

const loading = ref(false)

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  birthdate: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
  birthTime: [{ required: true, message: '请选择出生时间', trigger: 'change' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
}

const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    loading.value = true
    await formRef.value.validate()
    
    const formData = {
      name: form.name,
      birthdate: form.birthdate,
      birthTime: form.birthTime,
      gender: form.gender
    }
    
    await router.push({
      path: '/loading',
      query: formData
    })
  } catch (error) {
    ElMessage.error('请完整填写所有必填信息')
  } finally {
    loading.value = false
  }
      ElMessage.error('请填写完整信息')
      return false
    }
  })
}

const validateForm = () => {
  if (!form.name || !form.birthdate || !form.birthTime || !form.gender) {
    ElMessage.error('请填写完整信息')
    return false
  }
  return true
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 40px auto;
  padding: 40px 20px;
  text-align: center;
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.8s ease-out;
  position: relative;
  overflow: hidden;
}

.home-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.3;
  z-index: 1;
}

.form-wrapper {
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.form-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chinese-title {
  font-size: 2.5em;
  color: #fff;
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
  background: linear-gradient(120deg, #9d50bb 0%, #6e48aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(142, 197, 252, 0.6);
  }
}

.welcome-text {
  color: #b8c6db;
  margin-bottom: 40px;
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

.fortune-form {
  background: rgba(30, 25, 44, 0.9);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(157, 80, 187, 0.3);
  position: relative;
  z-index: 2;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(74, 0, 224, 0.2);
}

.chinese-input :deep(.el-input__inner),
.chinese-input :deep(.el-input__wrapper) {
  border: 2px solid #4a00e0;
  background-color: rgba(26, 26, 46, 0.8);
  border-radius: 8px;
  font-family: 'STXihei', sans-serif;
  color: #fff;
  font-size: 1.1em;
  padding: 12px;
  box-shadow: 0 0 10px rgba(74, 0, 224, 0.2);
}

.chinese-input :deep(.el-input__inner:focus),
.chinese-input :deep(.el-input__wrapper:hover) {
  border-color: #6c2afd;
  box-shadow: 0 0 15px rgba(74, 0, 224, 0.3);
}

.chinese-radio :deep(.el-radio__label) {
  color: #ffffff;
  font-family: 'STXihei', sans-serif;
  font-size: 1.1em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.chinese-radio :deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #4a00e0;
  border-color: #4a00e0;
  box-shadow: 0 0 10px rgba(74, 0, 224, 0.3);
}

:deep(.el-form-item__label) {
  color: #ffffff;
  font-size: 1.1em;
  font-weight: 500;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.submit-btn {
  background: linear-gradient(135deg, #9d50bb, #6e48aa);
  border: none;
  padding: 12px 36px;
  font-size: 1.1em;
  font-family: 'YouYuan', 'STXihei', sans-serif;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(74, 0, 224, 0.4);
  background: linear-gradient(135deg, #6c2afd, #a44cf4);
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
</style>