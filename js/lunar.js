// 农历转换工具
// 农历数据信息
const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
];

// 天干
const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 生肖
const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
// 农历月份
const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
// 农历日期
const lunarDays = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

/**
 * 获取农历年的总天数
 * @param {number} year - 公历年份
 * @returns {number} - 该农历年的总天数
 */
function getLunarYearDays(year) {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (lunarInfo[year - 1900] & i) ? 1 : 0;
  }
  return sum + leapDays(year);
}

/**
 * 获取农历年闰月的天数
 * @param {number} year - 公历年份
 * @returns {number} - 闰月的天数，如果没有闰月返回0
 */
function leapDays(year) {
  if (leapMonth(year)) {
    return (lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

/**
 * 获取农历年闰月的月份
 * @param {number} year - 公历年份
 * @returns {number} - 闰月的月份，如果没有闰月返回0
 */
function leapMonth(year) {
  return lunarInfo[year - 1900] & 0xf;
}

/**
 * 获取农历年某月的天数
 * @param {number} year - 公历年份
 * @param {number} month - 农历月份(1-12)
 * @returns {number} - 该月的天数
 */
function monthDays(year, month) {
  return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

/**
 * 公历日期转农历日期
 * @param {Date} date - 公历日期对象
 * @returns {Object} - 农历日期对象
 */
function solarToLunar(date) {
  try {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 参数检查
    if (year < 1900 || year > 2049) {
      return { error: '超出可计算范围(1900-2049)' };
    }
    
    // 计算从1900年1月31日（农历1900年正月初一）到当前日期的天数
    const dateObj = new Date(year, month - 1, day);
    const baseDate = new Date(1900, 0, 31); // 1900年1月31日是农历正月初一
    const diffDays = Math.floor((dateObj - baseDate) / 86400000);
    
    // 计算农历年
    let lunarYear = 1900;
    let daysInLunarYear = 0;
    let temp = diffDays;
    
    while (lunarYear < 2050) {
      daysInLunarYear = getLunarYearDays(lunarYear);
      if (temp < daysInLunarYear) {
        break;
      }
      temp -= daysInLunarYear;
      lunarYear++;
    }
    
    // 计算年干支
    const yearCyl = lunarYear - 1864;
    const yearGan = heavenlyStems[yearCyl % 10];
    const yearZhi = earthlyBranches[yearCyl % 12];
    const zodiac = animals[yearCyl % 12];
    
    // 计算农历月和日
    let lunarMonthIdx = 0;
    let daysInLunarMonth = 0;
    let leapMonthIdx = leapMonth(lunarYear);
    let isLeap = false;
    
    for (let i = 1; i <= 12; i++) {
      if (leapMonthIdx > 0 && i === leapMonthIdx + 1 && !isLeap) {
        isLeap = true;
        daysInLunarMonth = leapDays(lunarYear);
      } else {
        daysInLunarMonth = monthDays(lunarYear, i);
      }
      
      if (temp < daysInLunarMonth) {
        lunarMonthIdx = i;
        break;
      }
      temp -= daysInLunarMonth;
      
      if (isLeap && i === leapMonthIdx + 1) {
        isLeap = false;
      }
    }
    
    // 计算农历日
    const lunarDayIdx = temp + 1;
    
    // 农历月份和日期
    const lunarMonth = isLeap ? "闰" + lunarMonths[lunarMonthIdx - 1] : lunarMonths[lunarMonthIdx - 1];
    const lunarDay = lunarDays[lunarDayIdx - 1];
    
    return {
      lunarYear: yearGan + yearZhi,
      lunarMonth: lunarMonth,
      lunarDay: lunarDay,
      zodiac: zodiac,
      yearGan: yearGan,
      yearZhi: yearZhi,
      isLeap: isLeap
    };
  } catch (e) {
    console.error('农历计算错误:', e);
    return {
      lunarYear: '未知',
      lunarMonth: '未知',
      lunarDay: '未知',
      zodiac: '未知',
      yearGan: '未知',
      yearZhi: '未知',
      isLeap: false
    };
  }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { solarToLunar };
} else {
  // 在浏览器环境中，将函数挂载到全局对象
  window.solarToLunar = solarToLunar;
  window.heavenlyStems = heavenlyStems;
  window.earthlyBranches = earthlyBranches;
}