 
let cartItemCount = 0;
let totalAmount = 0;

function addToCart(name, price, image) {
    cartItemCount++;
    const itemId = `cart-item-${cartItemCount}`;
            
    // Crear un nuevo elemento para el producto
    const cartItem = document.createElement('div');
    cartItem.classList.add('row', 'cart-item', 'align-items-center');
    cartItem.id = itemId;

    // Crear el contenido del producto
    cartItem.innerHTML = `
        <div class="col-md-2">
            <img src="${image}" alt="Imagen del Producto" class="img-fluid">
        </div>

        <div class="col-md-4">
            <h5>${name}</h5>
        </div>
        
        <div class="col-md-3">
            <div class="input-group">
                <button class="btn btn-outline-secondary" type="button" onclick="decrementQuantity(this)">-</button>
                <input type="number" class="form-control cart-quantity-input" value="1" min="1" onchange="updateTotal(${price}, this)">
                <button class="btn btn-outline-secondary" type="button" onclick="incrementQuantity(this)">+</button>
            </div>
        </div>
                    
        <div class="col-md-2 text-end cart-item-subtotal">
            $<span class="item-price" data-unit-price="${price}">${price.toLocaleString()}</span>
        </div>
                    
        <div class="col-md-1 text-end">
            <button class="btn btn-delete" onclick="removeItem('${itemId}', ${price})">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zM7.5 1a1 1 0 0 1 1 1v1h2.5a.5.5 0 0 1 0 1h-8a.5.5 0 0 1 0-1H6.5V2a1 1 0 0 1 1-1zM5 4v10.5A1.5 1.5 0 0 0 6.5 16h3a1.5 1.5 0 0 0 1.5-1.5V4h-6z"/>
                </svg>
            </button>
        </div>

    `;

    // Agregar el nuevo producto al carrito
        const cartContainer = document.getElementById('cart-items-container');
        cartContainer.appendChild(cartItem);
            
    // Actualizar el total del carrito
        totalAmount += price;
        updateCartTotal();
}

function incrementQuantity(button) {
    let input = button.parentElement.querySelector('.cart-quantity-input');
    input.value = parseInt(input.value) + 1;
    updateTotal(parseFloat(button.closest('.cart-item').querySelector('.item-price').getAttribute('data-unit-price')), input);
}

function decrementQuantity(button) {
    let input = button.parentElement.querySelector('.cart-quantity-input');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
        updateTotal(parseFloat(button.closest('.cart-item').querySelector('.item-price').getAttribute('data-unit-price')), input);
    }
}

function removeItem(itemId, price) {
    // Eliminar el producto del carrito
    const item = document.getElementById(itemId);
    if (item) {
        item.remove();
    }
            
    // Recalcular el total del carrito
    recalculateTotal();
}

function updateCartTotal() {
    const totalElement = document.getElementById('cart-total-amount');
    totalElement.textContent = totalAmount.toLocaleString();
}

function updateTotal(price, inputElement) {
    const quantity = parseInt(inputElement.value); // Asegurarse de que sea un número entero
    const itemElement = inputElement.closest('.cart-item');
    const unitPrice = parseFloat(itemElement.querySelector('.item-price').getAttribute('data-unit-price')); // Obtener el precio unitario original

    // Calcular el subtotal para este producto
    const subtotalElement = itemElement.querySelector('.item-price');
    subtotalElement.textContent = (unitPrice * quantity).toLocaleString();
            
    // Recalcular el total del carrito después de actualizar la cantidad
    recalculateTotal();
}

function recalculateTotal() {
    const items = document.querySelectorAll('.cart-item');
    totalAmount = 0;
            
    items.forEach(item => {
        const unitPrice = parseFloat(item.querySelector('.item-price').getAttribute('data-unit-price'));
        const quantity = parseInt(item.querySelector('.cart-quantity-input').value);
        totalAmount += unitPrice * quantity;
    });
            
    updateCartTotal();
}



//compra de productos agrgados al carrito
function enviarPedidoWhatsApp() {
    const items = document.querySelectorAll('.cart-item');
    let mensaje = "¡Hola! Me gustaría comprar lo siguiente:\n\n";
        
        // Iterar sobre los productos en el carrito
    items.forEach(item => {
        const nombreProducto = item.querySelector('h5').textContent; // Nombre del producto
        const unitPrice = parseFloat(item.querySelector('.item-price').getAttribute('data-unit-price')); // Precio unitario
        const cantidad = parseInt(item.querySelector('.cart-quantity-input').value); // Cantidad
        const totalProducto = unitPrice * cantidad; // Total del producto    
        mensaje += `Producto: ${nombreProducto}\n`;
        mensaje += `Precio: $${unitPrice.toLocaleString()}\n`;
        mensaje += `Cantidad: ${cantidad}\n`;
        mensaje += `Total: $${totalProducto.toLocaleString()}\n\n`;
    });
        
    // Calcular el total final del carrito
    mensaje += `Total del carrito: $${totalAmount.toLocaleString()}\n`;
        
     // Enlace a WhatsApp con el mensaje
    const numeroWhatsApp = "+543584399691"; // Reemplaza con tu número
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        
    // Abrir WhatsApp en una nueva ventana
    window.open(urlWhatsApp, '_blank');
}
        