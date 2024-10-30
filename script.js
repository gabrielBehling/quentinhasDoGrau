const foodTypeElement = document.getElementById('foodType');
const menuList = document.querySelector('#cardapio ul');

const renderMenu = async (type) => {
    menuList.innerHTML = ''; // Limpa a lista atual

    let data = await getData()
    data[type].forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <img class="prato" src="${item.link}" alt="${item.name}">
            <div class="centered-text">
                <h4>${item.name}</h4>
                <p>R$ ${item.price.toFixed(2)}</p>
            </div>
        `;
        menuList.appendChild(listItem);
    });
};

// Inicializa com o menu de almoço
renderMenu('almoco');

// Trocar entre as abas
const tabs = document.querySelectorAll('.menu-tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const type = tab.textContent.toLowerCase();
        foodTypeElement.textContent = tab.textContent;
        renderMenu(type);
    });
});

async function getData(){
    let res = await fetch('./comidas.json')
    let data = await res.json()
    return data
}