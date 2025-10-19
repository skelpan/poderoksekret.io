// Глобальные переменные
let diagnosedTeeth = 0;
let cleanPercentage = 0;
let isListening = false;
let recognition;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен!');
    initToothCleaning();
    setupVoiceRecognition();
});

// Навигация между экранами
function nextScreen(screenNumber) {
    console.log('Переход к экрану:', screenNumber);
    
    // Скрыть все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показать целевой экран
    const targetScreen = document.getElementById(`screen${screenNumber}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    } else {
        console.error('Экран не найден:', screenNumber);
    }
    
    // Обновить индикатор прогресса
    updateProgressIndicator(screenNumber);
    
    // Прокрутить наверх
    window.scrollTo(0, 0);
}

// Обновление индикатора прогресса
function updateProgressIndicator(currentStep) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) <= currentStep) {
            step.classList.add('active');
        }
    });
}

// Экран 2: Диагностика зубов
function diagnoseTooth(element) {
    if (!element.classList.contains('checked')) {
        element.classList.add('checked');
        diagnosedTeeth++;
        
        const messages = [
            "Отличная улыбка! Продолжаем осмотр!",
            "Этот зуб просто сияет от счастья!",
            "Идеальная улыбка обнаружена!",
            "Зуб здоровья и удачи!",
            "Великолепно! Все зубы счастливы!"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById('diagnosisMessage').textContent = randomMessage;
        
        // Анимация проверенного зуба
        element.style.transform = 'scale(1.3)';
        setTimeout(() => {
            element.style.transform = 'scale(1.1)';
        }, 300);
        
        // Активировать кнопку после проверки всех зубов
        if (diagnosedTeeth >= 5) {
            document.getElementById('btnScreen2').disabled = false;
            document.getElementById('diagnosisMessage').textContent = "Диагностика завершена! Все зубы абсолютно здоровы и счастливы!";
        }
    }
}

// Инициализация чистки зубов
function initToothCleaning() {
    const canvas = document.getElementById('toothCanvas');
    const ctx = canvas.getContext('2d');
    
    // Установка размеров canvas
    function setCanvasSize() {
        const container = canvas.parentElement;
        const width = container.clientWidth - 40; // минус padding
        const height = 200;
        
        canvas.width = width;
        canvas.height = height;
        drawTooth();
    }
    
    // Рисуем зуб
    function drawTooth() {
        const width = canvas.width;
        const height = canvas.height;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, width, height);
        
        // Фон зуба
        ctx.fillStyle = '#FFF8E1';
        ctx.fillRect(0, 0, width, height);
        
        // "Грязь" на зубе
        if (cleanPercentage < 100) {
            const dirtIntensity = 1 - (cleanPercentage / 100);
            
            // Желтые пятна
            ctx.fillStyle = `rgba(210, 180, 140, ${0.4 * dirtIntensity})`;
            for (let i = 0; i < 10 * dirtIntensity; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = 15 + Math.random() * 25;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Темные пятна
            ctx.fillStyle = `rgba(139, 69, 19, ${0.3 * dirtIntensity})`;
            for (let i = 0; i < 8 * dirtIntensity; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = 5 + Math.random() * 10;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Блеск
        if (cleanPercentage > 0) {
            const shineIntensity = cleanPercentage / 100;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * shineIntensity})`;
            
            for (let i = 0; i < 15 * shineIntensity; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = 2 + Math.random() * 4;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Контур
        ctx.strokeStyle = '#FFD54F';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, width, height);
    }
    
    // Очистка области
    function cleanArea(x, y) {
        if (cleanPercentage >= 100) return;
        
        const rect = canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;
        
        // Очищаем область
        const brushSize = 30;
        ctx.clearRect(canvasX - brushSize/2, canvasY - brushSize/2, brushSize, brushSize);
        
        // Добавляем прогресс
        cleanPercentage = Math.min(100, cleanPercentage + 0.8);
        updateCleaningProgress();
        
        // Перерисовываем блеск
        if (cleanPercentage > 30) {
            ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Обработчики событий для мыши
    let isMouseDown = false;
    
    canvas.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        cleanArea(e.clientX, e.clientY);
    });
    
    canvas.addEventListener('mousemove', function(e) {
        if (isMouseDown) {
            cleanArea(e.clientX, e.clientY);
        }
    });
    
    canvas.addEventListener('mouseup', function() {
        isMouseDown = false;
    });
    
    canvas.addEventListener('mouseleave', function() {
        isMouseDown = false;
    });
    
    // Обработчики для touch-устройств
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        cleanArea(touch.clientX, touch.clientY);
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        cleanArea(touch.clientX, touch.clientY);
    });
    
    // Инициализация размера
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
}

// Обновление прогресса чистки
function updateCleaningProgress() {
    const progressBar = document.getElementById('cleanProgress');
    const progressText = document.getElementById('progressText');
    const cleanStatus = document.getElementById('cleanStatus');
    const nextButton = document.getElementById('btnScreen3');
    
    progressBar.style.width = cleanPercentage + '%';
    progressText.textContent = Math.round(cleanPercentage) + '%';
    
    if (cleanPercentage >= 100) {
        cleanStatus.textContent = "🎉 Идеальная чистота! Зуб сияет как новенький! ✨";
        cleanStatus.style.color = '#4CAF50';
        cleanStatus.style.fontWeight = 'bold';
        nextButton.disabled = false;
    } else if (cleanPercentage > 80) {
        cleanStatus.textContent = "Почти готово! Ещё чуть-чуть! 💫";
    } else if (cleanPercentage > 60) {
        cleanStatus.textContent = "Отлично! Зуб уже блестит! 🌟";
    } else if (cleanPercentage > 40) {
        cleanStatus.textContent = "Хорошая работа! Продолжаем в том же духе! 👍";
    } else if (cleanPercentage > 20) {
        cleanStatus.textContent = "Начинает блестеть! Виден прогресс! ✨";
    } else if (cleanPercentage > 5) {
        cleanStatus.textContent = "Начало положено! Продолжаем чистку! 🪥";
    }
}

// Голосовое управление
function setupVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'ru-RU';
        
        recognition.onstart = function() {
            isListening = true;
            document.getElementById('voiceIcon').classList.add('listening');
            document.getElementById('voiceStatus').textContent = "🎤 Слушаю... Говорите слово 'ПОДАРОК'!";
            document.getElementById('voiceButton').textContent = "Остановить прослушивание";
            document.getElementById('voiceButton').style.background = 'linear-gradient(45deg, #f44336, #FF9800)';
        };
        
        recognition.onresult = function(event) {
            const speechResult = event.results[0][0].transcript.toUpperCase();
            document.getElementById('voiceStatus').textContent = `Вы сказали: "${speechResult}"`;
            
            if (speechResult.includes('ПОДАРОК')) {
                handleSuccessfulUnlock();
            } else {
                document.getElementById('voiceStatus').textContent = `Не распознано. Вы сказали: "${speechResult}". Попробуйте ещё раз!`;
                setTimeout(() => {
                    if (isListening) {
                        recognition.start();
                    }
                }, 2000);
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Ошибка распознавания:', event.error);
            document.getElementById('voiceStatus').textContent = "Ошибка микрофона. Используйте ручной ввод.";
            resetVoiceButton();
        };
        
        recognition.onend = function() {
            resetVoiceButton();
        };
    } else {
        document.getElementById('voiceStatus').textContent = "Браузер не поддерживает голосовое управление. Используйте ручной ввод.";
        document.getElementById('voiceButton').disabled = true;
    }
}

function resetVoiceButton() {
    isListening = false;
    document.getElementById('voiceIcon').classList.remove('listening');
    document.getElementById('voiceButton').textContent = "Включить микрофон";
    document.getElementById('voiceButton').style.background = 'linear-gradient(45deg, #2196F3, #21CBF3)';
}

function toggleVoiceInstructions() {
    const instructions = document.getElementById('voiceInstructions');
    instructions.classList.toggle('hidden');
}

function startVoiceRecognition() {
    if (!recognition) {
        document.getElementById('voiceStatus').textContent = "Голосовое управление не доступно";
        return;
    }
    
    if (!isListening) {
        try {
            recognition.start();
        } catch (error) {
            document.getElementById('voiceStatus').textContent = "Ошибка запуска микрофона. Используйте ручной ввод.";
        }
    } else {
        recognition.stop();
    }
}

// Ручной ввод
function openGiftWithCode() {
    const manualInput = document.getElementById('manualInput');
    const voiceControls = document.querySelector('.voice-controls');
    
    manualInput.classList.remove('hidden');
    voiceControls.classList.add('hidden');
    document.getElementById('codeInput').focus();
}

function checkManualCode() {
    const input = document.getElementById('codeInput');
    const code = input.value.toUpperCase().trim();
    
    if (code === 'ПОДАРОК') {
        input.classList.add('correct');
        document.getElementById('voiceStatus').textContent = "✅ Верно! Открываю подарок!";
        setTimeout(openGift, 1000);
    } else {
        input.style.borderColor = '#f44336';
        document.getElementById('voiceStatus').textContent = "❌ Неверно. Попробуйте ещё раз!";
        setTimeout(() => {
            input.style.borderColor = '#e0e0e0';
            input.focus();
        }, 2000);
    }
}

function handleSuccessfulUnlock() {
    document.getElementById('voiceStatus').textContent = "✅ Верно! Открываю подарок! 🎉";
    document.getElementById('voiceIcon').classList.remove('listening');
    document.getElementById('voiceIcon').textContent = "✅";
    setTimeout(openGift, 1500);
}

function openGift() {
    document.getElementById('giftContent').classList.remove('hidden');
    document.getElementById('voiceInstructions').classList.add('hidden');
    createFireworks();
}

// Фейерверки
function createFireworks() {
    const container = document.getElementById('fireworksContainer');
    container.innerHTML = '';
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 100 + '%';
            firework.style.background = getRandomColor();
            firework.style.setProperty('--x', (Math.random() - 0.5) * 200 + 'px');
            firework.style.setProperty('--y', (Math.random() - 0.5) * 200 + 'px');
            container.appendChild(firework);
            
            setTimeout(() => {
                firework.remove();
            }, 2000);
        }, i * 200);
    }
}

function getRandomColor() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff'];
    return colors[Math.floor(Math.random() * colors.length)];
}