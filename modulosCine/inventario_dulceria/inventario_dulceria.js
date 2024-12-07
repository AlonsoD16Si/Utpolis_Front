$(document).ready(function () {
    // Obtener productos al cargar la página
    fetchProductos();

    // Actualizar inventario
    $('#updateInventoryButton').on('click', function () {
        const productId = parseInt($('#productId').val());
        const quantity = parseInt($('#quantity').val());
        const operation = $('#operation').val();

        if (!productId || !quantity || !operation) {
            Swal.fire({
                title: 'Error',
                text: 'Completa todos los campos antes de continuar.',
                icon: 'error',
            });
            return;
        }

        const url =
            operation === 'sumar'
                ? 'https://inventarioapi.vercel.app/api/sumarInventario'
                : 'https://inventarioapi.vercel.app/api/restarInventario';

        $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                producto_id: productId,
                cantidad: quantity,
            }),
            success: function () {
                fetchProductos();
                Swal.fire({
                    title: 'Éxito',
                    text: `Se ha ${operation === 'sumar' ? 'sumado' : 'restado'} correctamente.`,
                    icon: 'success',
                });
            },
            error: function () {
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un problema al actualizar el inventario.',
                    icon: 'error',
                });
            },
        });
    });

    // Recargar productos
    $('#reloadButton').on('click', fetchProductos);
});

// Obtener todos los productos
function fetchProductos() {
    $('#loadingIndicator').show();
    $.ajax({
        url: 'https://inventarioapi.vercel.app/api/inventario',
        method: 'GET',
        success: function (response) {
            const productos = response || [];
            let productsHtml = '';

            productos.forEach((producto) => {
                productsHtml += `
                    <tr>
                        <td>${producto.producto_id}</td>
                        <td>${producto.nombre_producto || 'Sin nombre'}</td>
                        <td>${producto.existencia}</td>
                        <td>${new Date(producto.fecha).toLocaleDateString('es-MX')}</td>
                        <td>${producto.tipo_movimiento || 'N/A'}</td>
                        <td>${producto.proveedor_id || 'N/A'}</td>
                    </tr>`;
            });

            $('#productos-table-body').html(productsHtml);
            $('#loadingIndicator').hide();
        },
        error: function () {
            $('#loadingIndicator').hide();
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cargar el inventario.',
                icon: 'error',
            });
        },
    });
}