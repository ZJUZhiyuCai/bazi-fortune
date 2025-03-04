<template>
  <div class="home-container">
    <div class="chinese-pattern-top"></div>
    <h1 class="chinese-title">运势预测</h1>
    <p class="welcome-text">欢迎来到我们的运势预测网站。请输入您的基本信息，我们将为您生成个性化的运势预测。</p>
    
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="fortune-form">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入您的姓名" class="chinese-input"></el-input>
      </el-form-item>
      
      <el-form-item label="出生日期" prop="birthdate">
        <el-date-picker v-model="form.birthdate" type="date" placeholder="选择出生日期" class="chinese-input" format="YYYY年MM月DD日" value-format="YYYY-MM-DD" :locale="zhCn"></el-date-picker>
      </el-form-item>
      
      <el-form-item label="出生时辰" prop="birthHour">
        <el-select v-model="form.birthHour" placeholder="请选择出生时辰" class="chinese-input">
          <el-option label="子时 (23:00-1:00)" value="23"></el-option>
          <el-option label="丑时 (1:00-3:00)" value="1"></el-option>
          <el-option label="寅时 (3:00-5:00)" value="3"></el-option>
          <el-option label="卯时 (5:00-7:00)" value="5"></el-option>
          <el-option label="辰时 (7:00-9:00)" value="7"></el-option>
          <el-option label="巳时 (9:00-11:00)" value="9"></el-option>
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
        <el-button type="primary" @click="submitForm" class="submit-btn">开始测算</el-button>
      </el-form-item>
    </el-form>
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
  birthHour: '',
  gender: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  birthdate: [{ type: 'date', required: true, message: '请选择出生日期', trigger: 'change' }],
  birthHour: [{ required: true, message: '请选择出生时辰', trigger: 'change' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const formData = {
        name: form.name,
        birthdate: form.birthdate,
        birthHour: form.birthHour,
        gender: form.gender
      }
      
      router.push({
        path: '/loading',
        query: formData
      })
      ElMessage.success('信息提交成功，正在为您测算...')
    } else {
      ElMessage.error('请填写完整信息')
      return false
    }
  })
}
</script>

<style scoped>
.home-container {
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
  background: rgba(30, 25, 44, 0.8);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(157, 80, 187, 0.2);
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.chinese-input :deep(.el-input__inner),
.chinese-input :deep(.el-input__wrapper) {
  border-color: #4a00e0;
  background-color: rgba(26, 26, 46, 0.6);
  border-radius: 8px;
  font-family: 'STXihei', sans-serif;
  color: #fff;
}

.chinese-input :deep(.el-input__inner:focus),
.chinese-input :deep(.el-input__wrapper:hover) {
  border-color: #6c2afd;
  box-shadow: 0 0 15px rgba(74, 0, 224, 0.3);
}

.chinese-radio :deep(.el-radio__label) {
  color: #a0a0c0;
  font-family: 'STXihei', sans-serif;
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