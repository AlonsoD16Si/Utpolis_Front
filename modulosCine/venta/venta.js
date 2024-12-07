$(document).ready(function () {
    fetchVentas();  // Cargar las ventas al inicio
    // Botón para recargar ventas
    $('#reloadButton').on('click', function () {
        $('#loadingIndicator').show();
        fetchVentas();
    });
    console.log(Swal); // Debería mostrar el objeto SweetAlert2

    // Guardar una nueva venta
    $('#saveVentaButton').on('click', function () {
        const ventaData = {
            fecha: $('#ventaFecha').val(),
            empleado_id: parseInt($('#ventaEmpleado').val()),
            cliente_id: parseInt($('#ventaCliente').val())
        };

        // Validar campos requeridos
        if (!ventaData.fecha || isNaN(ventaData.empleado_id) || isNaN(ventaData.cliente_id)) {
            Swal.fire({
                title: '¡Error!',
                text: 'Por favor, completa todos los campos obligatorios.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        $.ajax({
            url: 'https://microservicio-provedor.onrender.com/api/venta',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(ventaData),
            success: function () {
                fetchVentas();
                $('#create-venta-form')[0].reset();
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Venta creada exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            },
            error: function (error) {
                console.error('Error al crear venta:', error);
                Swal.fire({
                    title: '¡Error!',
                    text: 'Error al crear venta.',
                    icon: 'error',
                    confirmButtonText: 'Inténtalo nuevamente'
                });
            }
        });
    });
});

// Función para cargar las ventas
function fetchVentas() {
    $('#loadingIndicator').show();
    $('.table-responsive').addClass('table-disabled');

    $.ajax({
        url: 'https://microservicio-provedor.onrender.com/api/venta',
        method: 'GET',
        success: function (response) {
            $('#loadingIndicator').hide();
            $('.table-responsive').removeClass('table-disabled');

            const ventas = response || [];
            let ventasHtml = '';

            ventas.forEach(venta => {
                console.log(`Venta ID: ${venta.id}, Fecha: ${venta.fecha}`);

                // Construir la fila para cada venta
                ventasHtml += `
                    <tr>
                        <td>${venta.id}</td>
                        <td>${new Date(venta.fecha).toLocaleString()}</td>
                        <td>${venta.empleado.persona.nombres} ${venta.empleado.persona.apellidos}</td>
                        <td>${venta.cliente.persona.nombres} ${venta.cliente.persona.apellidos}</td>
                        <td>
                            <div class="d-flex justify-content-center gap-2">
                                <button class="btn btn-outline-primary btn-sm" onclick="loadVentaForEdit(${venta.id})">Editar</button>
                                <button class="btn btn-outline-danger btn-sm" onclick="deleteVenta(${venta.id})">Eliminar</button>
                            </div>
                        </td>
                    </tr>`;
            });

            $('#ventas-table-body').html(ventasHtml);
        },
        error: function (error) {
            $('#loadingIndicator').hide();
            $('.table-responsive').removeClass('table-disabled');
            console.error('Error al cargar ventas:', error);
        }
    });
}

// Función para cargar una venta para editar
function loadVentaForEdit(ventaId) {
    $.ajax({
        url: `https://microservicio-provedor.onrender.com/api/venta/${ventaId}`,
        method: 'GET',
        success: function (response) {
            const venta = response;

            // Cargar los datos en el modal
            $('#editVentaId').val(venta.id);
            $('#editVentaFecha').val(new Date(venta.fecha).toLocaleString());
            $('#editVentaEmpleado').val(venta.empleado.id);
            $('#editVentaCliente').val(venta.cliente.id);

            // Mostrar el modal
            $('#editVentaModal').modal('show');
        },
        error: function (error) {
            console.error('Error al cargar venta:', error);
        }
    });
}

// Función para guardar los cambios de una venta
function saveVentaEdit() {
    const ventaId = $('#editVentaId').val();
    const ventaData = {
        fecha: $('#editVentaFecha').val(),
        empleado_id: parseInt($('#editVentaEmpleado').val()),
        cliente_id: parseInt($('#editVentaCliente').val())
    };

    $.ajax({
        url: `https://microservicio-provedor.onrender.com/api/venta/${ventaId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(ventaData),
        success: function () {
            fetchVentas();
            $('#edit-venta-form')[0].reset();
            Swal.fire({
                title: '¡Éxito!',
                text: 'Venta editada exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        },
        error: function (error) {
            console.error('Error al editar venta:', error);
            Swal.fire({
                title: '¡Error!',
                text: 'Error al editar venta.',
                icon: 'error',
                confirmButtonText: 'Inténtalo nuevamente'
            });
        }
    });
}

// Función para eliminar una venta
function deleteVenta(ventaId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esta acción!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `https://microservicio-provedor.onrender.com/api/venta/${ventaId}`,
                method: 'DELETE',
                success: function () {
                    fetchVentas();
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'La venta ha sido eliminada.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                },
                error: function (error) {
                    console.error('Error al eliminar venta:', error);
                    Swal.fire({
                        title: '¡Error!',
                        text: 'No se pudo eliminar la venta.',
                        icon: 'error',
                        confirmButtonText: 'Inténtalo nuevamente'
                    });
                }
            });
        }
    });
}
