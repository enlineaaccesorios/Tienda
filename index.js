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
        <div class="col-md-2">
            <img src="${image}" alt="Imagen del Producto" class="img-fluid">  <!-- Imagen del producto -->
        </div>

        <div class="col-md-4">
            <h5>${name}</h5>  <!-- Nombre del producto -->
        </div>
        
        <div class="col-md-3">
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
                    
        <div class="col-md-1 text-end">
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






// Función para enviar los productos del carrito al backend para validación de precios
async function sendOrder() {
    // Obtener los productos en el carrito
    const items = document.querySelectorAll('.cart-item');
    const products = [];

    // Iterar sobre los productos en el carrito para extraer nombre y precio
    items.forEach(item => {
        const name = item.querySelector('h5').textContent;  // Nombre del producto
        const price = parseFloat(item.querySelector('.item-price').getAttribute('data-unit-price'));  // Precio del producto
        const quantity = parseInt(item.querySelector('.cart-quantity-input').value);  // Cantidad

        // Agregar los productos al array de productos
        products.push({
            name: name,
            price: price * quantity  // Multiplicar precio por cantidad
        });
    });

    // Enviar la lista de productos al servidor para validación de precios
    const response = await fetch('/.netlify/functions/validate-prices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(products)  // Convertir los productos a JSON
    });

    const result = await response.json();

    // Si la validación es correcta, redirigir a WhatsApp con el enlace generado
    if (response.status === 200) {
        window.location.href = result.link;  // Redirigir a WhatsApp con el enlace del pedido
    } else {
        // Mostrar un mensaje de error si los precios han sido modificados
        alert(result.message);
    }
}

// Asignar la función `sendOrder` al botón "Iniciar Compra"
document.getElementById('iniciar-compra').addEventListener('click', sendOrder);
