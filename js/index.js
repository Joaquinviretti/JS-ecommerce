const MENU = [
    '{"id" : 1, "name" : "BigMc", "price" : 450}',
    '{"id" : 2, "name" : "Cuarto de Libra", "price" : 340}',
    '{"id" : 3, "name" : "McPollo", "price" : 500}',
    '{"id" : 4, "name" : "Triple Mc", "price" : 380}',
    '{"id" : 5, "name" : "CBO", "price" : 450}'
]

class Burger {

    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.price = parseFloat(obj.price);
        this.size = "pequeño";
        this.extra = [];
    }

    biggerSize() {
        this.size = "grande";
    }

    addExtras() {
        let input;
        let nextExtra;
        do {
            input = prompt("Ingrese nombre del acompañamiento: ");
            this.extra.push(input);
            nextExtra = prompt("Desea añadir otro acompañamiento? si/no: ");
        } while (nextExtra === "si");
    }

    showItem() {
        if (this.extra.length > 0) {
            return this.name + " " + this.size + " con " + this.extra.join(",");
        } else {
            return this.name + " " + this.size + " sin acopañamientos";
        }
    }
}

const saveLocal = (key, value) => { localStorage.setItem(key, value)};

//declaro variables globales
let cart = [];
let menu = [];
let orderPosition = 0;

//convierto el menu JSON a objetos
for (const burger of MENU) {
    let burgerString = JSON.parse(burger);
    let burgerObject = new Burger(burgerString);
    menu.push(burgerObject);
    saveLocal(`Producto ${burgerObject.id}`,JSON.stringify(burgerObject));
    console.log(burgerObject);
}

//LLAMO A INIT => INCIALIZA EL PROGRAMA
init();

function init() {
    //recupero items del localStorage
    getCartFromLocal();
    //muestro menu
    showMenu();
}

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

    userInput = parseInt(prompt("Ingrese el número que corresponda: \n 1 - AGREGAR HAMBURGUESA \n 2 - VACIAR CARRITO \n"));
  
    switch (userInput) {
        case 1:
            addProduct();
            break;
        case 2:
            clearCart();
            break;;
    }

    updateTotal();    




