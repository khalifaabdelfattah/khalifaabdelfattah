// AI Text Translator - JavaScript (API Powered)

const translateBtn = document.getElementById('translateBtn');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const swapLangs = document.getElementById('swapLangs');
const loading = document.getElementById('loading');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const speakBtn = document.getElementById('speakBtn');
const charCount = document.getElementById('charCount');
const themeToggle = document.getElementById('themeToggle');

// Dark Mode Toggle Logic
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Update char count
inputText.addEventListener('input', () => {
    charCount.textContent = inputText.value.length;
});

// Swap languages
swapLangs.addEventListener('click', () => {
    const sourceVal = sourceLang.value;
    const targetVal = targetLang.value;
    
    // If source is auto, we can't swap perfectly, but we'll try to guess
    if (sourceVal === 'auto') {
        sourceLang.value = targetVal;
        targetLang.value = 'en'; // Default to English if source was auto
    } else {
        sourceLang.value = targetVal;
        targetLang.value = sourceVal;
    }
    
    // If there is text, translate again
    if (inputText.value.trim()) {
        translate();
    }
});

// Translate button click
translateBtn.addEventListener('click', translate);

// Copy text
copyBtn.addEventListener('click', () => {
    if (outputText.value) {
        navigator.clipboard.writeText(outputText.value);
        const originalIcon = copyBtn.textContent;
        copyBtn.textContent = '✅';
        setTimeout(() => copyBtn.textContent = originalIcon, 2000);
    }
});

// Clear all
clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    charCount.textContent = '0';
    inputText.focus();
});

// Speak text
speakBtn.addEventListener('click', () => {
    if (outputText.value) {
        const utterance = new SpeechSynthesisUtterance(outputText.value);
        utterance.lang = targetLang.value;
        window.speechSynthesis.speak(utterance);
        
        // Visual feedback
        speakBtn.textContent = '🎵';
        setTimeout(() => speakBtn.textContent = '🔊', 1000);
    }
});

// Also translate on Enter (Ctrl+Enter)
inputText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        translate();
    }
});

async function translate() {
    const text = inputText.value.trim();
    if (!text) {
        outputText.value = 'الرجاء إدخال نص للترجمة...';
        return;
    }

    const source = sourceLang.value;
    const target = targetLang.value;

    if (source === target) {
        outputText.value = text;
        return;
    }

    showLoading(true);
    outputText.placeholder = 'جاري الترجمة...';
    outputText.value = '';

    try {
        // Using Google Translate Public API (Better quality)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
        
        console.log('Translating via Google:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();

        if (data && data[0]) {
            let result = data[0].map(item => item[0]).join('');
            outputText.value = result;
        } else {
            throw new Error('فشل في العثور على ترجمة دقيقة.');
        }
    } catch (error) {
        console.error('Translation error:', error);
        outputText.value = 'حدث خطأ في الجودة. حاول تحديد اللغة يدوياً بدلاً من الكشف التلقائي.';
    } finally {
        showLoading(false);
        outputText.placeholder = 'ستظهر الترجمة هنا...';
    }
}

// Local language detection helper
function detectLangLocally(text) {
    const arabicPattern = /[\u0600-\u06FF]/;
    if (arabicPattern.test(text)) return 'ar';
    
    // Simple check for Latin/English
    const englishPattern = /[a-zA-Z]/;
    if (englishPattern.test(text)) return 'en';
    
    return 'en'; // Default
}

function showLoading(show) {
    loading.style.display = show ? 'flex' : 'none';
    translateBtn.disabled = show;
    translateBtn.textContent = show ? 'جاري الترجمة...' : 'ترجم الآن';
}

function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}
