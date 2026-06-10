// AI Text Translator - JavaScript (API Powered)

const translateBtn = document.getElementById('translateBtn');
const translateBtnText = document.getElementById('translateBtnText');
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
const langToggle = document.getElementById('langToggle');
const devTagText = document.getElementById('devTagText');

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

// UI Translations
const uiTranslations = {
    ar: {
        pageTitle: "Smart Translator | المترجم الذكي",
        devTag: 'تم البرمجة بواسطة <span class="dev-name"><Kbd>Khalifa Abd ELFattah</Kbd></span>',
        themeToggleTitle: "تبديل الوضع",
        clearBtn: "مسح المحتوى",
        langToggle: "English",
        langToggleTitle: "تغيير لغة الواجهة",
        sourceLangOpts: { en: "الإنجليزية", ar: "العربية", fr: "الفرنسية", de: "الألمانية", es: "الإسبانية", ko: "الكورية" },
        targetLangOpts: { en: "الإنجليزية", ar: "العربية", fr: "الفرنسية", de: "الألمانية", es: "الإسبانية", ko: "الكورية" },
        inputTextPlaceholder: "أدخل النص هنا...",
        swapLangsTitle: "تبديل",
        speakBtnTitle: "استماع",
        copyBtnTitle: "نسخ",
        outputTextPlaceholder: "الترجمة...",
        translateBtnText: "ترجم الآن",
        translatingBtnText: "جاري الترجمة...",
        translatingPlaceholder: "جاري الترجمة...",
        translatedPlaceholder: "ستظهر الترجمة هنا...",
        emptyInputMsg: "الرجاء إدخال نص للترجمة...",
        errorMsg: "حدث خطأ في الجودة. حاول تحديد اللغة يدوياً بدلاً من الكشف التلقائي."
    },
    en: {
        pageTitle: "Smart Translator | المترجم الذكي",
        devTag: 'Programmed by <span class="dev-name"><Kbd>Khalifa Abd ELFattah</Kbd></span>',
        themeToggleTitle: "Toggle Theme",
        clearBtn: "Clear Content",
        langToggle: "العربية",
        langToggleTitle: "Change Interface Language",
        sourceLangOpts: { en: "English", ar: "Arabic", fr: "French", de: "German", es: "Spanish", ko: "Korean" },
        targetLangOpts: { en: "English", ar: "Arabic", fr: "French", de: "German", es: "Spanish", ko: "Korean" },
        inputTextPlaceholder: "Enter text here...",
        swapLangsTitle: "Swap",
        speakBtnTitle: "Listen",
        copyBtnTitle: "Copy",
        outputTextPlaceholder: "Translation...",
        translateBtnText: "Translate Now",
        translatingBtnText: "Translating...",
        translatingPlaceholder: "Translating...",
        translatedPlaceholder: "Translation will appear here...",
        emptyInputMsg: "Please enter text to translate...",
        errorMsg: "A quality error occurred. Try selecting the language manually instead of auto-detect."
    }
};

let currentUiLang = 'ar';

function updateUiLanguage() {
    const t = uiTranslations[currentUiLang];
    
    document.title = t.pageTitle;
    document.documentElement.lang = currentUiLang;
    document.documentElement.dir = currentUiLang === 'ar' ? 'rtl' : 'ltr';
    
    devTagText.innerHTML = t.devTag;
    themeToggle.title = t.themeToggleTitle;
    clearBtn.textContent = t.clearBtn;
    langToggle.textContent = t.langToggle;
    langToggle.title = t.langToggleTitle;
    
    inputText.placeholder = t.inputTextPlaceholder;
    swapLangs.title = t.swapLangsTitle;
    speakBtn.title = t.speakBtnTitle;
    copyBtn.title = t.copyBtnTitle;
    outputText.placeholder = t.outputTextPlaceholder;
    translateBtnText.textContent = t.translateBtnText;
    
    Array.from(sourceLang.options).forEach(opt => {
        opt.textContent = t.sourceLangOpts[opt.value] || opt.textContent;
    });
    
    Array.from(targetLang.options).forEach(opt => {
        opt.textContent = t.targetLangOpts[opt.value] || opt.textContent;
    });
    
    // Update local storage
    localStorage.setItem('uiLang', currentUiLang);
}

langToggle.addEventListener('click', () => {
    currentUiLang = currentUiLang === 'ar' ? 'en' : 'ar';
    updateUiLanguage();
});

// Load saved language
const savedUiLang = localStorage.getItem('uiLang');
if (savedUiLang && savedUiLang !== currentUiLang) {
    currentUiLang = savedUiLang;
    updateUiLanguage();
}

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
    const t = uiTranslations[currentUiLang];
    const text = inputText.value.trim();
    if (!text) {
        outputText.value = t.emptyInputMsg;
        return;
    }

    const source = sourceLang.value;
    const target = targetLang.value;

    if (source === target) {
        outputText.value = text;
        return;
    }

    showLoading(true);
    outputText.placeholder = t.translatingPlaceholder;
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
            throw new Error('Translation failed.');
        }
    } catch (error) {
        console.error('Translation error:', error);
        outputText.value = t.errorMsg;
    } finally {
        showLoading(false);
        outputText.placeholder = t.translatedPlaceholder;
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
    const t = uiTranslations[currentUiLang];
    loading.style.display = show ? 'flex' : 'none';
    translateBtn.disabled = show;
    translateBtnText.textContent = show ? t.translatingBtnText : t.translateBtnText;
}

function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}
