const cantidadCarrito = document.getElementById ("cantidadCarrito")
const shopContent = document.getElementById("shopContent"); //capturo el div que funcionara como padre para los productos del array
const verCarrito = document.getElementById("verCarrito"); // capturo la imagen del carrito para agregarle un evento
const modalContainer = document.getElementById("modalContainer"); // capturo el div que funcionara como padre de la vista previa del carrito

// Array - carrito

let carrito = JSON.parse (localStorage.getItem ("carrito")) || [];

// promesas y asicronias, traer objetos desde un JSON

// funcion asincrona para traer los productos desde el JSON

const getProducts = async() => {
    const response = await fetch ("data.json");
    const data = await response.json ();
    
    data.forEach((product) => {
        let content = document.createElement("div");
        content.className = "card";
        content.innerHTML = `
        <img src="${product.img}">
        <h2>${product.nombre}</h2>
        <p class="price">${product.precio} $</p>
        `;
        shopContent.append(content);
    
        // creo el boton para comprar
    
        let comprar = document.createElement("button")
        comprar.innerText = `comprar`;
        comprar.className = "comprar";
        content.append(comprar);
    
        // agrego funcionalidad al boton, para que cuando se clickee en el mande los productos elegidos al carrito.
    
        comprar.addEventListener("click", () => {
            swal("Excelente!", "su producto fue agregado al carrito!", "success");
    
            // suma de cantidades 
    
            const repeat = carrito.some ((repeatProduct) => repeatProduct.id === product.id);
            
            if (repeat) {
                carrito.map ((prod) => {
                    if (prod.id === product.id) {
                        prod.cantidad++;
                    }
                });
            } else {
                carrito.push({
                    id: product.id,
                    img: product.img,
                    nombre: product.nombre,
                    precio: product.precio,
                    cantidad: product.cantidad,
                });
            }
            console.log(carrito);
            carritoCounter ();
            saveLocal ();
        });
    });
    
};

getProducts ();

//recorro el array con los productos para agregarlos en el html


// Cada vez que se clickee la imagen del carrito nos va a mostrar una vista previa de los que queremos compar

const pintarCarrito = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "flex";

    // header

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header"
    modalHeader.innerHTML = `
    <h2 class = "modal-header-tittle">Carrito</h2>
    ` ;
    modalContainer.append(modalHeader);

    //boton cerrar

    const modalbutton = document.createElement("h3");
    modalbutton.innerText = "x";
    modalbutton.className = "modal-header-button";

    modalbutton.addEventListener ("click", () => {
        modalContainer.style.display = "none"
    });

    modalHeader.append(modalbutton);

    // main

    carrito.forEach((product) => {
        let carritoContent = document.createElement("div");
        carritoContent.className = "modal-content"
        carritoContent.innerHTML = `
            <img src="${product.img}">
            <h3>${product.nombre}</h3>
            <p>${product.precio} $</p>
            <span class="restar"> - </span>
            <p>Cantidad: ${product.cantidad}</p>
            <span class="sumar"> + </span>
            <p>Total: ${product.cantidad * product.precio} $</p>
            <span class="delete-product">✖️</span>

        `;

        modalContainer.append (carritoContent);

        // boton sumar, restar

        let restar = carritoContent.querySelector (".restar")
        restar.addEventListener ("click", () =>{
            if (product.cantidad !== 1) {
                product.cantidad--;
            }
            saveLocal ();
            pintarCarrito ();
        })

        let sumar = carritoContent.querySelector (".sumar")
        sumar.addEventListener ("click", () => {
            product.cantidad++;
            saveLocal ();
            pintarCarrito ();
        })



        //boton eliminar
        let eliminar = carritoContent.querySelector (".delete-product");

        eliminar.addEventListener ("click", () => {
            eliminarProducto (product.id);
        });
    });

    const total = carrito.reduce ((acc, el) =>  acc + el.precio * el.cantidad, 0);

    //footer

    const totalBuying = document.createElement ("div");
    totalBuying.className = "total-content";
    totalBuying.innerHTML =  `total a pagar: ${total} $`;
    modalContainer.append (totalBuying);
}

verCarrito.addEventListener ("click", pintarCarrito);

// eliminar productos del carrito

const eliminarProducto = (id) => {
    const foundId = carrito.find ((element) => element.id === id);

    carrito = carrito.filter ((carritoId) => {
        return carritoId !== foundId;
    });
    carritoCounter (); 
    saveLocal ();
    pintarCarrito ();
};

// contador del carrito 

const carritoCounter = () => {
    cantidadCarrito.style.display = "block";

    const carritoLength = carrito.length;

    localStorage.setItem ("carritoLength", JSON.stringify (carritoLength))

    cantidadCarrito.innerText = JSON.parse (localStorage.getItem ("carritoLength"))
};

carritoCounter ();

// localStorage

const saveLocal = () => {
    localStorage.setItem ("carrito", JSON.stringify (carrito));
}




