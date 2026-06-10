// ==================== QUIZ DATA ====================

const quizQuestions = [
    {
        question: "O que é sustentabilidade agrícola?",
        options: [
            "Produção de alimentos sem danificar o meio ambiente",
            "Usar o máximo de agrotóxicos possível",
            "Vender alimentos a qualquer preço",
            "Não utilizar máquinas agrícolas"
        ],
        correct: 0,
        explanation: "Sustentabilidade agrícola significa produzir alimentos mantendo a saúde do solo, da água e da biodiversidade para futuras gerações."
    },
    {
        question: "Qual é o benefício da rotação de culturas?",
        options: [
            "Aumenta a venda de sementes",
            "Mantém o solo saudável e reduz pragas naturalmente",
            "Elimina completamente as pragas",
            "Reduz a necessidade de água"
        ],
        correct: 1,
        explanation: "A rotação de culturas melhora a fertilidade do solo e reduz a incidência de doenças e pragas específicas das plantas."
    },
    {
        question: "Como a compostagem ajuda na agricultura?",
        options: [
            "Transforma resíduos em adubo natural",
            "Aumenta o preço do produto final",
            "Reduz a produção de alimentos",
            "Elimina a necessidade de água"
        ],
        correct: 0,
        explanation: "A compostagem transforma resíduos orgânicos em adubo rico em nutrientes, melhorando a fertilidade do solo naturalmente."
    },
    {
        question: "Qual energia é sustentável para uso na agricultura?",
        options: [
            "Combustíveis fósseis",
            "Energia nuclear apenas",
            "Energia solar e eólica",
            "Energia de carvão"
        ],
        correct: 2,
        explanation: "Energia solar e eólica são fontes renováveis que reduzem emissões e custos operacionais das propriedades agrícolas."
    },
    {
        question: "Por que proteger os polinizadores é importante?",
        options: [
            "Não tem importância para a agricultura",
            "Eles polinizam as plantas e aumentam a produção",
            "Para ter insetos bonitos",
            "Porque aumenta o preço dos alimentos"
        ],
        correct: 1,
        explanation: "Polinizadores como abelhas são essenciais para a reprodução de muitas plantas, garantindo a produção de alimentos."
    },
    {
        question: "Qual é um método sustentável de irrigação?",
        options: [
            "Deixar a água escorrer livremente",
            "Usar sistemas de gotejamento que economizam água",
            "Irrigar manualmente todos os dias",
            "Não irrigar as plantas"
        ],
        correct: 1,
        explanation: "Sistemas de irrigação por gotejamento são eficientes e economizam até 50% de água comparado a métodos tradicionais."
    }
];

// ==================== DARK MODE E FONT SIZE ====================

const darkModeToggle = document.getElementById('darkModeToggle');
const fontSizeToggle = document.getElementById('fontSizeToggle');
const darkModeIcon = document.getElementById('darkModeIcon');
const fontSizeIcon = document.getElementById('fontSizeIcon');

// Verificar preferências salvas
function loadPreferences() {
    const darkMode = localStorage.getItem('darkMode');
    const largeFont = localStorage.getItem('largeFont');

    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeIcon.textContent = '☀️';
    }

    if (largeFont === 'enabled') {
        document.body.classList.add('large-font');
        fontSizeIcon.textContent = 'A';
    }
}

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeIcon.textContent = isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
});

// Font Size Toggle
fontSizeToggle.addEventListener('click', () => {
    document.body.classList.toggle('large-font');
    const isLargeFont = document.body.classList.contains('large-font');
    fontSizeIcon.textContent = isLargeFont ? 'A' : 'A+';
    localStorage.setItem('largeFont', isLargeFont ? 'enabled' : 'disabled');
});

// Logo click - scroll to top
document.querySelector('.logo').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Carregar preferências ao iniciar
loadPreferences();

// ==================== QUIZ LOGIC ====================

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let quizStarted = false;

function initializeQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    const quizResult = document.getElementById('quizResult');
    
    quizContainer.innerHTML = '';
    quizResult.classList.add('hidden');
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    quizStarted = true;
    
    loadQuestion();
}

function loadQuestion() {
    const quizContainer = document.getElementById('quizContainer');
    const question = quizQuestions[currentQuestionIndex];
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-question';
    questionDiv.innerHTML = `
        <h3>Pergunta ${currentQuestionIndex + 1} de ${quizQuestions.length}</h3>
        <p style="margin-bottom: 1.5rem; font-size: 1.1rem;"><strong>${question.question}</strong></p>
        <div class="quiz-options">
            ${question.options.map((option, index) => `
                <button class="quiz-option" data-index="${index}" onclick="selectAnswer(${index})">
                    ${String.fromCharCode(65 + index)}. ${option}
                </button>
            `).join('')}
        </div>
    `;
    
    quizContainer.innerHTML = '';
    quizContainer.appendChild(questionDiv);
}

function selectAnswer(index) {
    const question = quizQuestions[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = index;
    
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((option, i) => {
        option.disabled = true;
        
        if (i === question.correct) {
            option.classList.add('correct');
        } else if (i === index && index !== question.correct) {
            option.classList.add('incorrect');
        }
    });
    
    if (index === question.correct) {
        score++;
    }
    
    // Mostrar próxima pergunta após 1.5 segundos
    setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    const quizContainer = document.getElementById('quizContainer');
    const quizResult = document.getElementById('quizResult');
    const scoreText = document.getElementById('scoreText');
    const scoreBar = document.getElementById('scoreBar');
    const resultMessage = document.getElementById('resultMessage');
    
    quizContainer.innerHTML = '';
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    scoreText.textContent = `${score} de ${quizQuestions.length} acertos (${percentage}%)`;
    scoreBar.style.width = percentage + '%';
    
    let message = '';
    if (percentage === 100) {
        message = '🏆 Excelente! Você é um especialista em sustentabilidade agrícola!';
    } else if (percentage >= 80) {
        message = '🎉 Muito bom! Você tem grande conhecimento sobre o assunto!';
    } else if (percentage >= 60) {
        message = '✅ Bom! Continue aprendendo mais sobre sustentabilidade!';
    } else if (percentage >= 40) {
        message = '📚 Continue estudando! Você está no caminho certo!';
    } else {
        message = '💪 Não desista! Pratique mais e melhore seus conhecimentos!';
    }
    
    resultMessage.textContent = message;
    quizResult.classList.remove('hidden');
}

// ==================== INICIALIZAR QUIZ ====================

const quizContainer = document.getElementById('quizContainer');
if (quizContainer) {
    // Criar botão inicial
    const startButton = document.createElement('button');
    startButton.className = 'btn-primary';
    startButton.textContent = '▶️ Iniciar Quiz';
    startButton.style.maxWidth = '400px';
    startButton.style.margin = '2rem auto';
    startButton.style.display = 'block';
    startButton.onclick = initializeQuiz;
    
    quizContainer.appendChild(startButton);
}

// Reiniciar Quiz
const restartQuizBtn = document.getElementById('restartQuiz');
if (restartQuizBtn) {
    restartQuizBtn.addEventListener('click', initializeQuiz);
}

// ==================== SMOOTH SCROLL REVELAÇÃO ====================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos com classes de animação
document.querySelectorAll('.info-box, .tip-card, .credit-box').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ==================== SCROLL ANIMATIONS ====================

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Parallax background subtle effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.boxShadow = `0 ${Math.min(scrollY / 50, 10)}px 32px rgba(0, 0, 0, 0.1)`;
    }
});

// ==================== ANIMAÇÕES DE ENTRADA ====================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromBottom {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .tip-card {
        animation: slideInFromBottom 0.6s ease forwards;
    }
`;
document.head.appendChild(style);

// ==================== CONSOLE MESSAGE ====================

console.log('%c🌾 Bem-vindo ao projeto Agro Forte 2026! 🌾', 
    'color: #2d5016; font-size: 16px; font-weight: bold;');
console.log('%cDesenvolvido por: Ezequiel Oliveira', 
    'color: #6ba623; font-size: 14px;');
console.log('%cProfessor Orientador: Guilherme Cordeiro', 
    'color: #f4a460; font-size: 14px;');
