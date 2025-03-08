const express = require('express');
const path = require('path');
const cors = require('cors');
const analysisRoutes = require('./routes/analysis');

const app = express();

// 启用 CORS
app.use(cors());

// 中间件配置
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// 注册路由
app.use('/api/analysis', analysisRoutes);

// 前端静态文件服务
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误：' + err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});