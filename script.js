let userUAH = 0; 
let userGems = 0; 
let userPasses = 0; 

let rewardMultiplier = 1.0;
let priceDiscountMultiplier = 1.0;

let currentLang = 'ua';
let musicEnabled = true;
let sfxEnabled = true;
let isLightMode = false;

const translations = {
    ua: {
        title: "Cyber Store",
        settingsTitle: "Ігрові Налаштування",
        settingsDesc: "Керуйте мовою, звуками, музикою та темою оформлення:",
        langLabel: "Мова / Language",
        musicLabel: "Музика / Music",
        sfxLabel: "Звукові ефекти / SFX",
        themeModeLabel: "Режим теми",
        on: "Увімк",
        off: "Вимк",
        dark: "Темна",
        light: "Світла",
        tabGems: "Геми",
        tabOffers: "Акції",
        tabMerch: "Мерч",
        tabWheel: "Колесо Фортуни",
        wheelTitle: "Колесо Фортуни",
        wheelDesc: "Крути безкоштовно та вибивай гривні або рідкісний Пропуск (🎫)!",
        spinBtn: "Крутити безкоштовно! 🎡",
        cartTitle: "Кошик замовлень",
        emptyCart: "Кошик порожній 🛒",
        totalLabel: "Разом до сплати:",
        checkoutStd: "Оплатити стандартно",
        checkoutPass: "Купити за Пропуски 🎫",
        boxModalTitle: "🎁 Відкриття Мега Ящика х3",
        claimRewards: "Забрати нагороди"
    },
    en: {
        title: "Cyber Store",
        settingsTitle: "Game Settings",
        settingsDesc: "Manage language, sound, music and visual mode:",
        langLabel: "Language",
        musicLabel: "Music",
        sfxLabel: "Sound Effects",
        themeModeLabel: "Theme Mode",
        on: "On",
        off: "Off",
        dark: "Dark",
        light: "Light",
        tabGems: "Gems",
        tabOffers: "Offers",
        tabMerch: "Merch",
        tabWheel: "Fortune Wheel",
        wheelTitle: "Fortune Wheel",
        wheelDesc: "Spin for free and win UAH or rare Passes (🎫)!",
        spinBtn: "Spin Free! 🎡",
        cartTitle: "Shopping Cart",
        emptyCart: "Cart is empty 🛒",
        totalLabel: "Total:",
        checkoutStd: "Standard Checkout",
        checkoutPass: "Buy with Passes 🎫",
        boxModalTitle: "🎁 Mega Box Opening x3",
        claimRewards: "Claim Rewards"
    }
};

let audioCtx = null;
let musicInterval = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(freq, duration, type = 'sine') {
    if (!sfxEnabled) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
}

function startCyberMusic() {
    if (!musicEnabled) return;
    stopCyberMusic();
    initAudio();
    const notes = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00];
    musicInterval = setInterval(() => {
        if (!musicEnabled) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            const note = notes[Math.floor(Math.random() * notes.length)];
            osc.frequency.setValueAtTime(note, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.6);
        } catch(e) {}
    }, 800);
}

function stopCyberMusic() {
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
}

const storeData = {
    gems: [
        { id: 'g1', name: '30 Гемів', desc: 'Маленький набір для швидкого старту', price: '49 ₴', priceValue: 49, passCost: 1, gemsReward: 30, icon: 'fa-gem' },
        { id: 'g2', name: '80 Гемів', desc: 'Популярний вибір для покупців', price: '129 ₴', priceValue: 129, passCost: 2, gemsReward: 80, icon: 'fa-gem' },
        { id: 'g3', name: '170 Гемів', desc: 'Вигідний набір зі знижкою 10%', price: '249 ₴', priceValue: 249, passCost: 3, gemsReward: 170, icon: 'fa-gem' },
        { id: 'g4', name: '360 Гемів', desc: 'Пакет для справжніх бійців', price: '499 ₴', priceValue: 499, passCost: 5, gemsReward: 360, icon: 'fa-gem' },
        { id: 'g5', name: '950 Гемів', desc: 'Мега набір гемових заощаджень', price: '999 ₴', priceValue: 999, passCost: 10, gemsReward: 950, icon: 'fa-gem' },
        { id: 'g6', name: '2000 Гемів', desc: 'Ексклюзивний ультра-набір для профі', price: '1999 ₴', priceValue: 1999, passCost: 20, gemsReward: 2000, icon: 'fa-gem' },
        { id: 'g7', name: '5,000 Гемів', desc: 'Величезний запас гемів для будь-яких покупок', price: '3499 ₴', priceValue: 3499, passCost: 35, gemsReward: 5000, icon: 'fa-gem' },
        { id: 'g8', name: '10,000 Гемів', desc: 'Гранд-пакет гемів для справжніх колекціонерів', price: '5999 ₴', priceValue: 5999, passCost: 60, gemsReward: 10000, icon: 'fa-gem' },
        { id: 'g9', name: '20,000 Гемів', desc: 'Елітний запас для миттєвої купівлі топ-акцій', price: '10999 ₴', priceValue: 10999, passCost: 110, gemsReward: 20000, icon: 'fa-gem' },
        { id: 'g10', name: '50,000 Гемів', desc: 'Космічний скарб для абсолютного домінування', price: '24999 ₴', priceValue: 24999, passCost: 250, gemsReward: 50000, icon: 'fa-gem' }
    ],
    offers: [
        { id: 'o1', name: 'Мега Ящик х3', desc: 'Реальне відкриття 3 ящиків з унікальним дропом гривень та гемів!', price: '80 Геми', priceValue: 80, passCost: 2, isGemPrice: true, isBoxOffer: true, icon: 'fa-box-open' },
        { id: 'o2', name: 'Преміум Бонус', desc: 'Подвійний досвід та нагороди на 7 днів', price: '50 Геми', priceValue: 50, passCost: 1, isGemPrice: true, isBonusOffer: true, icon: 'fa-star' },
        { id: 'o3', name: 'Титульний Набір', desc: 'Ексклюзивна анімація профілю та значки', price: '120 Геми', priceValue: 120, passCost: 3, isGemPrice: true, isTitleOffer: true, icon: 'fa-shield-halved' },
        // Нова акція на налаштування за 75000 гемів (без можливості купити за пропуски: passCost відсутній або не використовується для купівлі за пропуски)
        { id: 'o_settings', name: 'Панель Налаштувань', desc: 'Розблоковує зміну мови, музику, звукові ефекти та теми!', price: '75000 Геми', priceValue: 75000, passCost: 999999, isGemPrice: true, isSettingsOffer: true, icon: 'fa-sliders' }
    ],
    merch: [
        { id: 'm1', name: 'Худі Brawl Star', desc: 'Тепле фірмове худі з принтом логотипу', price: '450 Геми', priceValue: 450, passCost: 10, isGemPrice: true, icon: 'fa-shirt' },
        { id: 'm2', name: 'Кепка Spike', desc: 'Стильна кепка із зображенням Спайка', price: '150 Геми', priceValue: 150, passCost: 4, isGemPrice: true, icon: 'fa-hat-cowboy' },
        { id: 'm3', name: 'Рюкзак Школяра', desc: 'Міцний міський рюкзак з кишенею', price: '600 Геми', priceValue: 600, passCost: 15, isGemPrice: true, icon: 'fa-backpack' }
    ]
};

let cart = [];
let isCustomizerUnlocked = false;
let isSettingsUnlocked = false;
let isUltraNeonUnlocked = false;
let isSuperPremiumUnlocked = false;
let isUltrametaUnlocked = false;

function updateBalanceUI() {
    document.getElementById('user-uah').textContent = userUAH.toLocaleString();
    document.getElementById('user-gems').textContent = userGems.toLocaleString();
    document.getElementById('user-passes').textContent = userPasses.toLocaleString();
}

function buyExclusiveOffer() {
    const cost = 100000;
    if (userGems < cost) {
        playSound(150, 0.3, 'sawtooth');
        alert("Недостатньо гемів! Потрібно 100,000 💎");
        return;
    }
    userGems -= cost;
    playSound(600, 0.4, 'sine');
    updateBalanceUI();

    isCustomizerUnlocked = true;
    document.getElementById('promo-banner').style.display = 'none';
    document.getElementById('customizer-panel').classList.remove('hidden');
    document.getElementById('promo-banner-200k').classList.remove('hidden');

    alert("Легендарний кастомізатор активовано! 🎉");
}

function buyUltraNeonOffer() {
    const cost = 200000;
    if (userGems < cost) {
        playSound(150, 0.3, 'sawtooth');
        alert("Недостатньо гемів! Потрібно 200,000 💎");
        return;
    }
    userGems -= cost;
    playSound(650, 0.4, 'sine');
    updateBalanceUI();
    isUltraNeonUnlocked = true;
    document.getElementById('promo-banner-200k').style.display = 'none';
    document.querySelectorAll('.ultraneon-btn').forEach(btn => btn.classList.remove('hidden'));
    document.getElementById('promo-banner-500k').classList.remove('hidden');
    alert("Супер Ультра Неоновий Інтерфейс придбано! 🔥");
}

function buySuperPremiumOffer() {
    const cost = 500000;
    if (userGems < cost) {
        playSound(150, 0.3, 'sawtooth');
        alert("Недостатньо гемів! Потрібно 500,000 💎");
        return;
    }
    userGems -= cost;
    playSound(700, 0.4, 'sine');
    updateBalanceUI();
    isSuperPremiumUnlocked = true;
    document.getElementById('promo-banner-500k').style.display = 'none';
    document.querySelectorAll('.super-btn').forEach(btn => btn.classList.remove('hidden'));
    document.getElementById('promo-banner-1m').classList.remove('hidden');
    alert("Супер Преміум Переливання придбано! 🌟");
}

function buyUltrametaOffer() {
    const cost = 1000000;
    if (userGems < cost) {
        playSound(150, 0.3, 'sawtooth');
        alert("Недостатньо гемів! Потрібно 1,000,000 💎");
        return;
    }
    userGems -= cost;
    playSound(800, 0.5, 'sine');
    updateBalanceUI();

    isUltrametaUnlocked = true;
    priceDiscountMultiplier = 0.95; 
    rewardMultiplier = 1.10; 

    document.getElementById('promo-banner-1m').style.display = 'none';
    document.querySelectorAll('.mega-btn').forEach(btn => btn.classList.remove('hidden'));

    for (const cat in storeData) {
        storeData[cat].forEach(item => {
            item.priceValue = Math.floor(item.priceValue * priceDiscountMultiplier);
        });
    }
    renderProducts();

    alert("👑🔥 УЛЬТРА МЕГА АПОКАЛІПСИС АКТИВОВАНО!");
}

// Функції керування налаштуваннями
function setLanguage(lang) {
    playSound(400, 0.1);
    currentLang = lang;
    document.getElementById('lang-ua').classList.toggle('active', lang === 'ua');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

function toggleMusic(status) {
    playSound(400, 0.1);
    musicEnabled = status;
    document.getElementById('music-on').classList.toggle('active', status);
    document.getElementById('music-off').classList.toggle('active', !status);

    if (status) {
        startCyberMusic();
    } else {
        stopCyberMusic();
    }
}

function toggleSFX(status) {
    sfxEnabled = status;
    playSound(500, 0.1);
    document.getElementById('sfx-on').classList.toggle('active', status);
    document.getElementById('sfx-off').classList.toggle('active', !status);
}

function setLightDark(mode) {
    playSound(450, 0.1);
    isLightMode = (mode === 'light');
    document.getElementById('mode-dark').classList.toggle('active', mode === 'dark');
    document.getElementById('mode-light').classList.toggle('active', mode === 'light');

    if (isLightMode) {
        document.body.classList.add('theme-light');
    } else {
        document.body.classList.remove('theme-light');
    }
}

function setTheme(themeName) {
    if (!isCustomizerUnlocked) return;
    if (themeName.startsWith('ultraneon') && !isUltraNeonUnlocked) {
        alert("Ці стилі заблоковані! Потрібна акція за 200,000 гемів.");
        return;
    }
    if ((themeName === 'ultragold' || themeName === 'ultrarainbow' || themeName === 'ultramatrix') && !isSuperPremiumUnlocked) {
        alert("Ці стилі заблоковані! Потрібна акція за 500,000 гемів.");
        return;
    }
    if (themeName.startsWith('ultrameon') && !isUltrametaUnlocked) {
        alert("Ці стилі заблоковані! Потрібна мега-акція за 1,000,000 гемів.");
        return;
    }

    playSound(500, 0.1);
    
    const lightClass = isLightMode ? 'theme-light' : '';
    document.body.className = lightClass; 

    if (themeName === 'gold') document.body.classList.add('theme-gold');
    else if (themeName === 'matrix') document.body.classList.add('theme-matrix');
    else if (themeName === 'ultraneon1') document.body.classList.add('theme-ultraneon1');
    else if (themeName === 'ultraneon2') document.body.classList.add('theme-ultraneon2');
    else if (themeName === 'ultraneon3') document.body.classList.add('theme-ultraneon3');
    else if (themeName === 'ultragold') document.body.classList.add('theme-ultragold');
    else if (themeName === 'ultrarainbow') document.body.classList.add('theme-ultrarainbow');
    else if (themeName === 'ultramatrix') document.body.classList.add('theme-ultramatrix');
    else if (themeName === 'ultrameon1') document.body.classList.add('theme-ultrameon1');
    else if (themeName === 'ultrameon2') document.body.classList.add('theme-ultrameon2');
    else if (themeName === 'ultrameon3') document.body.classList.add('theme-ultrameon3');

    document.querySelectorAll('.customizer-options .theme-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

const wheelPrizes = [
    { text: "200 ₴", type: "uah", val: 200, color: "#121824" },
    { text: "20 ₴", type: "uah", val: 20, color: "#1a2233" },
    { text: "500 ₴", type: "uah", val: 500, color: "#121824" },
    { text: "100 Пропусків 🎫", type: "pass", val: 100, color: "#4d0b2b" }, 
    { text: "0 ₴", type: "uah", val: 0, color: "#1a2233" },
    { text: "1 Пропуск 🎫", type: "pass", val: 1, color: "#2b0b4d" },
    { text: "100 ₴", type: "uah", val: 100, color: "#121824" },
    { text: "40 ₴", type: "uah", val: 40, color: "#1a2233" },
    { text: "1000 ₴", type: "uah", val: 1000, color: "#121824" },
    { text: "0 ₴", type: "uah", val: 0, color: "#1a2233" },
    { text: "100 ₴", type: "uah", val: 100, color: "#1a2233" }
];

let currentRotation = 0;
let isSpinning = false;

function initWheel() {
    const wheel = document.getElementById('fortune-wheel');
    const totalSectors = wheelPrizes.length;
    const sectorAngle = 360 / totalSectors;
    
    wheel.innerHTML = wheelPrizes.map((prize, index) => {
        const rotate = index * sectorAngle;
        return `
            <div class="wheel-sector" style="transform: rotate(${rotate}deg) skewY(-60deg); background: ${prize.color};">
                <span>${prize.text}</span>
            </div>
        `;
    }).join('');
}

function spinWheel() {
    if (isSpinning) return;
    playSound(300, 0.2);

    isSpinning = true;
    const resultDiv = document.getElementById('wheel-result');
    resultDiv.textContent = currentLang === 'ua' ? "Крутимо..." : "Spinning...";

    let randomSector;
    const randRoll = Math.random();
    
    if (randRoll < 0.05) {
        randomSector = wheelPrizes.findIndex(p => p.val === 100 && p.type === 'pass');
    } else if (randRoll < 0.15) { 
        randomSector = wheelPrizes.findIndex(p => p.val === 10 && p.type === 'pass');
    } else if (randRoll < 0.40) { 
        randomSector = wheelPrizes.findIndex(p => p.val === 1 && p.type === 'pass');
    } else {
        const otherIndices = wheelPrizes.map((p, idx) => ([1, 10, 100].includes(p.val) && p.type === 'pass') ? -1 : idx).filter(idx => idx !== -1);
        randomSector = otherIndices[Math.floor(Math.random() * otherIndices.length)];
    }

    const sectorAngle = 360 / wheelPrizes.length;
    const extraSpins = 5 * 360;
    const targetAngle = currentRotation + extraSpins + (360 - (randomSector * sectorAngle + sectorAngle / 2));
    
    currentRotation = targetAngle;
    const wheel = document.getElementById('fortune-wheel');
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        isSpinning = false;
        const prize = wheelPrizes[randomSector];
        let finalVal = Math.floor(prize.val * rewardMultiplier);

        if (prize.type === "uah") {
            userUAH += finalVal;
        } else if (prize.type === "pass") {
            userPasses += finalVal;
        }

        playSound(700, 0.3);
        if (prize.val > 0) {
            resultDiv.textContent = currentLang === 'ua' ? `Вітаємо! Ви виграли ${finalVal} ${prize.type === 'uah' ? '₴' : 'Пропусків'}! 🎉` : `Congrats! You won ${finalVal} ${prize.type === 'uah' ? 'UAH' : 'Passes'}! 🎉`;
        } else {
            resultDiv.textContent = currentLang === 'ua' ? `На жаль, цього разу пусто 😢` : `Unfortunately, nothing this time 😢`;
        }
        updateBalanceUI();
    }, 4000);
}

function renderProducts() {
    for (const category in storeData) {
        const grid = document.getElementById(`${category}-grid`);
        if (!grid) continue;

        grid.innerHTML = storeData[category].map(item => `
            <div class="product-card">
                <i class="fa-solid ${item.icon} product-icon"></i>
                <h3>${item.name}</h3>
                <p class="product-desc">${item.desc}</p>
                <div class="product-footer">
                    <div class="product-price">
                        <span>${item.priceValue} Геми</span>
                        ${item.isSettingsOffer ? '<small>Тільки за геми</small>' : '<small>або ' + item.passCost + ' 🎫</small>'}
                    </div>
                    <button class="btn-buy" id="btn-${item.id}" onclick="addToCart('${item.id}', '${category}')">У кошик</button>
                </div>
            </div>
        `).join('');
    }
}

const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        playSound(350, 0.08);
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
});

function addToCart(id, category) {
    playSound(500, 0.1);
    const item = storeData[category].find(p => p.id === id);
    if (item) {
        cart.push(item);
        updateCartUI();

        const cartBtn = document.getElementById('open-cart');
        const buyBtn = document.getElementById(`btn-${id}`);

        cartBtn.classList.add('cart-animate');
        if (buyBtn) buyBtn.classList.add('btn-added');

        setTimeout(() => {
            cartBtn.classList.remove('cart-animate');
            if (buyBtn) buyBtn.classList.remove('btn-added');
        }, 400);
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-text">${translations[currentLang].emptyCart}</p>`;
        cartTotal.textContent = '0 ₴ / 0 💎';
        return;
    }

    let totalUAH = 0;
    let totalGems = 0;
    let totalPassesNeeded = 0;

    cartItemsContainer.innerHTML = cart.map((item, index) => {
        if (item.isGemPrice) {
            totalGems += item.priceValue;
        } else {
            totalUAH += item.priceValue;
        }
        if (!item.isSettingsOffer) {
            totalPassesNeeded += item.passCost;
        }

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>${item.priceValue} 💎 ${!item.isSettingsOffer ? '(або ' + item.passCost + ' 🎫)' : ''}</span>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    }).join('');

    cartTotal.textContent = `${totalUAH} ₴ / ${totalGems} 💎 (або ${totalPassesNeeded} 🎫)`;
}

function removeFromCart(index) {
    playSound(250, 0.1);
    cart.splice(index, 1);
    updateCartUI();
}

const cartModal = document.getElementById('cart-modal');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');

function openModal() { playSound(400, 0.1); cartModal.classList.add('open'); }
function closeModal() { playSound(300, 0.1); cartModal.classList.remove('open'); }

openCartBtn.addEventListener('click', openModal);
closeCartBtn.addEventListener('click', closeModal);
cartModal.addEventListener('click', (e) => { if (e.target === cartModal) closeModal(); });

let openedBoxesCount = 0;
let accumulatedRewards = { uah: 0, gems: 0, passes: 0 };

function checkout(type) {
    if (cart.length === 0) {
        alert(currentLang === 'ua' ? 'Ваш кошик порожній!' : 'Your cart is empty!');
        return;
    }

    // Перевірка чи не намагаються купити акцію на налаштування за пропуски
    if (type === 'pass') {
        const hasSettingsInCart = cart.some(item => item.isSettingsOffer);
        if (hasSettingsInCart) {
            alert('Акцію на налаштування не можна купити за пропуски!');
            return;
        }
    }

    let totalUAH = 0;
    let totalGemsNeeded = 0;
    let totalPassesNeeded = 0;

    cart.forEach(item => {
        if (item.isGemPrice) {
            totalGemsNeeded += item.priceValue;
        } else {
            totalUAH += item.priceValue;
        }
        if (!item.isSettingsOffer) {
            totalPassesNeeded += item.passCost;
        }
    });

    if (type === 'pass') {
        if (userPasses < totalPassesNeeded) {
            alert(`Недостатньо пропусків! Потрібно ${totalPassesNeeded} 🎫`);
            return;
        }
        userPasses -= totalPassesNeeded;
    } else {
        if (userUAH < totalUAH || userGems < totalGemsNeeded) {
            alert('Недостатньо коштів на балансі!');
            return;
        }
        userUAH -= totalUAH;
        userGems -= totalGemsNeeded;
    }

    let hasBoxOffer = false;
    let hasSettingsBought = false;

    cart.forEach(item => {
        if (item.gemsReward && !item.isGemPrice) {
            userGems += Math.floor(item.gemsReward * rewardMultiplier);
        }
        if (item.isBoxOffer) hasBoxOffer = true;
        if (item.isSettingsOffer) hasSettingsBought = true;
    });

    playSound(750, 0.4);
    alert(currentLang === 'ua' ? 'Успішна оплата замовлення!' : 'Successful payment!');
    
    cart = [];
    updateCartUI();
    updateBalanceUI();
    closeModal();

    if (hasBoxOffer) {
        openBoxOpeningModal();
    }

    if (hasSettingsBought) {
        isSettingsUnlocked = true;
        document.getElementById('settings-panel').classList.remove('hidden');
        alert('⚙️ Панель налаштувань успішно активовано!');
    }
}

function openBoxOpeningModal() {
    openedBoxesCount = 0;
    accumulatedRewards = { uah: 0, gems: 0, passes: 0 };
    
    const container = document.getElementById('boxes-container');
    const summary = document.getElementById('box-rewards-summary');
    const closeBtn = document.getElementById('close-box-modal');
    
    summary.textContent = currentLang === 'ua' ? "Натисніть на кожен ящик, щоб відкрити його!" : "Click each box to open it!";
    closeBtn.classList.add('hidden');

    container.innerHTML = [0, 1, 2].map(i => `
        <div class="reward-box" id="box-${i}" onclick="openBox(${i})">
            <i class="fa-solid fa-box-open"></i>
            <span>Ящик #${i+1}</span>
        </div>
    `).join('');

    document.getElementById('box-opening-modal').classList.add('open');
}

function openBox(index) {
    const boxEl = document.getElementById(`box-${index}`);
    if (boxEl.classList.contains('opened')) return;

    playSound(600, 0.2);
    boxEl.classList.add('opened');
    
    let rewardText = [];
    
    if (Math.random() < 0.50) {
        const u = Math.floor(((Math.floor(Math.random() * 200) + 50) * 3) * rewardMultiplier); 
        accumulatedRewards.uah += u;
        userUAH += u;
        rewardText.push(`${u} ₴`);
    }
    
    if (Math.random() < 0.20) {
        const g = Math.floor(((Math.floor(Math.random() * 30) + 10) * 3) * rewardMultiplier);
        accumulatedRewards.gems += g;
        userGems += g;
        rewardText.push(`${g} 💎`);
    }

    const passRoll = Math.random();
    if (passRoll < 0.07) {
        const p = Math.floor(100 * rewardMultiplier);
        accumulatedRewards.passes += p;
        userPasses += p;
        rewardText.push(`${p} 🎫`);
    } else if (passRoll < 0.19) { 
        const p = Math.floor(50 * rewardMultiplier);
        accumulatedRewards.passes += p;
        userPasses += p;
        rewardText.push(`${p} 🎫`);
    } else if (passRoll < 0.39) { 
        const p = Math.floor(10 * rewardMultiplier);
        accumulatedRewards.passes += p;
        userPasses += p;
        rewardText.push(`${p} 🎫`);
    } else if (passRoll < 0.79) { 
        const p = Math.max(1, Math.floor(1 * rewardMultiplier));
        accumulatedRewards.passes += p;
        userPasses += p;
        rewardText.push(`${p} 🎫`);
    }

    if (rewardText.length === 0) {
        boxEl.innerHTML = `<i class="fa-solid fa-face-frown" style="color:var(--text-muted)"></i><span>Пусто</span>`;
    } else {
        boxEl.innerHTML = `<i class="fa-solid fa-gift" style="color:var(--primary-yellow)"></i><span>${rewardText.join('<br>')}</span>`;
    }

    openedBoxesCount++;
    updateBalanceUI();

    if (openedBoxesCount === 3) {
        let parts = [];
        if (accumulatedRewards.uah > 0) parts.push(`${accumulatedRewards.uah} ₴`);
        if (accumulatedRewards.gems > 0) parts.push(`${accumulatedRewards.gems} gems`);
        if (accumulatedRewards.passes > 0) parts.push(`${accumulatedRewards.passes} passes`);
        
        document.getElementById('box-rewards-summary').textContent = parts.length > 0 ? `Ви виграли: ${parts.join(', ')}!` : "Пусто 😢";
        document.getElementById('close-box-modal').classList.remove('hidden');
    }
}

function closeBoxModal() {
    playSound(300, 0.1);
    document.getElementById('box-opening-modal').classList.remove('open');
}

window.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initWheel();
    updateBalanceUI();
});
