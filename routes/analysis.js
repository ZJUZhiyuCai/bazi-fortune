const express = require('express');
const router = express.Router();
// 暂时注释掉auth中间件，以便前端开发测试
// const auth = require('../middleware/auth');

// 定义天干地支数组
const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 定义各季节的宜忌事项
const suitableActivities = {
  spring: ['出行', '求财', '开业', '动土', '种植', '婚庆', '装修', '开工'],
  summer: ['求财', '出行', '装修', '开业', '谈判', '签约', '婚庆', '动土'],
  autumn: ['搬家', '装修', '开业', '谈判', '求财', '签约', '出行', '开工'],
  winter: ['装修', '开业', '谈判', '求财', '签约', '学习', '开工', '动土']
};

const unsuitableActivities = {
  spring: ['安葬', '诉讼', '手术', '动工', '开张', '搬迁', '结婚', '开市'],
  summer: ['安葬', '诉讼', '手术', '搬迁', '开张', '动工', '结婚', '开市'],
  autumn: ['安葬', '诉讼', '手术', '动工', '开张', '搬迁', '结婚', '开市'],
  winter: ['安葬', '诉讼', '手术', '动工', '开张', '搬迁', '结婚', '开市']
};

// 八字分析计算函数
// 改进的确定性随机数生成器
function deterministicRandom(seed) {
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

// 修正时辰处理逻辑
function getHourBranch(hour) {
  if (hour >= 23 || hour < 1) return 0;  // 子时
  if (hour >= 1 && hour < 3) return 1;   // 丑时
  if (hour >= 3 && hour < 5) return 2;   // 寅时
  if (hour >= 5 && hour < 7) return 3;   // 卯时
  if (hour >= 7 && hour < 9) return 4;   // 辰时
  if (hour >= 9 && hour < 11) return 5;  // 巳时
  if (hour >= 11 && hour < 13) return 6; // 午时
  if (hour >= 13 && hour < 15) return 7; // 未时
  if (hour >= 15 && hour < 17) return 8; // 申时
  if (hour >= 17 && hour < 19) return 9; // 酉时
  if (hour >= 19 && hour < 21) return 10;// 戌时
  return 11; // 亥时 (21:00-22:59)
}

function calculateBaZi(birthTime, gender) {
  try {
    const date = new Date(birthTime);
    if (isNaN(date.getTime())) {
      throw new Error('无效的出生日期');
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();

    // 使用生日信息生成稳定的八字
    const yearIndex = (year - 4) % 60;
    const monthIndex = ((year - 1900) * 12 + month - 1) % 60;
    const dayIndex = Math.floor((date.getTime() - new Date(1900, 0, 1).getTime()) / 86400000) % 60;
    const hourIndex = getHourBranch(hour);
    
    const pillars = {
      year: heavenlyStems[yearIndex % 10] + earthlyBranches[yearIndex % 12],
      month: heavenlyStems[monthIndex % 10] + earthlyBranches[monthIndex % 12],
      day: heavenlyStems[dayIndex % 10] + earthlyBranches[dayIndex % 12],
      hour: heavenlyStems[hourIndex % 10] + earthlyBranches[hourIndex]
    };
    
    // 生成唯一种子，加入性别因素
    const genderFactor = gender === '女' ? 1 : 0;
    const seed = parseInt(`${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hourIndex}${genderFactor}`);
    
    // 根据月份确定季节
    let season;
    if (month >= 3 && month <= 5) season = 'spring';
    else if (month >= 6 && month <= 8) season = 'summer';
    else if (month >= 9 && month <= 11) season = 'autumn';
    else season = 'winter';
    
    // 根据日期和性别生成稳定的宜忌事项
    const dateIndex = ((month * 100 + day) * (genderFactor + 1)) % 5;
    
    // 根据性别调整五行能量
    const elementBase = gender === '女' ? 55 : 65;
    const elementRange = gender === '女' ? 25 : 20;
    
    return {
      pillars,
      elements: {
        wood: Math.floor(deterministicRandom(seed) * elementRange + elementBase),
        fire: Math.floor(deterministicRandom(seed + 1) * elementRange + elementBase),
        earth: Math.floor(deterministicRandom(seed + 2) * elementRange + elementBase),
        metal: Math.floor(deterministicRandom(seed + 3) * elementRange + elementBase),
        water: Math.floor(deterministicRandom(seed + 4) * elementRange + elementBase)
      },
      scores: {
        health: Math.floor(deterministicRandom(seed + 5) * 20 + 70),
        wealth: Math.floor(deterministicRandom(seed + 6) * 20 + 70),
        love: Math.floor(deterministicRandom(seed + 7) * 20 + 70)
      },
      advice: {
        health: [
          '注意调节作息，保持规律生活',
          '适量运动，增强体质',
          '保持心情愉悦，避免压力过大'
        ],
        wealth: [
          '投资理财需谨慎',
          '适合开源节流，稳健发展',
          '把握机会，合理规划'
        ],
        love: gender === '女' ? [
          '桃花运旺盛，谨慎择偶',
          '保持独立，不要盲目恋爱',
          '注意维护个人形象'
        ] : [
          '桃花运旺盛，把握机会',
          '主动出击，展现魅力',
          '保持真诚，用心经营感情'
        ]
      },
      suitable: suitableActivities[season].slice(dateIndex, dateIndex + 4),
      unsuitable: unsuitableActivities[season].slice(dateIndex, dateIndex + 4)
    };
  } catch (error) {
    console.error('八字计算错误:', error);
    throw new Error('八字计算失败：' + error.message);
  }
}

// 获取八字分析结果
router.post('/calculate', async (req, res) => {
  try {
    const { name, gender, birthTime } = req.body;
    console.log('收到请求:', { name, gender, birthTime });

    if (!name || !birthTime) {
      return res.status(400).json({ message: '请提供完整的信息' });
    }

    const analysis = calculateBaZi(birthTime, gender);
    console.log('分析结果:', analysis);

    res.json(analysis);
  } catch (err) {
    console.error('服务器错误:', err);
    res.status(500).json({ message: '服务器错误: ' + err.message });
  }
});

module.exports = router;