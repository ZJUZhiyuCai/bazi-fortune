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

let progressTextElement;

function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    
    // 使用requestAnimationFrame优化动画，并添加缓动效果
    const animateProgress = (targetWidth, startTime = performance.now()) => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const duration = 500; // 动画持续时间（毫秒）
      
      if (elapsed < duration) {
        const currentWidth = easeInOutCubic(elapsed / duration) * targetWidth;
        progressFill.style.width = `${currentWidth}%`;
        requestAnimationFrame(() => animateProgress(targetWidth, startTime));
      } else {
        progressFill.style.width = `${targetWidth}%`;
      }
    };
    
    animateProgress(progress);
    
    // 更新步骤状态和描述（使用DocumentFragment优化DOM操作）
    const fragment = document.createDocumentFragment();
    steps.forEach((step, index) => {
        const stepClone = step.cloneNode(true);
        if (index < currentStep) {
            stepClone.classList.remove('active');
            stepClone.classList.add('completed');
            stepClone.innerHTML = `<i class="fas fa-check"></i> ${stepDescriptions[index]}`;
        } else if (index === currentStep) {
            stepClone.classList.add('active');
            stepClone.classList.remove('completed');
            stepClone.innerHTML = `<div class="step-animation"></div>${stepDescriptions[index]}`;
        } else {
            stepClone.classList.remove('active', 'completed');
            stepClone.textContent = stepDescriptions[index];
        }
        fragment.appendChild(stepClone);
    });
    
    // 批量更新DOM
    steps.forEach((step, index) => {
        step.replaceWith(fragment.children[0]);
    });

    // 更新进度百分比显示（复用DOM元素）
    if (!progressTextElement) {
        progressTextElement = document.createElement('div');
        progressTextElement.className = 'progress-text';
        document.querySelector('.progress-container').appendChild(progressTextElement);
    }
    progressTextElement.textContent = `${Math.round(progress)}%`;
}

// 添加缓动函数
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function nextStep() {
    if (currentStep < totalSteps - 1) {
        currentStep++;
        updateProgress();
        
        // 添加打字机效果显示当前步骤描述
        const currentStepElement = steps[currentStep];
        const text = stepDescriptions[currentStep];
        let charIndex = 0;
        
        const typeWriter = () => {
          if (charIndex < text.length) {
            currentStepElement.textContent = text.substring(0, charIndex + 1);
            charIndex++;
            requestAnimationFrame(typeWriter);
          }
        };
        typeWriter();
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