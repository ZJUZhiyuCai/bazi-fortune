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
    // 导入八字计算模块
    const { calculateBaZi } = require('./src/utils/bazi');
    const date = new Date(birthdate);
    const hour = parseInt(birthHour);
    return calculateBaZi(date, hour);
}

// 计算运势
function calculateFortune(bazi, gender) {
    const { analyzeWuXing, generateFortune } = require('./src/utils/bazi');
    const wuXing = analyzeWuXing(bazi);
    const fortune = generateFortune(bazi, wuXing);

    // 扩展运势分析内容
    return {
        summary: fortune.fortune.career + '\n' + fortune.fortune.wealth,
        details: [
            `事业运：${fortune.fortune.career}`,
            `财运：${fortune.fortune.wealth}`,
            `感情运：${fortune.fortune.love}`,
            `健康运：${fortune.fortune.health}`,
            `人际关系：${fortune.relationshipTip}`,
            `养生建议：${fortune.healthTip}`
        ],
        luckyElements: {
            direction: calculateLuckyDirection(wuXing.strongest),
            color: calculateLuckyColor(wuXing.strongest),
            number: calculateLuckyNumber(wuXing.strongest)
        },
        wuXing: {
            strongest: fortune.dominantElement,
            weakest: fortune.weakElement
        }
    };
}

// 计算吉祥方位
function calculateLuckyDirection(element) {
    const directions = {
        wood: '东方、东南',
        fire: '南方、东南',
        earth: '中央、东北',
        metal: '西方、西北',
        water: '北方、西北'
    };
    return directions[element] || '东南';
}

// 计算吉祥颜色
function calculateLuckyColor(element) {
    const colors = {
        wood: '绿色、青色',
        fire: '红色、紫色',
        earth: '黄色、棕色',
        metal: '白色、金色',
        water: '黑色、蓝色'
    };
    return colors[element] || '紫色、金色';
}

// 计算幸运数字
function calculateLuckyNumber(element) {
    const numbers = {
        wood: '3、4、9',
        fire: '2、7、9',
        earth: '2、5、8',
        metal: '6、7、8',
        water: '1、4、6'
    };
    return numbers[element] || '3、7、9';
}

// 填充八字信息
const bazi = calculateBazi(formData.birthdate, formData.birthHour);
const baziCells = document.querySelectorAll('.bazi-cell');
baziCells[0].textContent = `年柱：${bazi.yearColumn}`;
baziCells[1].textContent = `月柱：${bazi.monthColumn}`;
baziCells[2].textContent = `日柱：${bazi.dayColumn}`;
baziCells[3].textContent = `时柱：${bazi.hourColumn}`;

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

// 添加五行分析
const wuXingInfo = document.createElement('div');
wuXingInfo.className = 'wuxing-info';
wuXingInfo.innerHTML = `
    <h3>五行分析</h3>
    <p>最旺五行：${fortune.wuXing.strongest}</p>
    <p>最弱五行：${fortune.wuXing.weakest}</p>
`;
document.querySelector('.fortune-details').appendChild(wuXingInfo);

// 增强分享功能
function shareResult() {
    const shareOptions = [
        { name: '复制文本', action: copyToClipboard },
        { name: '生成图片', action: generateImage },
        { name: '保存PDF', action: savePDF }
    ];

    const shareMenu = document.createElement('div');
    shareMenu.className = 'share-menu';
    shareOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.name;
        button.onclick = option.action;
        shareMenu.appendChild(button);
    });

    // 显示分享菜单
    const existingMenu = document.querySelector('.share-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    document.querySelector('.result-container').appendChild(shareMenu);
}

// 复制文本
function copyToClipboard() {
    const shareText = `
我在八字算命网站测算了2025年运势：
姓名：${formData.name}
生辰八字：${bazi.fullBaZi}
运势概要：${fortune.summary}
吉祥方位：${fortune.luckyElements.direction}
吉祥颜色：${fortune.luckyElements.color}
幸运数字：${fortune.luckyElements.number}
五行属性：${fortune.wuXing.strongest}旺 ${fortune.wuXing.weakest}弱
`;
    
    navigator.clipboard.writeText(shareText).then(() => {
        alert('结果已复制到剪贴板！');
    }).catch(() => {
        // 降级处理
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('结果已复制到剪贴板！');
    });
}

// 生成分享图片
function generateImage() {
    html2canvas(document.querySelector('.result-container')).then(canvas => {
        const link = document.createElement('a');
        link.download = `运势预测_${formData.name}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

// 保存为PDF
function savePDF() {
    const element = document.querySelector('.result-container');
    html2pdf()
        .from(element)
        .save(`运势预测_${formData.name}.pdf`);
}

// 保存结果到本地存储
function saveToHistory() {
    const result = {
        timestamp: new Date().toISOString(),
        formData,
        bazi,
        fortune
    };

    let history = JSON.parse(localStorage.getItem('fortuneHistory') || '[]');
    history.push(result);
    localStorage.setItem('fortuneHistory', JSON.stringify(history));
}

// 页面加载完成后保存结果
window.addEventListener('load', saveToHistory);