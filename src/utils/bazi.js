/**
 * 生辰八字计算工具
 * 用于计算用户的生辰八字并生成相应的运势和养生建议
 */

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 五行
const WU_XING = ['木', '火', '土', '金', '水'];
// 十二生肖
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

/**
 * 计算年柱天干
 * @param {number} year - 公历年份
 * @returns {string} 天干
 */
function getYearTianGan(year) {
  return TIAN_GAN[(year - 4) % 10];
}

/**
 * 计算年柱地支
 * @param {number} year - 公历年份
 * @returns {string} 地支
 */
function getYearDiZhi(year) {
  return DI_ZHI[(year - 4) % 12];
}

/**
 * 计算月柱天干
 * @param {number} year - 公历年份
 * @param {number} month - 公历月份(1-12)
 * @returns {string} 天干
 */
function getMonthTianGan(year, month) {
  // 月干公式：(年干序号 * 2 + 月序号) % 10
  const yearGanIndex = (year - 4) % 10;
  // 寅月为正月，因此需要转换
  const monthIndex = (month + 2 - 1) % 12;
  return TIAN_GAN[(yearGanIndex * 2 + monthIndex) % 10];
}

/**
 * 计算月柱地支
 * @param {number} month - 公历月份(1-12)
 * @returns {string} 地支
 */
function getMonthDiZhi(month) {
  // 寅月为正月
  return DI_ZHI[(month + 2 - 1) % 12];
}

/**
 * 计算日柱天干
 * 注意：这里使用简化算法，实际上应该使用农历计算
 * @param {Date} date - 日期对象
 * @returns {string} 天干
 */
function getDayTianGan(date) {
  // 简化算法，以公元前4年1月1日作为甲子日
  const baseDate = new Date('0000-01-01T00:00:00');
  const dayDiff = Math.floor((date - baseDate) / (24 * 60 * 60 * 1000));
  return TIAN_GAN[dayDiff % 10];
}

/**
 * 计算日柱地支
 * 注意：这里使用简化算法，实际上应该使用农历计算
 * @param {Date} date - 日期对象
 * @returns {string} 地支
 */
function getDayDiZhi(date) {
  // 简化算法，以公元前4年1月1日作为甲子日
  const baseDate = new Date('0000-01-01T00:00:00');
  const dayDiff = Math.floor((date - baseDate) / (24 * 60 * 60 * 1000));
  return DI_ZHI[dayDiff % 12];
}

/**
 * 计算时柱天干
 * @param {string} dayGan - 日柱天干
 * @param {number} hour - 小时(0-23)
 * @returns {string} 天干
 */
function getHourTianGan(dayGan, hour) {
  // 时辰天干与日干有关
  const dayGanIndex = TIAN_GAN.indexOf(dayGan);
  // 将小时转换为时辰(0-11)
  const hourIndex = Math.floor(hour / 2);
  return TIAN_GAN[(dayGanIndex * 2 + hourIndex) % 10];
}

/**
 * 计算时柱地支
 * @param {number} hour - 小时(0-23)
 * @returns {string} 地支
 */
function getHourDiZhi(hour) {
  // 子时(23:00-1:00)对应0，丑时(1:00-3:00)对应1，以此类推
  let hourIndex;
  if (hour >= 23 || hour < 1) {
    hourIndex = 0; // 子时
  } else {
    hourIndex = Math.floor((hour + 1) / 2);
  }
  return DI_ZHI[hourIndex];
}

/**
 * 计算生辰八字
 * @param {Date} birthdate - 出生日期
 * @param {number} birthHour - 出生时辰(小时，0-23)
 * @returns {Object} 八字信息
 */
export function calculateBaZi(birthdate, birthHour) {
  const date = new Date(birthdate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始
  const day = date.getDate();
  const hour = parseInt(birthHour, 10);
  
  // 计算年柱
  const yearGan = getYearTianGan(year);
  const yearZhi = getYearDiZhi(year);
  const yearColumn = yearGan + yearZhi;
  
  // 计算月柱
  const monthGan = getMonthTianGan(year, month);
  const monthZhi = getMonthDiZhi(month);
  const monthColumn = monthGan + monthZhi;
  
  // 计算日柱
  const dayGan = getDayTianGan(date);
  const dayZhi = getDayDiZhi(date);
  const dayColumn = dayGan + dayZhi;
  
  // 计算时柱
  const hourGan = getHourTianGan(dayGan, hour);
  const hourZhi = getHourDiZhi(hour);
  const hourColumn = hourGan + hourZhi;
  
  // 计算生肖
  const shengXiao = SHENG_XIAO[(year - 4) % 12];
  
  return {
    yearColumn,
    monthColumn,
    dayColumn,
    hourColumn,
    shengXiao,
    fullBaZi: `${yearColumn} ${monthColumn} ${dayColumn} ${hourColumn}`
  };
}

/**
 * 根据八字分析五行属性
 * @param {Object} baZi - 八字信息
 * @returns {Object} 五行分析
 */
export function analyzeWuXing(baZi) {
  // 简化版五行分析，实际应用中需要更复杂的算法
  const elements = {
    wood: 0, // 木
    fire: 0, // 火
    earth: 0, // 土
    metal: 0, // 金
    water: 0  // 水
  };
  
  // 天干五行对应关系
  const ganToWuXing = {
    '甲': 'wood', '乙': 'wood',
    '丙': 'fire', '丁': 'fire',
    '戊': 'earth', '己': 'earth',
    '庚': 'metal', '辛': 'metal',
    '壬': 'water', '癸': 'water'
  };
  
  // 地支五行对应关系(简化版)
  const zhiToWuXing = {
    '子': 'water', '丑': 'earth',
    '寅': 'wood', '卯': 'wood',
    '辰': 'earth', '巳': 'fire',
    '午': 'fire', '未': 'earth',
    '申': 'metal', '酉': 'metal',
    '戌': 'earth', '亥': 'water'
  };
  
  // 分析年柱
  elements[ganToWuXing[baZi.yearColumn[0]]] += 1;
  elements[zhiToWuXing[baZi.yearColumn[1]]] += 1;
  
  // 分析月柱
  elements[ganToWuXing[baZi.monthColumn[0]]] += 1;
  elements[zhiToWuXing[baZi.monthColumn[1]]] += 1;
  
  // 分析日柱
  elements[ganToWuXing[baZi.dayColumn[0]]] += 1;
  elements[zhiToWuXing[baZi.dayColumn[1]]] += 1;
  
  // 分析时柱
  elements[ganToWuXing[baZi.hourColumn[0]]] += 1;
  elements[zhiToWuXing[baZi.hourColumn[1]]] += 1;
  
  // 找出最强和最弱的五行
  let strongest = 'wood';
  let weakest = 'wood';
  
  Object.keys(elements).forEach(element => {
    if (elements[element] > elements[strongest]) {
      strongest = element;
    }
    if (elements[element] < elements[weakest]) {
      weakest = element;
    }
  });
  
  return {
    elements,
    strongest,
    weakest
  };
}

/**
 * 生成运势预测
 * @param {Object} baZi - 八字信息
 * @param {Object} wuXing - 五行分析
 * @returns {Object} 运势预测
 */
export function generateFortune(baZi, wuXing) {
  // 根据五行生成运势预测
  const fortuneByElement = {
    wood: {
      career: '您的事业运势与木相关，适合从事创新、成长类行业，如教育、文化、植物相关产业等。今年事业上有新的起色，可能会有升职或加薪的机会。',
      wealth: '财运方面，今年收入稳定，可能会有意外之财。投资方面宜稳健，避免高风险项目。',
      love: '感情方面，您性格开朗，容易吸引异性。今年有机会遇到心仪对象，缘分可能出现在工作场合。',
      health: '健康方面，注意肝胆系统，避免情绪波动过大。建议多参加户外活动，亲近自然。'
    },
    fire: {
      career: '您的事业运势与火相关，适合从事热情、活力类行业，如市场营销、演艺、餐饮等。今年事业上充满活力，有展示才华的机会。',
      wealth: '财运方面，今年收入波动较大，有意外收获但也有突发支出。投资方面需谨慎，避免冲动决策。',
      love: '感情方面，您热情奔放，容易陷入热恋。今年感情上可能会有波折，需要学会控制情绪。',
      health: '健康方面，注意心脏和血液循环系统，避免过度劳累。建议适当运动，保持充足睡眠。'
    },
    earth: {
      career: '您的事业运势与土相关，适合从事稳定、踏实类行业，如房地产、农业、制造业等。今年事业上稳步发展，是打基础的一年。',
      wealth: '财运方面，今年收入稳定增长，适合长期投资和储蓄。投资方面宜保守，可考虑房产投资。',
      love: '感情方面，您性格踏实，注重承诺。今年感情稳定发展，是考虑婚姻的好时机。',
      health: '健康方面，注意消化系统，避免饮食不规律。建议保持规律作息，注意营养均衡。'
    },
    metal: {
      career: '您的事业运势与金相关，适合从事精确、决断类行业，如金融、法律、IT等。今年事业上有贵人相助，可能获得重要项目。',
      wealth: '财运方面，今年理财能力增强，适合投资金融产品。投资方面宜果断，把握市场机会。',
      love: '感情方面，您性格理性，注重品质。今年可能遇到志同道合的伴侣，或与现有伴侣关系升温。',
      health: '健康方面，注意呼吸系统和皮肤，避免压力过大。建议适当放松，保持心情愉快。'
    },
    water: {
      career: '您的事业运势与水相关，适合从事流动、沟通类行业，如销售、外交、旅游等。今年事业上需要调整方向，可能有出差或转换工作的机会。',
      wealth: '财运方面，今年财务状况灵活多变，适合灵活理财。投资方面宜谨慎，避免盲目跟风。',
      love: '感情方面，您性格随和，善于沟通。今年感情上可能会有新的机遇，但需要主动把握，不要过于被动。建议多参加社交活动，扩大交友圈。',
      health: '健康方面，注意肾脏和泌尿系统，避免过度疲劳。建议保持充足睡眠，适量运动，注意保暖。'
    }
  };
  
  // 根据五行最强属性生成运势预测
  const dominantElement = wuXing.strongest;
  const fortune = fortuneByElement[dominantElement];
  
  // 生成养生建议
  const healthTips = {
    wood: '养生建议：保持情绪稳定，避免过度紧张和焦虑。多食用绿色蔬菜，适当补充维生素B族。',
    fire: '养生建议：注意心脏健康，避免过度兴奋和熬夜。多食用红色食物，如番茄、红枣等。',
    earth: '养生建议：注意脾胃健康，避免过度思虑和担忧。多食用黄色食物，如小米、玉米等。',
    metal: '养生建议：注意肺部健康，避免过度悲伤和压抑。多食用白色食物，如白萝卜、梨等。',
    water: '养生建议：注意肾脏健康，避免过度恐惧和疲劳。多食用黑色食物，如黑豆、黑芝麻等。'
  };
  
  // 生成人际关系建议
  const relationshipTips = {
    wood: '人际关系建议：性格开朗活泼，善于表达，但有时过于直率。建议增加耐心和包容心，学会倾听他人意见。',
    fire: '人际关系建议：热情洋溢，富有感染力，但有时过于冲动。建议增加冷静思考的能力，避免感情用事。',
    earth: '人际关系建议：为人诚恳踏实，重视承诺，但有时过于保守。建议增加创新思维，尝试接受新事物。',
    metal: '人际关系建议：做事果断，逻辑清晰，但有时过于理性。建议增加情感表达，多关注他人感受。',
    water: '人际关系建议：思维灵活，善于沟通，但有时优柔寡断。建议增加决断力，学会坚持自己的立场。'
  };
  
  return {
    fortune,
    healthTip: healthTips[dominantElement],
    relationshipTip: relationshipTips[dominantElement],
    dominantElement: WU_XING[WU_XING.indexOf(dominantElement) % 5],
    weakElement: WU_XING[WU_XING.indexOf(wuXing.weakest) % 5]
  };
}