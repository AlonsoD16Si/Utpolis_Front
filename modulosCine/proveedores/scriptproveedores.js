$(document).ready(function () {
    fetchProveedores();
 
    // Botón para recargar proveedores
    $('#reloadButton').on('click', function () {
        $('#loadingIndicator').show();
        fetchProveedores();
    });

     // Guardar un nuevo proveedor
     $('#saveProviderButton').on('click', function () {
        const proveedorData = {
            nombreProveedor: $('#providerName').val(),
            correo: $('#providerEmail').val(),
            telefono: $('#providerPhone').val()
        };

        // Validar campos requeridos
        if (!proveedorData.nombreProveedor || !proveedorData.correo || !proveedorData.telefono) {
            Swal.fire({
                title: '¡Error!',
                text: 'Por favor, completa todos los campos obligatorios.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        $.ajax({
            url: 'https://microservicio-provedor.onrender.com/api/proveedor',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(proveedorData),
            success: function () {
                fetchProveedores();
                $('#create-proveedor-form')[0].reset();
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Proveedor creado exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            },
            error: function (error) {
                console.error('Error al crear proveedor:', error);
                Swal.fire({
                    title: '¡Error!',
                    text: 'Error al crear proveedor.',
                    icon: 'error',
                    confirmButtonText: 'Inténtalo nuevamente'
                });
            }
        });
    });
});

// Función para cargar proveedores desde el microservicio
function fetchProveedores() {
    $('#loadingIndicator').show();
    $('.table-responsive').addClass('table-disabled');

    $.ajax({
        url: 'https://microservicio-provedor.onrender.com/api/proveedor',
        method: 'GET',
        success: function (response) {
            $('#loadingIndicator').hide();
            $('.table-responsive').removeClass('table-disabled');

            const proveedores = response || [];
            let proveedoresHtml = '';

            proveedores.forEach(proveedor => {
                proveedoresHtml += `
                    <tr>
                        <td>${proveedor.id}</td>
                        <td>${proveedor.nombreProveedor}</td>
                        <td>${proveedor.correo}</td>
                        <td>${proveedor.telefono}</td>
                        <td>
                            <div class="d-flex justify-content-center gap-2">
                                <button class="btn btn-outline-primary btn-sm" onclick="loadProveedorForEdit(${proveedor.id})">Editar</button>
                                <button class="btn btn-outline-danger btn-sm" onclick="deleteProveedor(${proveedor.id})">Eliminar</button>
                            </div>
                        </td>
                    </tr>`;
            });

            $('#providers-table-body').html(proveedoresHtml);
        },
        error: function (error) {
            $('#loadingIndicator').hide();
            $('.table-responsive').removeClass('table-disabled');
            console.error('Error al cargar proveedores:', error);
        }
    });
}

// Cargar datos de un proveedor para editar
function loadProveedorForEdit(proveedorId) {
    $.ajax({
        url: `https://microservicio-provedor.onrender.com/api/proveedor/${proveedorId}`,
        method: 'GET',
        success: function (response) {
            const proveedor = response;

            // Cargar los datos en el modal
            $('#editProveedorId').val(proveedor.id);
            $('#editProveedorName').val(proveedor.nombreProveedor);
            $('#editProveedorEmail').val(proveedor.correo);
            $('#editProveedorPhone').val(proveedor.telefono);

            // Mostrar el modal
            $('#editProveedorModal').modal('show');
        },
        error: function (error) {
            console.error('Error al cargar proveedor:', error);
        }
    });
}

// Guardar los cambios de un proveedor editado
function saveProveedorEdit() {
    const proveedorId = $('#editProveedorId').val();
    const proveedorData = {
        
        nombreProveedor: $('#editProveedorName').val(),
        correo: $('#editProveedorEmail').val(),
        telefono: $('#editProveedorPhone').val()
    };

    // Validación de campos requeridos
    if (!proveedorData.nombreProveedor || !proveedorData.correo || !proveedorData.telefono) {
        Swal.fire({
            title: '¡Error!',
            text: 'Por favor, completa todos los campos obligatorios.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    const saveButton = $('.btn-primary');
    saveButton.prop('disabled', true).html('<i class="mdi mdi-loading mdi-spin"></i> Guardando...');

    $.ajax({
        url: `https://microservicio-provedor.onrender.com/api/proveedor/actualizar/${proveedorId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(proveedorData),
        success: function () {
            $('#editProveedorModal').modal('hide');
            fetchProveedores();
            saveButton.prop('disabled', false).html('Guardar Cambios');
            Swal.fire({
                title: '¡Éxito!',
                text: 'Proveedor actualizado con éxito.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        },
        error: function (error) {
            console.error('Error al actualizar proveedor:', error);
            saveButton.prop('disabled', false).html('Guardar Cambios');
            Swal.fire({
                title: '¡Error!',
                text: 'Error al actualizar proveedor.',
                icon: 'error',
                confirmButtonText: 'Inténtalo nuevamente'
            });
        }
    });
}

// Eliminar un proveedor
function deleteProveedor(proveedorId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `https://microservicio-provedor.onrender.com/api/proveedor/${proveedorId}`,
                method: 'DELETE',
                success: function () {
                    fetchProveedores();
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'Proveedor eliminado con éxito.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                },
                error: function (error) {
                    console.error('Error al eliminar proveedor:', error);
                    Swal.fire({
                        title: '¡Error!',
                        text: 'Error al eliminar proveedor.',
                        icon: 'error',
                        confirmButtonText: 'Inténtalo nuevamente'
                    });
                }
            });
        }
    });
}
