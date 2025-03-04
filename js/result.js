// 获取URL参数
const urlParams = new URLSearchParams(window.location.search);
const formData = {
    name: urlParams.get('name'),
    gender: urlParams.get('gender'),
    birthdate: urlParams.get('birthdate'),
    birthHour: urlParams.get('birthHour')
};

// 更新用户信息
document.querySelector('.name').textContent = `姓名：${formData.name}`;
document.querySelector('.gender').textContent = `性别：${formData.gender === 'male' ? '男' : '女'}`;
document.querySelector('.birthdate').textContent = `出生日期：${formData.birthdate} ${formData.birthHour}时`;

// 计算八字
function calculateBazi(birthdate, birthHour) {
    // 这里添加您的八字计算逻辑
    return {
        yearPillar: '甲子',
        monthPillar: '乙丑',
        dayPillar: '丙寅',
        hourPillar: '丁卯'
    };
}

// 计算运势
function calculateFortune(bazi, gender) {
    // 这里添加您的运势计算逻辑
    return {
        summary: '2024年运势总体平稳，适合稳扎稳打。太岁方位有贵人相助，事业发展有新的机遇。',
        details: [
            '事业运：工作上会遇到新的发展机会，但需要谨慎把握。适合在3月、7月、11月做出重要决策。',
            '财运：整体财运平稳，适合稳健理财。下半年可能有意外收获。',
            '感情运：桃花运旺盛，单身者有机会遇到心仪对象。已婚者需要注意维护感情。',
            '健康运：需要注意作息规律，保持良好心态。特别注意在2月、8月的身体状况。'
        ],
        luckyElements: {
            direction: '东南',
            color: '紫色、金色',
            number: '3、7、9'
        }
    };
}

// 填充八字信息
const bazi = calculateBazi(formData.birthdate, formData.birthHour);
const baziCells = document.querySelectorAll('.bazi-cell');
baziCells[0].textContent = `年柱：${bazi.yearPillar}`;
baziCells[1].textContent = `月柱：${bazi.monthPillar}`;
baziCells[2].textContent = `日柱：${bazi.dayPillar}`;
baziCells[3].textContent = `时柱：${bazi.hourPillar}`;

// 填充运势信息
const fortune = calculateFortune(bazi, formData.gender);
document.querySelector('.summary').textContent = fortune.summary;

const detailsList = document.querySelector('.details');
fortune.details.forEach(detail => {
    const li = document.createElement('li');
    li.textContent = detail;
    detailsList.appendChild(li);
});

// 填充吉运元素
document.querySelector('.direction').textContent = fortune.luckyElements.direction;
document.querySelector('.color').textContent = fortune.luckyElements.color;
document.querySelector('.number').textContent = fortune.luckyElements.number;

// 分享功能
function shareResult() {
    const shareText = `
我在八字算命网站测算了2024年运势：
姓名：${formData.name}
运势概要：${fortune.summary}
吉祥方位：${fortune.luckyElements.direction}
吉祥颜色：${fortune.luckyElements.color}
幸运数字：${fortune.luckyElements.number}
`;
    
    // 创建临时输入框
    const textarea = document.createElement('textarea');
    textarea.value = shareText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    alert('结果已复制到剪贴板，您可以分享给朋友了！');
} 