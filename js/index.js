class Burger {

    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.price = parseFloat(obj.price);
        this.size = "pequeño";
        this.hasMeat = obj.hasMeat;
        this.extra = [];
        this.info = obj.info;
        this.imgRoute = obj.imgRoute;
    }
}

const PREFIX = "productoID";

//funcion para guardar el localStorage
const saveLocal = (key, value) => { localStorage.setItem(key, value) };

//declaro variables globales
let cart = [];
let menu = [];

//obtengo el elemento donde irán las cards con el producto
let burgerSection = document.getElementById("menu-items");

//Me fijo si quedaron items en el local Storage y se los paso al carrito.
function getCartFromLocal() {

    if (localStorage.getItem("cart")) {
        const almacenados = JSON.parse(localStorage.getItem("cart"));
        for (const item of almacenados) {
            let localBurger = new Burger(item);

            //me fijo si ya está en el carrito
            let alreadyInCart = false;
            for (const item of cart) {
                if (item.id == localBurger.id) {
                    alreadyInCart = true;
                }
            }
            //si no esta, lo agrego
            if (!alreadyInCart) {
                let cartDiv = document.getElementById("cart");
                cartDiv.appendChild(createCartItem(item));
                addCartItemListener(new Burger(item));
                //si ya esta, le sumo
            } else {
                let number = document.getElementById(localBurger.id + "number");
                number.innerHTML = ((parseInt(number.innerHTML)) + 1).toString();
                updateTotal();
            }

            cart.push(localBurger);
        }
    }
}

getCartFromLocal();

//Recorro el menu en data.js y creo una card por cada item dentro de el
for (const burger of MENU) {
    let burgerObject = new Burger(burger);
    menu.push(burgerObject);
}

menu.sort(compareAZ);

function compareAZ(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}


for (const burger of menu) {
    saveLocal(`Producto ${burger.id}`, JSON.stringify(burger));
    burgerSection.appendChild(createMenuCard(burger));
}



//plantilla para la card del menu
function createMenuCard(burger) {
    let burgerCard = document.createElement("div");
    burgerCard.className = "card";
    if(burger.hasMeat){
        burgerCard.classList.add("has-meat");
    }
    burgerCard.innerHTML =
        `<div class='card-body'> 
    <div class='food-image' style="background-image: url('${burger.imgRoute}')"></div> <h5 class='card-title'>${burger.name}</h5> <p class='card-text'>${burger.info}</p> <div class='item-info'> <div class='price-box'> <p id='item-price'>$${burger.price}</p> </div> <button type="button" class="addToCartButton" value="${burger.id}">Agregar al carrito</button> </div> </div>`;
    return burgerCard;
}


//le agrego un event listener a cada botón de las cards
function addMenuListener() {
    let addToCartButton = document.getElementsByClassName("addToCartButton");
    for (var i = 0; i < addToCartButton.length; i++) {
        addToCartButton[i].addEventListener("click", addProduct);
    }

}

addMenuListener();

//FUNCION AGREGAR PRODUCTO
function addProduct(e) {
    let cartDiv = document.getElementById("cart");

    //me fijo con que id coincide el value del botón
    let burger;
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
        addCartItemListener(burger); //le agrego los even listener al + / -


    } else { //si ya está, le resto
        cart.push(burger);
        let number = document.getElementById(burger.id + "number");
        number.innerHTML = ((parseInt(number.innerHTML)) + 1).toString();
    }
    updateTotal();
    saveLocal("cart", JSON.stringify(cart));

}

//FUNCION AGREGAR EVENT LISTENER AL + / -
function addCartItemListener(burger) {

    //le agrego el event listener al botón de sumar
    let plusIcon = document.getElementById("sumar" + burger.id);
    plusIcon.addEventListener("click", function sumarProducto(e) {
        let burger;
        //busco a que producto petenece
        for (const it of menu) {
            if (it.id == e.currentTarget.value) {
                burger = it;
            }
        }
        cart.push(burger);

        //cambio la cantidad
        let number = document.getElementById(burger.id + "number");
        number.innerHTML = ((parseInt(number.innerHTML)) + 1).toString();
        updateTotal();
        console.log("sumado un" + burger.name);
        console.log(cart);
        saveLocal("cart", JSON.stringify(cart));
    });

    //------le agrego el event listener al botón de restar-------
    let minusIcon = document.getElementById("restar" + burger.id);
    minusIcon.addEventListener("click", function restarProducto(e) {
        let burger;
        //busco a que producto petenece
        for (const it of menu) {
            if (it.id == e.currentTarget.value) {
                burger = it;
            }
        }

        //busco el primero que coincida y lo borro
        let deleted = false;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id == burger.id && !deleted) {
                console.log("borrado un" + burger.name);
                cart.splice(i, 1);
                saveLocal("cart", JSON.stringify(cart));
                deleted = true;
                break;
            }
        }

        console.log(cart);

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
        saveLocal("cart", JSON.stringify(cart));
    });

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
            <strong><p id="${burger.id}number">1</p></strong>
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

let checkoutDiv = document.getElementById("checkout-container");

let checkoutButton = document.getElementById("checkout");
checkoutButton.addEventListener("click", function checkout() {

    if (cart.length == 0) {
        alert("Aún no tienes productos en tu carrito");
    } else {
        let cartDiv = document.getElementById("cart-container");
        cartDiv.style.display = "none";
        checkoutDiv.style.display = "flex";
    }

})

let closeCheckOut = document.getElementById("close-checkout");
closeCheckOut.addEventListener("click", function closeCheckOut() {

    checkoutDiv.style.display = "none";

})

let submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", function submit(e) {
    e.preventDefault();
    let form = document.getElementById("form");
    form.style.display = "none";

})

function compareAZ(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

function compare01(a, b) {
    if (a.price < b.price) {
        return -1;
    }
    if (a.price > b.price) {
        return 1;
    }
    return 0;
}

function compare10(a, b) {
    if (a.price < b.price) {
        return 1;
    }
    if (a.price > b.price) {
        return -1;
    }
    return 0;
}


//función ordenar menú
let dropdownButtons = document.getElementsByClassName("dropdown-item");
for (let i = 0; i < dropdownButtons.length; i++) {
    const button = dropdownButtons[i];
    button.addEventListener("click", function ordenar(e) {

        switch (e.target.value) {
            case "az":
                console.log("orden az");
                burgerSection.innerHTML = "";
                menu.sort(compareAZ);
                break;
            case "01":
                burgerSection.innerHTML = "";
                menu.sort(compare01);
                break;
            case "10":
                burgerSection.innerHTML = "";
                menu.sort(compare10);
                break;

        }

        for (const burger of menu) {
            saveLocal(`Producto ${burger.id}`, JSON.stringify(burger));
            burgerSection.appendChild(createMenuCard(burger));
        }

        addMenuListener();

    })

}

let checkBox = document.getElementById("veggieCheck");
checkBox.addEventListener("change",showVeggie);

function showVeggie(e) {
    // Get the checkbox
    // Get the output text
    let itemCard = document.getElementsByClassName("has-meat");
    console.log(itemCard);
    console.log("entramos");

    var checkBox = document.getElementById("veggieCheck");

    for (const it of itemCard) {

        console.log(it);
        if (checkBox.checked == true){
            it.style.display = "none";
          } else {
            it.style.display = "flex";
          }
    }

  }







