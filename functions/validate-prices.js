// Esta es la función principal que se ejecutará cuando el usuario envíe un pedido desde el frontend.
exports.handler = async function(event, context) {

    // La información del pedido (los productos seleccionados) viene en el cuerpo de la solicitud HTTP (event.body).
    // Esta línea convierte esa información (que está en formato JSON) en un objeto de JavaScript.
    const products = JSON.parse(event.body);
  
    // Aquí estamos definiendo un objeto con los precios válidos de cada producto.
    // El 'id' de cada producto está asociado con su precio correcto.
    // Este objeto sirve como referencia para validar los precios que el cliente envía desde el frontend.
    const validPrices = {
      'producto1': 100,  // Producto 1 tiene un precio de 100
      'producto2': 200,  // Producto 2 tiene un precio de 200
      'producto3': 300   // Producto 3 tiene un precio de 300
    };
  
    // Este bloque de código recorre los productos que el cliente ha enviado en su pedido.
    // Usamos un bucle 'for' para verificar cada producto individualmente.
    for (let item of products) {
      
      // Para cada producto, comprobamos si el precio enviado por el cliente (item.price) 
      // coincide con el precio válido en nuestro objeto 'validPrices'.
      // Si el precio del cliente no coincide con el precio válido, devolvemos un error.
      if (validPrices[item.name] !== item.price) {
  
        // Retornamos un mensaje de error con un código de estado 400 (mala solicitud) si los precios no coinciden.
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Precio modificado, no se puede continuar." }) // Mensaje de error
        };
      }
    }
  
    // Si el bucle se completa y todos los precios coinciden con los valores válidos, 
    // pasamos a generar el enlace para el pedido en WhatsApp.
    // Aquí creamos un enlace con los detalles del pedido en formato JSON que el cliente enviará a WhatsApp.
    // El enlace contiene el número de teléfono (en este caso, '1234567890') y el texto con los productos seleccionados.
    const whatsappLink = `https://wa.me/1234567890?text=Hola%20quiero%20realizar%20un%20pedido%20de:%20${JSON.stringify(products)}`;
    
    // Si los precios son correctos, devolvemos un código de estado 200 (éxito) 
    // y enviamos de vuelta el enlace de WhatsApp generado para que el frontend lo utilice.
    return {
      statusCode: 200,
      body: JSON.stringify({ link: whatsappLink }) // Retornamos el enlace de WhatsApp
    };
  }
  