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

function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
    
    // 更新步骤状态
    steps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.remove('active');
            step.classList.add('completed');
        } else if (index === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function nextStep() {
    if (currentStep < totalSteps - 1) {
        currentStep++;
        updateProgress();
    } else {
        // 计算完成，跳转到结果页面
        const resultParams = new URLSearchParams(formData);
        window.location.href = `result.html?${resultParams.toString()}`;
    }
}

// 开始动画
updateProgress();

// 模拟计算过程
setTimeout(() => nextStep(), 1000);  // 1秒后完成第一步
setTimeout(() => nextStep(), 2000);  // 2秒后完成第二步
setTimeout(() => nextStep(), 3000);  // 3秒后完成第三步
setTimeout(() => nextStep(), 4000);  // 4秒后完成并跳转 