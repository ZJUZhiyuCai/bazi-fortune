// 生成年份选项（1900-2024）
const yearSelect = document.getElementById('year');
const currentYear = new Date().getFullYear();
for (let year = 1900; year <= currentYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
}

// 生成月份选项
const monthSelect = document.getElementById('month');
for (let month = 1; month <= 12; month++) {
    const option = document.createElement('option');
    option.value = month;
    option.textContent = month + '月';
    monthSelect.appendChild(option);
}

// 生成日期选项
const daySelect = document.getElementById('day');
function updateDays() {
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const daysInMonth = new Date(year, month, 0).getDate();
    
    daySelect.innerHTML = '<option value="">请选择日期</option>';
    for (let day = 1; day <= daysInMonth; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day + '日';
        daySelect.appendChild(option);
    }
}

// 生成时辰选项
const hourSelect = document.getElementById('hour');
const hours = ['子时 (23:00-1:00)', '丑时 (1:00-3:00)', '寅时 (3:00-5:00)', 
               '卯时 (5:00-7:00)', '辰时 (7:00-9:00)', '巳时 (9:00-11:00)',
               '午时 (11:00-13:00)', '未时 (13:00-15:00)', '申时 (15:00-17:00)',
               '酉时 (17:00-19:00)', '戌时 (19:00-21:00)', '亥时 (21:00-23:00)'];
hours.forEach((hour, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = hour;
    hourSelect.appendChild(option);
});

// 监听年月变化，更新日期选项
yearSelect.addEventListener('change', updateDays);
monthSelect.addEventListener('change', updateDays);

// 表单提交处理
document.getElementById('birthForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const year = yearSelect.value;
    const month = monthSelect.value;
    const day = daySelect.value;
    const hour = hourSelect.value;
    
    // 这里可以添加您的八字计算逻辑
    const result = calculateFortune(year, month, day, hour);
    
    // 显示结果
    showResult(result);
});

// 计算运势（示例函数）
function calculateFortune(year, month, day, hour) {
    // 这里添加您的八字计算逻辑
    return {
        title: '2024年运势预测',
        summary: '今年运势总体平稳，适合稳扎稳打。',
        details: [
            '事业：工作上会有新的机遇，但需要谨慎把握。',
            '财运：财运平稳，适合稳健理财。',
            '感情：桃花运旺盛，但需要理性对待。',
            '健康：注意作息规律，保持良好心态。'
        ]
    };
}

// 显示结果
function showResult(result) {
    // 创建结果页面
    const resultHTML = `
        <div class="result-container">
            <h2>${result.title}</h2>
            <p class="summary">${result.summary}</p>
            <ul class="details">
                ${result.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
            <button onclick="window.location.reload()" class="submit-btn">重新测算</button>
        </div>
    `;
    
    // 替换表单内容
    document.querySelector('.form-container').innerHTML = resultHTML;
} 