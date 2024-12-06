$(document).ready(function () {
    fetchProductos();

    // Botón para sumar cantidad
    $('#sumarInventarioButton').on('click', function () {
        const data = {
            producto_id: parseInt($('#productId').val()),
            cantidad: parseInt($('#productQuantity').val())
        };

        if (isNaN(data.producto_id) || isNaN(data.cantidad)) {
            Swal.fire({
                title: '¡Error!',
                text: 'Por favor, completa todos los campos.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        $.ajax({
            url: 'https://inventarioapi.vercel.app/api/sumarInventario',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function () {
                fetchProductos();
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Cantidad sumada al inventario.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            },
            error: function (error) {
                console.error('Error:', error);
                Swal.fire({
                    title: '¡Error!',
                    text: 'Error al sumar cantidad.',
                    icon: 'error',
                    confirmButtonText: 'Inténtalo nuevamente'
                });
            }
        });
    });

    // Botón para restar cantidad
    $('#restarInventarioButton').on('click', function () {
        const data = {
            producto_id: parseInt($('#productId').val()),
            cantidad: parseInt($('#productQuantity').val())
        };

        if (isNaN(data.producto_id) || isNaN(data.cantidad)) {
            Swal.fire({
                title: '¡Error!',
                text: 'Por favor, completa todos los campos.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        $.ajax({
            url: 'https://inventarioapi.vercel.app/api/restarInventario',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function () {
                fetchProductos();
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Cantidad restada del inventario.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            },
            error: function (error) {
                console.error('Error:', error);
                Swal.fire({
                    title: '¡Error!',
                    text: 'Error al restar cantidad.',
                    icon: 'error',
                    confirmButtonText: 'Inténtalo nuevamente'
                });
            }
        });
    });
});

// Obtener todos los productos
function fetchProductos() {
    $('#loadingIndicator').show();
    $.ajax({
        url: 'https://inventarioapi.vercel.app/api/inventario',
        method: 'GET',
        success: function (response) {
            $('#loadingIndicator').hide();
            const productos = response || [];
            let html = '';

            productos.forEach(producto => {
                html += `
                    <tr>
                        <td>${producto.producto_id}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.existencia}</td>
                    </tr>`;
            });

            $('#productos-table-body').html(html);
        },
        error: function (error) {
            $('#loadingIndicator').hide();
            console.error('Error al cargar productos:', error);
        }
    });
}
