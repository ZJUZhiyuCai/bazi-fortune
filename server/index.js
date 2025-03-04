const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const QRCode = require('qrcode');

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// 连接数据库
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 定义运势结果模型
const FortuneSchema = new mongoose.Schema({
  userId: String,
  name: String,
  birthdate: String,
  birthHour: String,
  gender: String,
  baZiInfo: Object,
  wuXingAnalysis: Object,
  fortuneResult: Object,
  shareCode: String,
  createdAt: { type: Date, default: Date.now }
});

const Fortune = mongoose.model('Fortune', FortuneSchema);

// API 路由
// 保存运势结果
app.post('/api/fortune', async (req, res) => {
  try {
    const fortuneData = req.body;
    const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const fortune = new Fortune({
      ...fortuneData,
      shareCode
    });
    await fortune.save();
    res.json({ success: true, shareCode });
  } catch (error) {
    console.error('保存运势失败:', error);
    res.status(500).json({ success: false, message: '保存运势失败' });
  }
});

// 获取运势结果
app.get('/api/fortune/:shareCode', async (req, res) => {
  try {
    const { shareCode } = req.params;
    const fortune = await Fortune.findOne({ shareCode });
    if (!fortune) {
      return res.status(404).json({ success: false, message: '未找到运势结果' });
    }
    res.json({ success: true, data: fortune });
  } catch (error) {
    console.error('获取运势失败:', error);
    res.status(500).json({ success: false, message: '获取运势失败' });
  }
});

// 生成分享二维码
app.get('/api/share/:shareCode', async (req, res) => {
  try {
    const { shareCode } = req.params;
    const shareUrl = `${process.env.FRONTEND_URL}/share/${shareCode}`;
    const qrCode = await QRCode.toDataURL(shareUrl);
    res.json({ success: true, qrCode });
  } catch (error) {
    console.error('生成二维码失败:', error);
    res.status(500).json({ success: false, message: '生成二维码失败' });
  }
});

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 