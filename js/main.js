// 生成年份选项（1900-2025）
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
const hours = [
    { value: '23', label: '子时 (23:00-1:00)' },
    { value: '1', label: '丑时 (1:00-3:00)' },
    { value: '3', label: '寅时 (3:00-5:00)' },
    { value: '5', label: '卯时 (5:00-7:00)' },
    { value: '7', label: '辰时 (7:00-9:00)' },
    { value: '9', label: '巳时 (9:00-11:00)' },
    { value: '11', label: '午时 (11:00-13:00)' },
    { value: '13', label: '未时 (13:00-15:00)' },
    { value: '15', label: '申时 (15:00-17:00)' },
    { value: '17', label: '酉时 (17:00-19:00)' },
    { value: '19', label: '戌时 (19:00-21:00)' },
    { value: '21', label: '亥时 (21:00-23:00)' }
];

hours.forEach(hour => {
    const option = document.createElement('option');
    option.value = hour.value;
    option.textContent = hour.label;
    hourSelect.appendChild(option);
});
// 表单验证和提交
const birthForm = document.getElementById('birthForm');
const nameInput = document.getElementById('name');
const genderInputs = document.getElementsByName('gender');
const birthDateTimeInput = document.getElementById('birthDateTime');

// 错误提示函数
function showError(element, message) {
    const formGroup = element.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorDiv);
    }
    element.classList.add('error');
}

// 清除错误提示
function clearError(element) {
    const formGroup = element.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) {
        formGroup.removeChild(errorDiv);
    }
    element.classList.remove('error');
}

// 验证姓名
function validateName(name) {
    return name.trim().length >= 2 && name.trim().length <= 15;
}

// 验证性别
function validateGender() {
    return Array.from(genderInputs).some(input => input.checked);
}

// 验证出生日期时间
function validateBirthDateTime(dateTimeStr) {
    const selectedDate = new Date(dateTimeStr);
    const currentDate = new Date();
    return selectedDate <= currentDate && selectedDate >= new Date('1900-01-01');
}

// 时间转时辰
function getChineseHour(hour) {
    const hourMap = {
        23: '子', 0: '子', 1: '丑', 2: '丑',
        3: '寅', 4: '寅', 5: '卯', 6: '卯',
        7: '辰', 8: '辰', 9: '巳', 10: '巳',
        11: '午', 12: '午', 13: '未', 14: '未',
        15: '申', 16: '申', 17: '酉', 18: '酉',
        19: '戌', 20: '戌', 21: '亥', 22: '亥'
    };
    return hourMap[hour] || '';
}

// 表单提交处理
birthForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    // 验证姓名
    if (!validateName(nameInput.value)) {
        showError(nameInput, '请输入2-15个字符的姓名');
        isValid = false;
    } else {
        clearError(nameInput);
    }

    // 验证性别
    if (!validateGender()) {
        const genderGroup = document.querySelector('.radio-group');
        showError(genderGroup, '请选择性别');
        isValid = false;
    } else {
        clearError(document.querySelector('.radio-group'));
    }

    // 验证出生日期时间
    if (!validateBirthDateTime(birthDateTimeInput.value)) {
        showError(birthDateTimeInput, '请选择有效的出生日期时间（1900年至今）');
        isValid = false;
    } else {
        clearError(birthDateTimeInput);
    }

    if (isValid) {
        // 显示加载动画
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loadingOverlay);

        // 获取日期时间并转换时辰
        const birthDateTime = new Date(birthDateTimeInput.value);
        const hour = birthDateTime.getHours();
        const chineseHour = getChineseHour(hour);

        // 构建查询参数
        const params = new URLSearchParams();
        params.append('name', nameInput.value);
        params.append('gender', document.querySelector('input[name="gender"]:checked').value);
        params.append('birthdate', birthDateTime.toISOString().split('T')[0]);
        params.append('birthHour', chineseHour);

        // 延迟跳转以显示加载动画
        setTimeout(() => {
            window.location.href = `loading.html?${params.toString()}`;
        }, 500);
    }
});

// 添加输入事件监听器以实时验证
nameInput.addEventListener('input', () => {
    if (nameInput.value.trim()) {
        if (validateName(nameInput.value)) {
            clearError(nameInput);
        } else {
            showError(nameInput, '请输入2-15个字符的姓名');
        }
    }
});

birthDateTimeInput.addEventListener('change', () => {
    if (birthDateTimeInput.value) {
        if (validateBirthDateTime(birthDateTimeInput.value)) {
            clearError(birthDateTimeInput);
        } else {
            showError(birthDateTimeInput, '请选择有效的出生日期时间（1900年至今）');
        }
    }
});

// 性别选择事件监听
genderInputs.forEach(input => {
    input.addEventListener('change', () => {
        if (validateGender()) {
            clearError(document.querySelector('.radio-group'));
        }
    });
});
// 监听年月变化，更新日期选项
yearSelect.addEventListener('change', updateDays);
monthSelect.addEventListener('change', updateDays);

// 表单提交处理
document.getElementById('birthForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        birthdate: document.getElementById('birthdate').value,
        birthHour: document.getElementById('hour').value
    };
    
    // 将表单数据添加到URL并跳转到加载页面
    const params = new URLSearchParams(formData);
    window.location.href = `loading.html?${params.toString()}`;
});

// 计算运势（示例函数）
function calculateFortune(year, month, day, hour) {
    // 这里添加您的八字计算逻辑
    return {
        title: '2025年运势预测',
        summary: '今年运势总体平稳，适合稳扎稳打。',
        details: [
            '事业：工作中会有新的机遇，但需要谨慎把握。',
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