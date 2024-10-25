  // Variables globales para contar los productos en el carrito y el total del carrito
let cartItemCount = 0;  // Contador de productos en el carrito
let totalAmount = 0;    // Total acumulado del carrito

// Función para agregar un producto al carrito
function addToCart(name, price, image) {
    // Aumentamos el contador de productos en el carrito
    cartItemCount++;
    const itemId = `cart-item-${cartItemCount}`;  // Asignamos un ID único a cada producto en el carrito
            
    // Crear un nuevo elemento 'div' para representar el producto en el carrito
    const cartItem = document.createElement('div');
    cartItem.classList.add('row', 'cart-item', 'align-items-center');  // Le asignamos clases para el diseño
    cartItem.id = itemId;  // Asignamos el ID único al producto

    // Definimos el contenido HTML del producto que se mostrará en el carrito
    cartItem.innerHTML = `
        <div class="col-md-2 bloqImagen">
            <img src="${image}" alt="Imagen del Producto" class="img-fluid imgCarrito">  <!-- Imagen del producto -->
        </div>

        <div class="col-md-4 nomProduc">
            <h5 class = "carritoNomProduc">${name}</h5>  <!-- Nombre del producto -->
        </div>
        
        <div class="col-md-3 contadorProduc">
            <div class="input-group">
                <!-- Botón para reducir la cantidad del producto -->
                <button class="btn btn-outline-secondary" type="button" onclick="decrementQuantity(this)">-</button>
                <!-- Input que muestra la cantidad del producto -->
                <input type="number" class="form-control cart-quantity-input" value="1" min="1" onchange="updateTotal(${price}, this)">
                <!-- Botón para aumentar la cantidad del producto -->
                <button class="btn btn-outline-secondary" type="button" onclick="incrementQuantity(this)">+</button>
            </div>
        </div>
                    
        <div class="col-md-2 text-end cart-item-subtotal">
            <!-- Subtotal del producto que se actualiza según la cantidad -->
            $<span class="item-price" data-unit-price="${price}">${price.toLocaleString()}</span>
        </div>
                    
        <div class="col-md-1 text-end elimProduc">
            <!-- Botón para eliminar el producto del carrito -->
            <button class="btn btn-delete" onclick="removeItem('${itemId}', ${price})">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zM7.5 1a1 1 0 0 1 1 1v1h2.5a.5.5 0 0 1 0 1h-8a.5.5 0 0 1 0-1H6.5V2a1 1 0 0 1 1-1zM5 4v10.5A1.5 1.5 0 0 0 6.5 16h3a1.5 1.5 0 0 0 1.5-1.5V4h-6z"/>
                </svg>
            </button>
        </div>
    `;

    // Agregar el nuevo producto al contenedor del carrito
    const cartContainer = document.getElementById('cart-items-container');
    cartContainer.appendChild(cartItem);
            
    // Actualizar el total del carrito sumando el precio del producto añadido
    totalAmount += price;
    updateCartTotal();  // Llamamos a la función que actualiza el total visible del carrito
}

// Función para aumentar la cantidad de un producto
function incrementQuantity(button) {
    let input = button.parentElement.querySelector('.cart-quantity-input');  // Encuentra el input de cantidad
    input.value = parseInt(input.value) + 1;  // Incrementa el valor de la cantidad
    updateTotal(parseFloat(button.closest('.cart-item').querySelector('.item-price').getAttribute('data-unit-price')), input);
    // Actualiza el total del carrito basado en la nueva cantidad
}

// Función para disminuir la cantidad de un producto
function decrementQuantity(button) {
    let input = button.parentElement.querySelector('.cart-quantity-input');  // Encuentra el input de cantidad
    if (input.value > 1) {  // Asegurarse de que la cantidad no sea menor que 1
        input.value = parseInt(input.value) - 1;  // Decrementa el valor de la cantidad
        updateTotal(parseFloat(button.closest('.cart-item').querySelector('.item-price').getAttribute('data-unit-price')), input);
        // Actualiza el total del carrito basado en la nueva cantidad
    }
}

// Función para eliminar un producto del carrito
function removeItem(itemId, price) {
    // Encuentra el producto en el carrito por su ID y lo elimina
    const item = document.getElementById(itemId);
    if (item) {
        item.remove();  // Elimina el elemento del carrito
    }
            
    // Recalcula el total del carrito después de eliminar un producto
    recalculateTotal();
}

// Función para actualizar el total del carrito en la pantalla
function updateCartTotal() {
    const totalElement = document.getElementById('cart-total-amount');  // Encuentra el elemento donde se muestra el total
    totalElement.textContent = totalAmount.toLocaleString();  // Actualiza el contenido del total con formato
}

// Función que se ejecuta cuando cambia la cantidad de un producto
function updateTotal(price, inputElement) {
    const quantity = parseInt(inputElement.value);  // Convierte el valor de cantidad a un número entero
    const itemElement = inputElement.closest('.cart-item');  // Encuentra el contenedor del producto
    const unitPrice = parseFloat(itemElement.querySelector('.item-price').getAttribute('data-unit-price'));  // Obtiene el precio unitario original

    // Calcula el subtotal para el producto basado en la cantidad
    const subtotalElement = itemElement.querySelector('.item-price');
    subtotalElement.textContent = (unitPrice * quantity).toLocaleString();  // Actualiza el subtotal con formato
            
    // Recalcula el total del carrito
    recalculateTotal();
}

// Función para recalcular el total del carrito después de cambios
function recalculateTotal() {
    const items = document.querySelectorAll('.cart-item');  // Obtiene todos los productos en el carrito
    totalAmount = 0;  // Reinicia el total a 0
            
    // Recorre cada producto y suma el precio multiplicado por la cantidad
    items.forEach(item => {
        const unitPrice = parseFloat(item.querySelector('.item-price').getAttribute('data-unit-price'));  // Obtiene el precio unitario
        const quantity = parseInt(item.querySelector('.cart-quantity-input').value);  // Obtiene la cantidad
        totalAmount += unitPrice * quantity;  // Suma al total
    });
            
    updateCartTotal();  // Actualiza el total en la pantalla
}






// Función para enviar los productos del carrito a WhatsApp
function sendOrderToWhatsApp() {
    // Obtener los productos en el carrito
    const items = document.querySelectorAll('.cart-item');
    let message = 'Hola, quisiera hacer un pedido con los siguientes productos:%0A';  // Mensaje inicial para WhatsApp
    
    // Iterar sobre los productos en el carrito para extraer nombre, precio y cantidad
    items.forEach(item => {
        const name = item.querySelector('h5').textContent;  // Nombre del producto
        const price = parseFloat(item.querySelector('.item-price').getAttribute('data-unit-price'));  // Precio unitario del producto
        const quantity = parseInt(item.querySelector('.cart-quantity-input').value);  // Cantidad

        // Agregar los detalles de cada producto al mensaje
        message += `- ${name}: ${quantity} x $${price.toLocaleString()} = $${(price * quantity).toLocaleString()}%0A`;
    });

    // Añadir el total del carrito al mensaje
    message += `%0ATotal: $${totalAmount.toLocaleString()}`;

    // Número de teléfono de WhatsApp (con código de país)
    const phoneNumber = '549123456789';  // Reemplaza esto con tu número de WhatsApp
    
    // Crear el enlace de WhatsApp con el mensaje
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;

    // Redirigir al usuario a WhatsApp
    window.location.href = whatsappLink;
}

// Asignar la función `sendOrderToWhatsApp` al botón "Iniciar Compra"
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('iniciar-compra').addEventListener('click', sendOrderToWhatsApp);
});




document.addEventListener("DOMContentLoaded", function() {
    // Cargar productos desde productos.json
    fetch('productos.json')
        .then(response => response.json())
        .then(productos => {
            const carouselItems = document.getElementById('carouselItems');

            productos.forEach((producto, index) => {
                // Crear el contenedor del item del carrusel
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                
                // Asegurarse que el primer item sea 'active'
                if (index === 0) {
                    carouselItem.classList.add('active');
                }

                // Crear la estructura de la tarjeta respetando tus clases y contenedores
                const card = `
                    <div class="card" style="width: 12rem; margin: 0 auto; top: 0px;">
                        <div class="card" style="width: 12rem;">
                            <img src="${producto.imagenProducto}" class="card-img-top" alt="${producto.nombreProducto}">
                            <div class="card-body">
                                <h5 class="card-title">${producto.nombreProducto}</h5>
                                <p class="card-text">$${producto.precioProducto}</p>
                                <button class="btn btn-primary btnCarritocarousel" onclick="addToCart('${producto.nombreProducto}', ${producto.precioProducto}, '${producto.imagenProducto}')">Agregar al carrito</button>
                            </div>
                        </div>
                    </div>
                `;

                // Insertar la tarjeta en el item del carrusel
                carouselItem.innerHTML = card;
                carouselItems.appendChild(carouselItem);
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
});

// Función para cargar los productos desde el archivo JSON
async function cargarProductos() {
    try {
        // Hacer una solicitud para obtener el archivo JSON
        const response = await fetch('productos.json');
        const productos = await response.json();

        // Seleccionar el contenedor donde se agregarán los productos
        const contenedorProductos = document.querySelector('#productos .row');

        // Limpiar el contenido anterior (si es necesario)
        contenedorProductos.innerHTML = '';

        // Iterar sobre los productos y crear el HTML para cada uno
        productos.forEach(producto => {
            const productoHTML = `
                        <div class="col-6">
                            <div class="card">
                                <img src="${producto.imagenProducto}" class="card-img-top" alt="${producto.nombreProducto}">
                                <div class="card-body text-center">
                                    <p class="card-text">${producto.nombreProducto}</p>
                                    <p class="card-text"><strong>$${producto.precioProducto}</strong></p>
                                    <button class="btn btn-primary btnCarritogaleria" onclick="addToCart('${producto.nombreProducto}', ${producto.precioProducto}, '${producto.imagenProducto}')">Agregar al carrito</button>
                                </div>
                            </div>
                        </div>
            `;
            // Insertar el HTML generado en el contenedor
            contenedorProductos.innerHTML += productoHTML;
        });
    }catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

    // Llamar a la función cuando la página se haya cargado
    document.addEventListener('DOMContentLoaded', cargarProductos);

