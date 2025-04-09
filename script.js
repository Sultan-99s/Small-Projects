const config = {
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    avoidAmbiguous: false
};

const history = [];
let copyTimeout;

const presets = {
    basic: {
        length: 12,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
        avoidAmbiguous: false
    },
    strong: {
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        avoidAmbiguous: true
    },
    max: {
        length: 32,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        avoidAmbiguous: false
    }
};

// DOM Elements
const elements = {
    password: document.getElementById('password'),
    copyBtn: document.getElementById('copyBtn'),
    lengthSlider: document.getElementById('lengthSlider'),
    lengthValue: document.getElementById('lengthValue'),
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    numbers: document.getElementById('numbers'),
    symbols: document.getElementById('symbols'),
    avoidAmbiguous: document.getElementById('avoidAmbiguous'),
    generateBtn: document.getElementById('generateBtn'),
    historyList: document.getElementById('historyList'),
    strengthText: document.getElementById('strengthText'),
    strengthIcon: document.getElementById('strengthIcon')
};

// Event Listeners
elements.lengthSlider.addEventListener('input', (e) => {
    config.length = parseInt(e.target.value);
    elements.lengthValue.textContent = config.length;
    updateStrengthIndicator();
});

elements.uppercase.addEventListener('change', (e) => {
    config.uppercase = e.target.checked;
    updateStrengthIndicator();
});

elements.lowercase.addEventListener('change', (e) => {
    config.lowercase = e.target.checked;
    updateStrengthIndicator();
});

elements.numbers.addEventListener('change', (e) => {
    config.numbers = e.target.checked;
    updateStrengthIndicator();
});

elements.symbols.addEventListener('change', (e) => {
    config.symbols = e.target.checked;
    updateStrengthIndicator();
});

elements.avoidAmbiguous.addEventListener('change', (e) => {
    config.avoidAmbiguous = e.target.checked;
});

elements.generateBtn.addEventListener('click', generatePassword);
elements.copyBtn.addEventListener('click', copyToClipboard);

document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const preset = presets[btn.dataset.preset];
        Object.assign(config, preset);
        updateUI();
        updateStrengthIndicator();
    });
});

// Functions
function generatePassword() {
    let chars = '';
    if (config.uppercase) chars += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (config.lowercase) chars += 'abcdefghijkmnopqrstuvwxyz';
    if (config.numbers) chars += '23456789';
    if (config.symbols) chars += '!@#$%^&*';
    
    if (!config.avoidAmbiguous) {
        if (config.uppercase) chars += 'OI';
        if (config.lowercase) chars += 'l';
        if (config.numbers) chars += '01';
        if (config.symbols) chars += '|';
    }

    if (chars.length === 0) {
        elements.password.textContent = 'Please select at least one character type';
        return;
    }

    let password = '';
    for (let i = 0; i < config.length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    elements.password.textContent = password;
    history.unshift(password);
    if (history.length > 5) history.pop();
    updateHistory();
}

function copyToClipboard() {
    const password = elements.password.textContent;
    if (password && password !== 'Please select at least one character type' && 
        password !== 'Generated password will appear here') {
        navigator.clipboard.writeText(password);
        elements.copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
        
        clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
            elements.copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
        }, 2000);
    }
}

function updateHistory() {
    elements.historyList.innerHTML = history.map(pass => `
        <div class="history-item">
            <span>${pass}</span>
            <button onclick="copyHistoryPassword('${pass}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
        </div>
    `).join('');
}

function copyHistoryPassword(password) {
    navigator.clipboard.writeText(password);
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    setTimeout(() => {
        btn.innerHTML = originalHTML;
    }, 2000);
}

function updateUI() {
    elements.lengthSlider.value = config.length;
    elements.lengthValue.textContent = config.length;
    elements.uppercase.checked = config.uppercase;
    elements.lowercase.checked = config.lowercase;
    elements.numbers.checked = config.numbers;
    elements.symbols.checked = config.symbols;
    elements.avoidAmbiguous.checked = config.avoidAmbiguous;
}

function updateStrengthIndicator() {
    const types = [config.uppercase, config.lowercase, config.numbers, config.symbols].filter(Boolean).length;
    let strength, color, icon;

    if (config.length >= 16 && types >= 3) {
        strength = 'Strong';
        color = 'strong';
        icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="strong"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>';
    } else if (config.length >= 12 && types >= 2) {
        strength = 'Medium';
        color = 'medium';
        icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="medium"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>';
    } else {
        strength = 'Weak';
        color = 'weak';
        icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="weak"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>';
    }

    elements.strengthText.textContent = `${strength} Password`;
    elements.strengthText.className = `strength-text ${color}`;
    elements.strengthIcon.innerHTML = icon;
}

// Initial setup
updateUI();
updateStrengthIndicator();