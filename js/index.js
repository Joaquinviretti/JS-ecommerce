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

let burgerSection = document.getElementById("menu-items");

for (const burger of MENU) {
    let burgerObject = new Burger(burger);
    menu.push(burgerObject);
    saveLocal(`Producto ${burgerObject.id}`,JSON.stringify(burgerObject));
    console.log(burgerObject);
    let burgerCard = document.createElement("div");
    burgerCard.className = "card";
    burgerCard.innerHTML = `<div class='card-body'> <div class='food-image' style="background-image: url('${burgerObject.imgRoute}')"></div> <h5 class='card-title'>${burgerObject.name}</h5> <p class='card-text'>${burgerObject.info}</p> <div class='item-info'> <div class='price-box'> <p id='item-price'>$${burgerObject.price}</p> </div> <a href=''>Agregar al carrito</a> </div> </div>`;
    burgerSection.appendChild(burgerCard);
}

//cargo el menu


//Agregar producto
function addProduct() {

    userInput = parseInt(prompt("Ingrese número correspondiente a su hamburguesa: \n 1- BigMc 2- Cuarto de Libra 3- McPollo 4- Triple Mc 5- CBO "));

    for (const product of menu) {
        if(product.id == userInput){

            let userInput = parseInt(prompt("Ingrese 1 para agrandar el combo:"));
            if(userInput == 1){
                product.biggerSize();
            }

            userInput = parseInt(prompt("Ingrese 1 si quiere agregar extras:"));
            if(userInput == 1){
                product.addExtras();
            }

            cart.push(product);
            addToOrder(product);
            console.log(`se agrego ${product.name}`);
        }
    }

    saveLocal("carrito",JSON.stringify(cart));

}

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
 




