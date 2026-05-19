const cookBtn = document.getElementById('cookBtn');
const dishInput = document.getElementById('dishInput');
const loader = document.getElementById('loader');
const statusText = document.getElementById('cookingStatus');
const recipeOutput = document.getElementById('recipeOutput');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const cookingPhases = [
    "Ищу редкого поке-повара...",
    "Разогреваю хвост Чармандера...",
    "Пикачу заряжает миксер...",
    "Снорлакс отошел от холодильника..."
];

const trollInstructions = [
    "Используйте удар молнии, чтобы прожарить тост за 0.01 секунды.",
    "Добавьте щепотку звездной пыли и надейтесь, что блюдо не эволюционирует.",
    "Варите на медленном огне, пока покемон не скажет свое имя трижды.",
    "Просто положите это в покебол и подождите 5 минут. Подавать холодным."
];

async function startCooking() {
    const name = dishInput.value.trim().toLowerCase();
    if (!name) return alert("Введите имя (например: pikachu, ditto, bulbasaur)!");

    recipeOutput.innerHTML = '';
    loader.classList.remove('hidden');
    cookBtn.disabled = true;

    // 1. Имитация лагов
    for (let phase of cookingPhases) {
        statusText.innerText = phase;
        await delay(1000);
    }

    try {
        // 2. ЗАПРОС К POKEAPI
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        
        if (!response.ok) throw new Error("Такой ингредиент не найден в Покедексе!");

        const data = await response.json();
        const joke = trollInstructions[Math.floor(Math.random() * trollInstructions.length)];

        // 3. Отрисовка
        recipeOutput.innerHTML = `
            <div class="recipe-card">
                <h2>Шеф-повар: ${data.name.toUpperCase()}</h2>
                <div style="background: #eee; border-radius: 50%; width: 150px; margin: 0 auto;">
                    <img src="${data.sprites.front_default}" alt="${data.name}" style="width:100%;">
                </div>
                <p class="warning">Тип: ${data.types.map(t => t.type.name).join(', ')}</p>
                <div class="instruction">
                    <strong>Секретный способ приготовления:</strong><br>
                    ${joke}
                </div>
            </div>
        `;
    } catch (error) {
        recipeOutput.innerHTML = `<div class="recipe-card" style="border-color: red;">
            ❌ Ошибка: ${error.message}<br>
            <small>Попробуйте: pikachu, charizard или squirtle</small>
        </div>`;
    } finally {
        loader.classList.add('hidden');
        cookBtn.disabled = false;
    }
}

cookBtn.addEventListener('click', startCooking);