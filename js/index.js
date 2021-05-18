class Burger {

    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.price = parseFloat(obj.price);
        this.size = "pequeño";
        this.extra = [];
        this.info = obj.info;
        this.imgRoute = obj.imgRoute;
    }

    biggerSize() {
        this.size = "grande";
    }
}

const saveLocal = (key, value) => { localStorage.setItem(key, value) };

//declaro variables globales
let cart = [];
let menu = [];
let orderPosition = 0;

getCartFromLocal();

//convierto el menu JSON a objetos
//obtengo el elemento donde irán las cards con el producto
let burgerSection = document.getElementById("menu-items");

//Recorro el menu en data.js y creo una card por cada item dentro de el
for (const burger of MENU) {
    let burgerObject = new Burger(burger);
    menu.push(burgerObject);
    saveLocal(`Producto ${burgerObject.id}`, JSON.stringify(burgerObject));
    let burgerCard = document.createElement("div");
    burgerCard.className = "card";
    burgerCard.innerHTML = `<div class='card-body'> <div class='food-image' style="background-image: url('${burgerObject.imgRoute}')"></div> <h5 class='card-title'>${burgerObject.name}</h5> <p class='card-text'>${burgerObject.info}</p> <div class='item-info'> <div class='price-box'> <p id='item-price'>$${burgerObject.price}</p> </div> <button type="button" class="addToCartButton" value="${burgerObject.id}">Agregar al carrito</button> </div> </div>`;
    burgerSection.appendChild(burgerCard);
    updateTotal()
}

//le agrego un event listener a cada botón de las cards
let addToCartButton = document.getElementsByClassName("addToCartButton");
console.log(addToCartButton);

for (var i = 0; i < addToCartButton.length; i++) {
    addToCartButton[i].addEventListener("click", function addProduct(e) {
        console.log("click en boton" + e.target.value);
        let cartDiv = document.getElementById("cart");
        let cartItem = document.createElement("div");
        cartItem.className = "cartItem-container";

        //me fijo con que id coincide el value del botón
        let burger;
        for (const it of menu) {
            if (it.id == e.target.value) {
                burger = it;
            }
        }
        cart.push(burger);
        saveLocal("cart", JSON.stringify(cart));
        cartItem.innerHTML = `<div class="cartItem-container"> <div class="cartItem"> <p>${burger.name}</p> <p>${burger.price}</p> </div> </div>`;
        cartDiv.appendChild(cartItem);
    });
}

//cierro carrito
let closeCartButton = document.getElementById("close-cart");

closeCartButton.addEventListener("click", function closeCart() {
    let cartDiv = document.getElementById("cart-container");
    cartDiv.style.display = "none";
});

//abro carrito
let showCartButton = document.getElementById("show-cart");

showCartButton.addEventListener("click", function showCart() {
    let cartDiv = document.getElementById("cart-container");
    cartDiv.style.display = "flex";
})

//Me fijo si quedaron items en el local Storage y se los paso al carrito.
function getCartFromLocal() {

    if (localStorage.getItem("cart")) {

        const almacenados = JSON.parse(localStorage.getItem("cart"));
        console.log(almacenados);

        for (const item of almacenados) {
            cart.push(item);
            let cartDiv = document.getElementById("cart");
            let cartItem = document.createElement("div");
            cartItem.className = "cartItem-container";
            cartItem.innerHTML = `<div class="cartItem-container"> <div class="cartItem"> <p>${item.name}</p> <p>${item.price}</p> </div> </div>`;
            cartDiv.appendChild(cartItem);
        }
    }

}

//ver el total
function updateTotal() {
    let total = 0;
    for (let product of cart) {
        total += product.price;
    }

    let outputTotal = document.getElementById("total");
    outputTotal.innerText = "$" + total;
}





