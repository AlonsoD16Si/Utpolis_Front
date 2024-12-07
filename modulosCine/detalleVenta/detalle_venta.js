$(document).ready(function () {
    // Obtener todos los detalles de venta al cargar la página
    fetchDetallesVenta();

    // Registrar un nuevo detalle de venta
    $('#registrarDetalleVentaButton').on('click', function () {
        const ventaId = parseInt($('#ventaId').val());
        const productoId = parseInt($('#productoId').val());
        const funcionId = parseInt($('#funcionId').val());
        const asientos = $('#asientos').val().split(',').map(Number);
        const cantidad = parseInt($('#cantidad').val());
        const subtotalDetalle = parseFloat($('#subtotalDetalle').val());

        if (!ventaId || !productoId || !funcionId || !asientos.length || !cantidad || !subtotalDetalle) {
            Swal.fire({
                title: 'Error',
                text: 'Completa todos los campos antes de continuar.',
                icon: 'error',
            });
            return;
        }

        $.ajax({
            url: 'https://detallesventaapi.com/api/detalle-venta',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                venta: ventaId,
                producto: productoId,
                funcion: funcionId,
                asientos: asientos,
                cantidad: cantidad,
                subtotalDetalle: subtotalDetalle,
            }),
            success: function (response) {
                fetchDetallesVenta();
                Swal.fire({
                    title: 'Éxito',
                    text: 'Detalle de venta registrado correctamente.',
                    icon: 'success',
                });
            },
            error: function () {
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un problema al registrar el detalle de venta.',
                    icon: 'error',
                });
            },
        });
    });

    // Recargar lista de detalles de venta
    $('#reloadButtonDetalles').on('click', fetchDetallesVenta);
});

// Obtener todos los detalles de venta
function fetchDetallesVenta() {
    $('#loadingIndicatorDetalles').show();
    $.ajax({
        url: 'https://detallesventaapi.com/api/detalle-venta',
        method: 'GET',
        success: function (response) {
            const detalles = response || [];
            let detallesHtml = '';

            detalles.forEach((detalle) => {
                detallesHtml += `
                    <tr>
                        <td>${detalle.id}</td>
                        <td>${detalle.venta}</td>
                        <td>${detalle.producto}</td>
                        <td>${detalle.funcion}</td>
                        <td>${detalle.asientos.join(', ')}</td>
                        <td>${detalle.cantidad}</td>
                        <td>${detalle.subtotalDetalle}</td>
                    </tr>`;
            });

            $('#detalle-venta-table-body').html(detallesHtml);
            $('#loadingIndicatorDetalles').hide();
        },
        error: function () {
            $('#loadingIndicatorDetalles').hide();
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cargar los detalles de venta.',
                icon: 'error',
            });
        },
    });
}
