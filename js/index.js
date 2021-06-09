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

//AJAX get
const URLJSON = "js/data.json"
$.getJSON(URLJSON, function (respuesta, estado) {
    if (estado === "success") {
        let misDatos = respuesta;
        console.log(misDatos);
        for (const burger of misDatos) {
            saveLocal(`Producto ${burger.id}`, JSON.stringify(burger))
            $("#menu-items").prepend(createMenuCard(burger));
            menu.push(new Burger(burger));
        }
    }
})

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
                createCartItem(item);
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

//espero a que se carguen las cards para agregarles los listeners a los botones
window.addEventListener('load', function() {
    addMenuListener();
    getCartFromLocal();
    $("#button-right").trigger('click');
})

//plantilla para la card del menu
function createMenuCard(burger) {
    let burgerCard = document.createElement("div");
    burgerCard.className = "card";
    if (burger.hasMeat) {
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

//FUNCION AGREGAR PRODUCTO
function addProduct(e) {
    console.log("HIce click");
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
        $("#cart").append(createCartItem(burger));
        cart.push(burger);
        alert("Se ha agregado un " + burger.name + " a tu orden.");
        addCartItemListener(burger); //le agrego los even listener al + / -


    } else { //si ya está, le SUMO
        cart.push(burger);
        $(`#${burger.id}number`).text((parseInt($(`#${burger.id}number`).text()) + 1).toString());
        alert("Se ha agregado un " + burger.name + " a tu orden.");
    }
    updateTotal();
    saveLocal("cart", JSON.stringify(cart));

}

//FUNCION AGREGAR EVENT LISTENER AL + / -
function addCartItemListener(burger) {

    //le agrego el event listener al botón de sumar
    $(`#sumar${burger.id}`).click(function (e) {
        let burger;
        //busco a que producto petenece
        for (const it of menu) {
            if (it.id == e.currentTarget.value) {
                burger = it;
            }
        }
        cart.push(burger);

        //cambio la cantidad
        $(`#${burger.id}number`).text((parseInt($(`#${burger.id}number`).text()) + 1).toString());
        updateTotal();
        console.log(cart);
        saveLocal("cart", JSON.stringify(cart));
    });

    //------le agrego el event listener al botón de restar-------
    $(`#restar${burger.id}`).click(function (e) {
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

        //cambio la cantidad (si es igual a 1, lo borro)
        //let number = document.getElementById(burger.id + "number");
        if ($(`#${burger.id}number`).text() == 1) {
            $(`#productoID${burger.id}`).remove();
        } else {
            $(`#${burger.id}number`).text((parseInt($(`#${burger.id}number`).text()) - 1).toString());
        }

        updateTotal();
        saveLocal("cart", JSON.stringify(cart));
    });

}

//CART ITEM TEMPLATE
function createCartItem(burger) {
    $(`#cart`).append(`<div id=productoID${burger.id} class="cartItem-container">
            <div class="cartItem">
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
        </div>`);
}

//cierro carrito
$("#close-cart").click(function () {
    $("#cart-container").animate({ right: '-30%' }, "slow", function (e) {
        $("#bg-shadow").fadeOut();
    });
});

//muestro carrito
$("#show-cart").click(function () {
    $("#cart-container").animate({ right: '0', }, "slow", function (e) {
        $("#bg-shadow").fadeIn("fast");
    });
});

//ver el total
function updateTotal() {
    let total = 0;
    for (let product of cart) {
        total += product.price;
    }
    $("#total").text(`$${total}`);
    //animación concatenada
    $(`#total`).animate({ fontSize: '30px' }, "fast", function () {
        $(`#total`).animate({ fontSize: '20px' }, "fast");
    });
}

//listener al boton para pagar
$("#checkout").click(function () {
    if (cart.length == 0) {
        alert("Aún no tienes productos en tu carrito");
    } else {
        $("#cart-container").animate({ right: '-30%' }, "slow");
        $("#form1").show();
        $("#bg-shadow").fadeOut();
        $("#checkout-container").fadeIn();
        $("#checkout-container").css("display", "flex");
    }

})

//cerrar checkout
$("#close-checkout").click(function () {
    $("#checkout-container").fadeOut();
    $("#form2").hide();
    $("#confirmation").hide();
});


//listener al boton del formulario de compra

$("#form1").submit(function (e) {
    e.preventDefault();
    
    let complete = true;

    $("#inputPhone").css("border","1px solid gray");
    $("#inputEmail").css("border","1px solid gray");
    $("#inputName").css("border","1px solid gray");

    if($("#inputEmail").val() === "") {
        $("#inputEmail").css("border","1px solid rgb(255, 77, 77)");
        complete = false;
    }

    if($("#inputPhone").val() === "") {
        $("#inputPhone").css("border","1px solid rgb(255, 77, 77)");
        complete = false;
    }

    if($("#inputName").val() === "") {
        $("#inputName").css("border","1px solid rgb(255, 77, 77)");
        complete = false;
    }

    if(complete){
        $("#form1").hide();
        $("#form2").css("display", "flex");
        $("#loader").css("display", "flex");
        $("#loader").delay(3000).hide(function () {
            $("#confirmation").fadeIn();
          });
    } else {
        alert("Debes llenar todos los campos")
    }

});


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
let dropdownButtons = $(".dropdown-item")
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

//filtro veggie

$("#veggieCheck").change(showVeggie);

function showVeggie() {

    var checkBox = document.getElementById("veggieCheck");

    for (const it of $(".has-meat")) {

        console.log(it);
        if (checkBox.checked == true) {
            $(".has-meat").hide();
        } else {
            $(".has-meat").show();
        }
    }

}

//cambio la hamburguesa de la portada cada 4 segundos
setInterval(function(){ 
    $("#button-right").trigger('click');
}, 4000);



//ANIMACION PORTADA
let currentImgRoute = 1;
let currentBurger;
$("#button-right").click(function () {
    if (currentImgRoute == menu.length - 1) {
        currentImgRoute = 0;
    } else {
        currentImgRoute += 1;
    }

    currentBurger = menu[currentImgRoute];
    refreshCover(currentBurger);
})

$("#button-left").click(function () {
    if (currentImgRoute == 0) {
        currentImgRoute = menu.length - 1;
    } else {
        currentImgRoute -= 1;
    }
    currentBurger = menu[currentImgRoute];
    refreshCover(currentBurger);
})

function refreshCover(currentBurger) {
    $("#cover-price").text("$" + currentBurger.price);
    $("#burgerPortada").attr("src", `${currentBurger.imgRoute}`);
    $("#burger-description").text(currentBurger.info);
    $("#portada-name").text(currentBurger.name);
}





