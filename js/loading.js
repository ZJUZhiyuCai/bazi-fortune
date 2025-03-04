// 获取URL参数
const urlParams = new URLSearchParams(window.location.search);
const formData = {
    name: urlParams.get('name'),
    gender: urlParams.get('gender'),
    birthdate: urlParams.get('birthdate'),
    birthHour: urlParams.get('birthHour')
};

// 进度条和步骤动画
const steps = document.querySelectorAll('.step');
const progressFill = document.querySelector('.progress-fill');
let currentStep = 0;
const totalSteps = steps.length;

// 计算步骤描述
const stepDescriptions = [
    '正在解析您的生辰八字...',
    '正在推算五行属性与相生相克关系...',
    '正在分析2025年运势走向...',
    '正在生成个性化运势报告...'
];

function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    
    // 添加平滑过渡动画
    progressFill.style.transition = 'width 0.5s ease-in-out';
    progressFill.style.width = `${progress}%`;
    
    // 更新步骤状态和描述
    steps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.remove('active');
            step.classList.add('completed');
            step.innerHTML = `<i class="fas fa-check"></i> ${stepDescriptions[index]}`;
        } else if (index === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
            step.innerHTML = `<div class="step-animation"></div>${stepDescriptions[index]}`;
        } else {
            step.classList.remove('active', 'completed');
            step.textContent = stepDescriptions[index];
        }
    });

    // 添加进度百分比显示
    const progressText = document.createElement('div');
    progressText.className = 'progress-text';
    progressText.textContent = `${Math.round(progress)}%`;
    document.querySelector('.progress-container').appendChild(progressText);
}

function nextStep() {
    if (currentStep < totalSteps - 1) {
        currentStep++;
        updateProgress();
        
        // 添加打字机效果显示当前步骤描述
        const currentStepElement = steps[currentStep];
        const text = stepDescriptions[currentStep];
        let charIndex = 0;
        
        const typeWriter = setInterval(() => {
            if (charIndex < text.length) {
                currentStepElement.textContent = text.substring(0, charIndex + 1);
                charIndex++;
            } else {
                clearInterval(typeWriter);
            }
        }, 50);
    } else {
        // 添加完成动画
        const loadingContainer = document.querySelector('.loading-container');
        loadingContainer.classList.add('complete');
        
        // 延迟跳转，显示完成动画
        setTimeout(() => {
            const resultParams = new URLSearchParams(formData);
            window.location.href = `result.html?${resultParams.toString()}`;
        }, 1000);
    }
}

// 开始动画
updateProgress();

// 优化计算过程的时间间隔
setTimeout(() => nextStep(), 1500);  // 第一步：解析八字
setTimeout(() => nextStep(), 3000);  // 第二步：推算五行
setTimeout(() => nextStep(), 4500);  // 第三步：分析运势
setTimeout(() => nextStep(), 6000);  // 第四步：生成报告