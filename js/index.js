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

const saveLocal = (key, value) => { localStorage.setItem(key, value)};

//declaro variables globales
let cart = [];
let menu = [];
let orderPosition = 0;

//convierto el menu JSON a objetos
//obtengo el elemento donde irán las cards con el producto
let burgerSection = document.getElementById("menu-items");

//Recorro el menu en data.js y creo una card por cada item dentro de el
for (const burger of MENU) {

    let burgerObject = new Burger(burger);
    menu.push(burgerObject);
    saveLocal(`Producto ${burgerObject.id}`,JSON.stringify(burgerObject));
    console.log(burgerObject);
    let burgerCard = document.createElement("div");
    burgerCard.className = "card";


    burgerCard.innerHTML = `<div class='card-body'> <div class='food-image' style="background-image: url('${burgerObject.imgRoute}')"></div> <h5 class='card-title'>${burgerObject.name}</h5> <p class='card-text'>${burgerObject.info}</p> <div class='item-info'> <div class='price-box'> <p id='item-price'>$${burgerObject.price}</p> </div> <button type="button" class="addToCartButton" value="${burgerObject.id}">Agregar al carrito</button> </div> </div>`;

    burgerSection.appendChild(burgerCard);
}

//le agrego un event listener a cada botón de las cards
let addToCartButton = document.getElementsByClassName("addToCartButton");
console.log(addToCartButton);

for (var i = 0 ; i < addToCartButton.length; i++) {
    addToCartButton[i].addEventListener("click",function addProduct(e){
        console.log("click en boton" + e.target.value);
    }) ; 
 }

//cierro carrito
let closeCartButton = document.getElementById("close-cart");

closeCartButton.addEventListener("click",function closeCart(){
    let cartDiv = document.getElementById("cart");
    cartDiv.style.display = "none";
});

//abro carrito
let showCartButton = document.getElementById("show-cart");

showCartButton.addEventListener("click", function showCart(){
    let cartDiv = document.getElementById("cart");
    cartDiv.style.display = "flex";
})



//Me fijo si quedaron items en el local Storage y se los paso al carrito.
function getCartFromLocal(){

    if(localStorage.getItem("carrito")){
        const almacenados = JSON.parse(localStorage.getItem("carrito"));
    console.log(almacenados);

    for (const item of almacenados) {
        let burgerObject = new Burger(item);
        addToOrder(item);
        cart.push(burgerObject);
    }
    }

}

//Mostrar menu
function showMenu() {

    let divMenu = document.getElementById("menu");

    for (let it of menu) {
        let text = document.createElement("h3");
        text.innerHTML = `***${it.name}`;
        divMenu.appendChild(text);

    }
}

//agregar a la orden
function addToOrder(product) { 

    let divCart = document.getElementById("cart");

        let text = document.createElement("h4");
        text.id = "cartItem";
        text.innerHTML = `${product.price} ${orderToString(product)}`;
        divCart.appendChild(text);
    
}

//orden a String
function orderToString(product){

    if(product.extra.length > 0) {
        extraText = `con ${product.extra.join(", ")}`;
    } else {
        extraText = "sin agregados"
    }

    return `${product.name} ${product.size} ${extraText}.`;

}

//Quitar producto
function removeProduct() {
}

//vaciar carrito
function clearCart() {

    cart = [];
    localStorage.setItem("carrito",[]);
    let cartDiv = document.getElementById("cart");
    cartDiv.innerHTML = "";
}

//ver el total
function updateTotal() {
    let total = 0;
    for (let product of cart) {
        total += product.price;
    }
  
    let outputTotal = document.getElementById("total");
    outputTotal.innerHTML = total;
}
 




