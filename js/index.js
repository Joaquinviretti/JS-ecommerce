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

const PREFIX = "productoID";

const saveLocal = (key, value) => { localStorage.setItem(key, value) };

//declaro variables globales
let cart = [];
let menu = [];
let orderPosition = 0;

//obtengo el elemento donde irán las cards con el producto
let burgerSection = document.getElementById("menu-items");

//Me fijo si quedaron items en el local Storage y se los paso al carrito.
/*function getCartFromLocal() {

    if (localStorage.getItem("cart")) {
        const almacenados = JSON.parse(localStorage.getItem("cart"));
        for (const item of almacenados) {
            cart.push(new Burger(item));
            let cartDiv = document.getElementById("cart");
            cartDiv.appendChild(createCartItem(item));
        }
    }
}

getCartFromLocal();*/

//Recorro el menu en data.js y creo una card por cada item dentro de el
for (const burger of MENU) {
    let burgerObject = new Burger(burger);
    menu.push(burgerObject);
    saveLocal(`Producto ${burgerObject.id}`, JSON.stringify(burgerObject));
    burgerSection.appendChild(createMenuCard(burgerObject));
    updateTotal();
}


//plantilla para la card del menu
function createMenuCard(burger) {
    let burgerCard = document.createElement("div");
    burgerCard.className = "card";
    burgerCard.innerHTML = `<div class='card-body'> <div class='food-image' style="background-image: url('${burger.imgRoute}')"></div> <h5 class='card-title'>${burger.name}</h5> <p class='card-text'>${burger.info}</p> <div class='item-info'> <div class='price-box'> <p id='item-price'>$${burger.price}</p> </div> <button type="button" class="addToCartButton" value="${burger.id}">Agregar al carrito</button> </div> </div>`;
    return burgerCard;
}


//le agrego un event listener a cada botón de las cards
let addToCartButton = document.getElementsByClassName("addToCartButton");
for (var i = 0; i < addToCartButton.length; i++) {
    addToCartButton[i].addEventListener("click", addProduct);
}


//función addProduct
function addProduct(e) {
    let cartDiv = document.getElementById("cart");

    //me fijo con que id coincide el value del botón
    let burger;
    console.log(e.target.value);
    for (const it of menu) {
        if (it.id == e.target.value) {
            burger = it;
        }
    }

    //me fijo si ya está en el carrito
    let alreadyInCart = false;
    cart.forEach(it => {
        if (burger.id == it.id) {
            alreadyInCart = true;
        }
    });

    //si no está, lo agrego
    if (!alreadyInCart) {
        cartDiv.appendChild(createCartItem(burger));
        cart.push(burger);
        alert("Se ha agregado un " + burger.name + " a tu orden.");

        //le agrego el event listener al botón de sumar
        let plusIcon = document.getElementById("sumar" + burger.id);
        plusIcon.addEventListener("click", function sumarProducto() {
            let burger;
            //busco a que producto petenece
            for (const it of menu) {
                if (it.id == e.target.value) {
                    burger = it;
                }
            }
            cart.push(burger);

            //cambio la cantidad
            let number = document.getElementById(burger.id + "number");
            number.innerHTML = ((parseInt(number.innerHTML)) + 1).toString();
            updateTotal();
            console.log(cart);
        });

        //le agrego el event listener al botón de restar
        let minusIcon = document.getElementById("restar" + burger.id);
        minusIcon.addEventListener("click", function restarProducto() {
            let burger;
            //busco a que producto petenece
            for (const it of menu) {
                if (it.id == e.target.value) {
                    burger = it;
                }
            }

            // obtengo index
            var removeIndex = cart.map(function (burger) { return burger.id; }).indexOf(e.target.value);

            // borro el objeto
            cart.splice(removeIndex, 1);

            //cambio la cantidad (si es igual a 1, lo borro)
            let number = document.getElementById(burger.id + "number");
            if (number.innerHTML == 1) {
                console.log(burger.id);
                let cardToDelete = document.getElementById("productoID" + burger.id);
                cardToDelete.parentElement.removeChild(cardToDelete);
            } else {
                number.innerHTML = ((parseInt(number.innerHTML)) - 1).toString();
            }

            updateTotal();
            /*saveLocal("cart", JSON.stringify(cart));*/
            console.log(cart);
        });

    } else { //si ya está, le resto
        cart.push(burger);
        let number = document.getElementById(burger.id + "number");
        number.innerHTML = ((parseInt(number.innerHTML)) + 1).toString();
    }
    updateTotal();
    /*saveLocal("cart", JSON.stringify(cart));*/

}

//CART ITEM TEMPLATE
function createCartItem(burger) {
    let cartDiv = document.createElement("div");
    cartDiv.id = `productoID${burger.id}`;
    cartDiv.className = "cartItem-container";
    cartDiv.innerHTML =
        `<div class="cartItem">
      <div class="cartItem-right">
        <div class="controls">
            <button id="restar${burger.id}" value="${burger.id}"><i class="fas fa-minus fa-xs"></i></button>
            <button id="sumar${burger.id}" value="${burger.id}"><i class="fas fa-plus fa-xs"></i></button>
        </div>
            <p id="${burger.id}number">1</p>
            <p>${burger.name}</p>
      </div>
      <div class="cartItem-left">
            <p>$${burger.price}</p>
      </div>
    </div>`;
    return cartDiv;
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

//ver el total
function updateTotal() {
    let total = 0;
    for (let product of cart) {
        total += product.price;
    }
    let outputTotal = document.getElementById("total");
    outputTotal.innerText = "$" + total;
}





