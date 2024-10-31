const foodTypeElement = document.getElementById("foodType");
const menuList = document.querySelector("#cardapio ul");
var data = await getData();
var actualType = "almoco";
var cart = [];

const renderMenu = async (type) => {
	menuList.innerHTML = ""; // Limpa a lista atual

	data[type].forEach((item) => {
		let appearances = cart.filter((v) => v.name === item.name).length;
		const listItem = document.createElement("li");
		listItem.innerHTML = `
            <img class="prato" src="${item.link}" alt="${
			item.name
		}" onerror="if (this.src != 'img/default.png') this.src = 'img/default.png';">
            <div class="description">
				<h4>${item.name}</h4>
                <p class="price">R$ ${item.price.toFixed(2)}</p>
                <div class="selector">
                    <button ${
											appearances == 0 ? "disabled" : ""
										} class="remove">-</button>
                    <span class="product-count">${appearances}</span>
                    <button class="add">+</button>
                </div>
			</div>
        `;
		menuList.appendChild(listItem);
	});
	configButtons();
};

// Inicializa com o menu de almoço
renderMenu("almoco");

// Trocar entre as abas
const tabs = document.querySelectorAll(".menu-tab");
tabs.forEach((tab) => {
	tab.addEventListener("click", (e) => {
		actualType = tab.id.toLowerCase();
		document.querySelector(".active").classList.remove("active");
		tab.classList.add("active");
		renderMenu(actualType);
	});
});

async function getData() {
	let res = await fetch("./comidas.json");
	let data = await res.json();
	return data;
}

function configButtons() {
	let removeButtons = document.querySelectorAll(".remove");

	removeButtons.forEach((removeButton) => {
		removeButton.addEventListener("click", (e) => {
			let description = e.target.parentNode.parentNode;
			let name = description.querySelector("h4").innerHTML;
			let item = data[actualType].find((item) => item.name === name);
			cart.splice(cart.indexOf(item), 1);

			let count = description.querySelector(".product-count");
			count.innerHTML = parseInt(count.innerHTML) - 1;

			if (count.innerHTML == 0) {
				description.querySelector(".remove").disabled = true;
			}

			updateFooter();
		});
	});

	let addButtons = document.querySelectorAll(".add");

	addButtons.forEach((addButton) => {
		addButton.addEventListener("click", (e) => {
			let description = e.target.parentNode.parentNode;
			let name = description.querySelector("h4").innerHTML;
			let item = data[actualType].find((item) => item.name === name);
			cart.push(item);

			let count = description.querySelector(".product-count");
			count.innerHTML = parseInt(count.innerHTML) + 1;

			description.querySelector(".remove").disabled = false;

			updateFooter();
		});
	});
}

function updateFooter() {
	document.querySelector("#itemCount").innerHTML = "Itens: " + cart.length;

	let totalCost = cart.reduce((a, b) => {
		return a + b.price;
	}, 0);
	document.querySelector("#totalCost").innerHTML =
		"Valor total: R$ " + totalCost.toFixed(2);
}

document.querySelector("#cartButton").addEventListener("click", function () {
	document.querySelector("#myPopup").classList.add("show");
	showCartInfo();
});

function showCartInfo() {
	let itens = {};
	for (let item of cart) {
		if (itens[item.name]) {
			itens[item.name].count += 1;
		} else {
			itens[item.name] = {};
			itens[item.name].count = 1;
			itens[item.name].price = item.price;
		}
	}
	let itemList = document.querySelector("#listaDeCompras");
	itemList.innerHTML = "";
	for (const [key, value] of Object.entries(itens)) {
		itemList.innerHTML += `<li>${key}</br>${
			value.count
		} x R$ ${value.price.toFixed(2)} = R$ ${(value.count * value.price).toFixed(
			2
		)}`;
	}

	let totalCost = cart.reduce((a, b) => {
		return a + b.price;
	}, 0);
	document.querySelector("#finalTotalCost").innerHTML =
		"Total: R$ " + totalCost.toFixed(2);
}

closePopup.addEventListener("click", function () {
	myPopup.classList.remove("show");
});
window.addEventListener("click", function (event) {
	if (event.target == myPopup) {
		myPopup.classList.remove("show");
	}
});
